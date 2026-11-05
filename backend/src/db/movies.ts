import { db, transaction } from './database.js';
import type { Cinema, Movie, WeeklySchedule } from '../types.js';
import type { MovieRow, CinemaRow, ShowtimeRow } from './types.js';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

const emptySchedule = (): WeeklySchedule => ({
  Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [],
});

const insertMovie = db.prepare(`
  INSERT INTO movies (id, position, greek_title, original_title, year, duration, summary, tags, directors,
    actors, imdb_link, imdb_rating, imdb_votes, athinorama_link, image_url, trailer)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
// The last value scraped wins for address, outdoor and tickets link.
const upsertCinema = db.prepare(`
  INSERT INTO cinemas (name, location, address, is_outdoor, tickets_url) VALUES (?, ?, ?, ?, ?)
  ON CONFLICT (name, location) DO UPDATE SET
    address = excluded.address, is_outdoor = excluded.is_outdoor, tickets_url = excluded.tickets_url
  RETURNING id
`);
const insertMovieCinema = db.prepare('INSERT OR IGNORE INTO movie_cinemas (movie_id, cinema_id, position, raw_schedule) VALUES (?, ?, ?, ?)');
const insertShowtime = db.prepare('INSERT INTO showtimes (movie_id, cinema_id, day, time) VALUES (?, ?, ?, ?)');
const setLastUpdate = db.prepare(`INSERT INTO meta (key, value) VALUES ('lastUpdate', ?)
  ON CONFLICT (key) DO UPDATE SET value = excluded.value`);
const selectLastUpdate = db.prepare(`SELECT value FROM meta WHERE key = 'lastUpdate'`);

// Replaces every movie with the new scrape and sets the update time, in one transaction.
const replaceAllMovies = (movies: Movie[]): void => {
  transaction(() => {
    db.exec('DELETE FROM movies'); // movie_cinemas and showtimes go with them

    const seen = new Set<string>();
    movies.forEach((movie, position) => {
      if (seen.has(movie.id)) return;
      seen.add(movie.id);

      insertMovie.run(
        movie.id,
        position,
        movie.greekTitle,
        movie.originalTitle ?? null,
        movie.year ?? null,
        movie.duration ?? null,
        movie.summary ?? null,
        JSON.stringify(movie.tags ?? []),
        JSON.stringify(movie.directors ?? []), 
        JSON.stringify(movie.actors ?? []), 
        movie.imdbLink ?? null,
        movie.imdbRating ?? null, 
        movie.popularity ?? null, 
        movie.athinoramaLink ?? null,
        movie.imageUrl ?? null,
        movie.trailer ?? null,
      );

      movie.cinemas.forEach((cinema, cinemaPosition) => {
        const { id: cinemaId } = upsertCinema.get(
          cinema.cinema, cinema.cinemaLocation, cinema.cinemaAddress ?? null,
          cinema.isOutdoor ? 1 : 0, cinema.ticketsUrl ?? null,
        ) as { id: number };
        // parseSchedule returns the scraped text as a plain string when it can't read the times.
        // That string is saved as is, so the frontend shows it instead of an empty schedule.
        const schedule = cinema.cinemaSchedule;
        const rawSchedule = typeof schedule === 'string' ? schedule : null;
        insertMovieCinema.run(movie.id, cinemaId, cinemaPosition, rawSchedule);

        if (!schedule || typeof schedule !== 'object') return;
        for (const day of DAYS) {
          for (const time of schedule[day] ?? []) insertShowtime.run(movie.id, cinemaId, day, time);
        }
      });
    });

    setLastUpdate.run(new Date().toISOString());
  });
};

// Removes all movies and the update time (cinema rows stay, so their ids stay stable).
const clearMovies = (): void => {
  transaction(() => {
    db.exec('DELETE FROM movies');
    db.exec(`DELETE FROM meta WHERE key = 'lastUpdate'`);
  });
};

const getLastUpdate = (): Date | null => {
  const row = selectLastUpdate.get() as { value: string } | undefined;
  return row ? new Date(row.value) : null;
};

// Same JSON shape the scraper produces. Optional fields are left out when missing.
const rowToMovie = (row: MovieRow, cinemas: Cinema[]): Movie => {
  const movie: Movie = {
    id: row.id,
    greekTitle: row.greek_title,
    originalTitle: row.original_title ?? '',
    year: row.year ?? '',
    duration: row.duration ?? '',
    tags: JSON.parse(row.tags),
    summary: row.summary ?? '',
    directors: JSON.parse(row.directors),
    actors: JSON.parse(row.actors),
    imdbLink: row.imdb_link ?? '',
    athinoramaLink: row.athinorama_link ?? '',
    imageUrl: row.image_url ?? '',
    trailer: row.trailer ?? undefined,
    cinemas,
  };
  if (row.imdb_rating !== null) movie.imdbRating = row.imdb_rating;
  if (row.imdb_votes !== null) movie.popularity = row.imdb_votes;
  return movie;
};

const rowToCinema = (row: CinemaRow, cinemaSchedule: WeeklySchedule | string): Cinema => {
  const cinema: Cinema = {
    id: row.id,
    cinema: row.name,
    cinemaLocation: row.location,
    cinemaAddress: row.address ?? '',
    isOutdoor: row.is_outdoor === 1,
    cinemaSchedule,
  };
  if (row.tickets_url !== null) cinema.ticketsUrl = row.tickets_url;
  return cinema;
};

// Groups showtimes by "movieId|cinemaId", keeping their insertion order.
const groupShowtimes = (rows: ShowtimeRow[]): Map<string, WeeklySchedule> => {
  const schedules = new Map<string, WeeklySchedule>();
  for (const row of rows) {
    const key = `${row.movie_id}|${row.cinema_id}`;
    if (!schedules.has(key)) schedules.set(key, emptySchedule());
    schedules.get(key)![row.day as keyof WeeklySchedule]?.push(row.time);
  }
  return schedules;
};

const selectAllMovies = db.prepare('SELECT * FROM movies ORDER BY position');
const selectAllMovieCinemas = db.prepare(`
  SELECT mc.movie_id, mc.raw_schedule, c.* FROM movie_cinemas mc JOIN cinemas c ON c.id = mc.cinema_id
  ORDER BY mc.movie_id, mc.position
`);
const selectAllShowtimes = db.prepare('SELECT movie_id, cinema_id, day, time FROM showtimes ORDER BY rowid');

const getAllMovies = (): Movie[] => {
  const schedules = groupShowtimes(selectAllShowtimes.all() as ShowtimeRow[]);

  const cinemasByMovie = new Map<string, Cinema[]>();
  for (const row of selectAllMovieCinemas.all() as (CinemaRow & { movie_id: string; raw_schedule: string | null })[]) {
    const schedule = row.raw_schedule ?? schedules.get(`${row.movie_id}|${row.id}`) ?? emptySchedule();
    if (!cinemasByMovie.has(row.movie_id)) cinemasByMovie.set(row.movie_id, []);
    cinemasByMovie.get(row.movie_id)!.push(rowToCinema(row, schedule));
  }

  return (selectAllMovies.all() as MovieRow[]).map(row => rowToMovie(row, cinemasByMovie.get(row.id) ?? []));
};

export {
  replaceAllMovies,
  clearMovies,
  getAllMovies,
  getLastUpdate,
  rowToMovie,
  rowToCinema,
  groupShowtimes,
  emptySchedule,
};
