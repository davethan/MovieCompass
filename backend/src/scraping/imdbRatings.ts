import { createGunzip } from 'zlib';
import { createInterface } from 'readline';
import { Readable } from 'stream';
import type { Movie } from '../types.js';

// Official IMDb datasets, refreshed daily by IMDb (free for non-commercial use).
// https://developer.imdb.com/non-commercial-datasets/
const RATINGS_URL = 'https://datasets.imdbws.com/title.ratings.tsv.gz'; // ~8 MB
const BASICS_URL = 'https://datasets.imdbws.com/title.basics.tsv.gz';   // ~230 MB, titles & years

type ImdbRating = { rating: string; votes: number };
type TitleCandidate = { id: string; year: number; runtime: number | null };

const MOVIE_TYPES = new Set(['movie', 'tvMovie', 'video', 'tvSpecial']);
const GREEK_LETTERS = /[Ͱ-Ͽἀ-῿]/;

const getImdbId = (imdbLink: string) => imdbLink?.match(/tt\d+/)?.[0] ?? null;

// Reads a gzipped IMDb TSV line by line without keeping it in memory.
// `onLine` can return false to stop early. The header line is skipped.
const streamImdbDataset = async (url: string, onLine: (line: string) => boolean | void) => {
    const response = await fetch(url);
    if (!response.ok || !response.body) {
        throw new Error(`IMDb dataset download failed (${url}): HTTP ${response.status}`);
    }
    const lines = createInterface({
        input: Readable.fromWeb(response.body as any).pipe(createGunzip()),
        crlfDelay: Infinity,
    });
    let isHeader = true;
    for await (const line of lines) {
        if (isHeader) { isHeader = false; continue; }
        if (onLine(line) === false) break;
    }
    lines.close();
};

// Keeps only the ratings of the given ids.
const fetchImdbRatings = async (ids: Set<string>): Promise<Map<string, ImdbRating>> => {
    const found = new Map<string, ImdbRating>();
    if (ids.size === 0) return found;
    await streamImdbDataset(RATINGS_URL, (line) => {
        const tconst = line.slice(0, line.indexOf('\t'));
        if (!ids.has(tconst)) return;
        const [, rating, numVotes] = line.split('\t');
        found.set(tconst, { rating: Number(rating).toFixed(1), votes: Number(numVotes) || 0 });
        if (found.size === ids.size) return false; // all found, stop downloading
    });
    return found;
};

// Lowercase, no accents, no punctuation and no spaces, so small spelling differences still match:
// "My Father’s Shadow" -> "myfathersshadow", "THE DEERHUNTER" and "The Deer Hunter" -> "thedeerhunter"
const normalizeTitle = (title: string) => title
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '');

// Original title parts ("Dossier 137 / Case 137") plus the "Greek" title when it is actually in Latin script.
const getCandidateTitles = (movie: Movie): string[] => {
    const titles = movie.originalTitle ? movie.originalTitle.split('/') : [];
    if (movie.greekTitle && !GREEK_LETTERS.test(movie.greekTitle)) titles.push(movie.greekTitle);
    return [...new Set(titles.map(normalizeTitle).filter(Boolean))];
};

// For movies without an IMDb link, finds IMDb titles with the same title and a year within ±1.
const findTitleCandidates = async (movies: Movie[]): Promise<Map<Movie, TitleCandidate[]>> => {
    const byTitle = new Map<string, Movie[]>();
    movies.forEach(movie => {
        if (movie.imdbLink || !Number(movie.year)) return;
        getCandidateTitles(movie).forEach(title => {
            byTitle.set(title, [...(byTitle.get(title) ?? []), movie]);
        });
    });

    const candidates = new Map<Movie, TitleCandidate[]>();
    if (byTitle.size === 0) return candidates;

    // Columns: tconst, titleType, primaryTitle, originalTitle, isAdult, startYear, endYear, runtimeMinutes, genres
    await streamImdbDataset(BASICS_URL, (line) => {
        const firstTab = line.indexOf('\t');
        const titleType = line.slice(firstTab + 1, line.indexOf('\t', firstTab + 1));
        if (!MOVIE_TYPES.has(titleType)) return; // cheap skip for episodes, series etc.

        const [tconst, , primaryTitle, originalTitle, isAdult, startYear, , runtimeMinutes] = line.split('\t');
        if (isAdult === '1') return;
        const year = Number(startYear);
        if (!year) return;

        const matched = new Set<Movie>();
        [primaryTitle, originalTitle].forEach(title => {
            byTitle.get(normalizeTitle(title))?.forEach(movie => matched.add(movie));
        });
        matched.forEach(movie => {
            if (Math.abs(year - Number(movie.year)) > 1) return;
            const runtime = Number(runtimeMinutes) || null;
            candidates.set(movie, [...(candidates.get(movie) ?? []), { id: tconst, year, runtime }]);
        });
    });
    return candidates;
};

// Best candidate: exact year first, then runtime close to Athinorama's (±15 min), then most votes.
const pickBestCandidate = (movie: Movie, candidates: TitleCandidate[], ratings: Map<string, ImdbRating>) => {
    const duration = Number(movie.duration) || null;
    const score = (c: TitleCandidate) => [
        c.year === Number(movie.year) ? 1 : 0,
        !duration || !c.runtime || Math.abs(c.runtime - duration) <= 15 ? 1 : 0,
        ratings.get(c.id)?.votes ?? 0,
    ];
    return [...candidates].sort((a, b) => {
        const sa = score(a), sb = score(b);
        for (let i = 0; i < sa.length; i++) if (sa[i] !== sb[i]) return sb[i] - sa[i];
        return 0;
    })[0];
};

// Writes imdbRating & popularity into the movies found in the IMDb dataset.
// With matchTitles, movies without an IMDb link are first matched by title + year, and get an imdbLink if found.
// Movies not found are left untouched, so the frontend falls back to OMDB for them.
// On failure, the movies keep whatever ratings they already had.
const applyImdbRatings = async (movies: Movie[], { matchTitles = false } = {}): Promise<void> => {
    let candidates = new Map<Movie, TitleCandidate[]>();
    if (matchTitles) {
        try {
            const start = Date.now();
            candidates = await findTitleCandidates(movies);
            console.log(`IMDb titles: found candidates for ${candidates.size} movies without a link (${Math.round((Date.now() - start) / 1000)}s)`);
        } catch (error) {
            console.error('Failed to match movies by title in IMDb dataset', error);
        }
    }

    try {
        const ids = new Set<string>();
        movies.forEach(movie => { const id = getImdbId(movie.imdbLink); if (id) ids.add(id); });
        candidates.forEach(list => list.forEach(c => ids.add(c.id)));

        const ratings = await fetchImdbRatings(ids);

        candidates.forEach((list, movie) => {
            const best = pickBestCandidate(movie, list, ratings);
            movie.imdbLink = `https://www.imdb.com/title/${best.id}/`;
            console.log(`IMDb title match: "${movie.originalTitle || movie.greekTitle}" (${movie.year}) -> ${best.id} (${best.year})`);
        });

        let rated = 0;
        movies.forEach(movie => {
            const id = getImdbId(movie.imdbLink);
            const result = id ? ratings.get(id) : undefined;
            if (!result) return;
            movie.imdbRating = result.rating;
            movie.popularity = result.votes;
            rated++;
        });
        console.log(`IMDb ratings: rated ${rated} of ${movies.length} movies`);
    } catch (error) {
        console.error('Failed to apply IMDb ratings from dataset', error);
    }
};

export { applyImdbRatings };
