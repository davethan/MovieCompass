---
name: movie-data-flow
description: How MovieCompass gets current movies (Athinorama scraping cron) and their IMDb ratings (official IMDb dataset on the backend, OMDB fallback in the frontend). Use when working on, debugging, or explaining movie fetching, the cron jobs, the IMDb dataset, OMDB calls, the rating lookup in the frontend store, or Render hosting (CPU/RAM limits, Node version).
---

# MovieCompass movie & rating data flow

## Hosting
- Hosted on Render (`athenscinemas.onrender.com`) on the cheap paid plan the user pays for: **less than 1 CPU, 512 MB RAM, $7/month**.
- It's a paid plan, so the server doesn't sleep when idle (unlike Render's free plan). It restarts, and starts with an empty movie list, only on deploys, crashes or Render restarts.
- The small CPU and RAM are the main limits: keep scraping and the IMDb downloads light on memory, and don't add work that needs more resources without checking it fits.
- **Node version:** both `backend/package.json` and `frontend/package.json` have `"engines": { "node": ">=24.3.0" }`. There is no `.nvmrc`, `.node-version` or `render.yaml`.
  - On 2026-11-03 Render ran **Node 26.13.0** (checked with `node -v` in Render dashboard → athenscinemas → Manage → Shell). That shell runs on the live instance, so it shows the version the app runs on.
  - Not confirmed whether Render reads `engines`: build and start run from the repo root (`host-build.js` / `host-start.js`), which has no `package.json`, and Render reads `engines` only from the service's root directory. 26.13.0 may just be Render's default. The top of a Render build log says where the version came from (`via ./package.json` or default).
  - `>=24.3.0` has no upper limit, so a deploy can silently move to a newer Node major. To pin it, use e.g. `"26.x"`, a root `.node-version` file, or a `NODE_VERSION` env var in Render (the env var overrides the others).

## Backend (Express, `backend/src`)

### 1. Movies: Athinorama scraping cron (`scraping/cron.ts`)
- `cronJob()` scrapes `https://www.athinorama.gr/cinema` (`getAthinoramaCurrentMovies` → `parseAthinoramaMovies`), then fetches each movie's detail page in parallel (`getAthinoramaMovieDetails` → `extractAthinoramaMovieDetails`). Failed detail fetches are dropped.
- Before publishing, it calls `applyImdbRatings(movies, { matchTitles: true })` (see 2), then replaces `movieDataFromCronJob`. The old list stays visible while a scrape runs (~1 min).
- Always started through `runCronJob()`, which reuses the job already running, so runs never overlap. While the list is still empty (right after a cold start), `/athinoramaMoviesDetails` waits for the running job (`waitForCurrentRun`) instead of returning no movies.
- Runs at server start (`app.ts`), Thursday 17:00 and 21:00, and Friday 18:00 (Europe/Athens).
  - **Why these times:** in Greece the cinema schedule changes every Thursday for all cinemas, so new movies and showtimes appear then.
  - **Why the repeats:** Athinorama often finishes adding the new movies only a day later, so the 21:00 and Friday runs catch late updates. Don't remove them as "duplicates".
  - Ratings are refreshed only by these runs. If the schedule changes, ratings freshness changes with it.
- Served by `GET /athinoramaMoviesDetails` → `{ films, lastCronJobRun }`.

### 2. Ratings: official IMDb datasets (`scraping/imdbRatings.ts`)
- IMDb blocks scraping, so everything comes from IMDb's official files, streamed with `streamImdbDataset` and never held in memory.
- **Title matching** (`matchTitles: true`, scrape only). Athinorama gives an `imdbLink` for only ~20% of movies, so the rest are matched against `title.basics.tsv.gz` (~230 MB, ~50s):
  - Candidate titles: each `/` part of `originalTitle`, plus `greekTitle` if it contains no Greek letters. Greek-only titles are skipped.
  - `normalizeTitle`: lowercase, no accents, `&`→`and`, no punctuation or spaces (`THE DEERHUNTER` = `The Deer Hunter`).
  - Only `movie`/`tvMovie`/`video`/`tvSpecial`, non-adult titles whose `startYear` is within ±1 of the Athinorama year.
  - `pickBestCandidate`: exact year, then runtime within ±15 min of `duration`, then most votes.
  - The winner's `imdbLink` is written onto the movie, so the UI shows the link too.
  - Result on 2026-11-03: 81 of 88 movies matched. The 7 left are Greek-only titles.
- **Ratings**: `title.ratings.tsv.gz` (~8 MB, ~1.6M rows) is streamed, keeping only the IDs we need (existing links + title candidates). It stops early once all are found.
- Matches are written onto the movie objects: `imdbRating` (string, e.g. `"7.4"`) and `popularity` (vote count, number). Both are optional in `Movie` (`types.ts`).
- Movies without an `imdbLink`, or not in the dataset, are left without these fields.
- If the download fails, movies keep whatever ratings they had (none on a fresh scrape).
- Ratings are only fetched as part of `cronJob()`, right after a new Athinorama list. There is no separate ratings refresh.
- The ratings file is looked up by IMDb ID only. Title matching happens earlier, against `title.basics`.
- There is no rating endpoint anymore: `/imdbMovieRating` was removed.

## Frontend (Vue + Pinia, `frontend/src/stores/movies.js`)

1. `App.vue` calls `getAllCurrentMoviesDetails()` (`GET /athinoramaMoviesDetails`), then `getAllImdbRatings()`.
2. `getAllImdbRatings()` runs `getMovieMdbDataAction(film)` for every movie in parallel.
3. `getMovieMdbDataAction`:
   - **Movie already has `imdbRating`** (from the backend) → no calls.
   - **Has `imdbLink` but no rating** → OMDB by ID (`?i=tt…`). No rating → `'None'`.
   - **No `imdbLink`** → OMDB by title + year (`?t=…&y=…`). Skipped if the title is Greek-only.
     - OMDB returns a rating → done (the link is built from `imdbID`).
     - OMDB finds the ID but no rating → the link is kept and the rating is `'None'`.
     - OMDB doesn't find the movie → `'None'`.
4. The UI shows `'None'` as `?/10`. A missing `imdbRating` means "still loading".

## Gotchas
- Movies rated by the dataset skip OMDB, so they have no `awards` / `rated` (age rating) fields. These are OMDB-only and shown in `IndividualMovie.vue`.
- The OMDB key is `VITE_OMDB_API_KEY`, so it ships in the browser bundle.
- Everything lives in memory only. A server restart re-scrapes and re-downloads, and notes from `/takeNote` are lost.
- Each scrape downloads ~240 MB from IMDb. The Render plan has only 512 MB RAM (see Hosting), so `npm start` caps the JS heap with `--max-old-space-size=160` (backend `package.json`). Measured peaks with the cap: ~260 MB during the Athinorama scrape and ~235 MB during the IMDb step (vs ~350/335 MB without). Don't remove the cap or raise memory use without re-measuring. At server start the list is `[]` until the first scrape finishes (~1 min).
- A wrong title match is possible for generic titles (year ±1 and runtime guard against it). Matches are logged as `IMDb title match: "<title>" (<year>) -> tt…` so they can be checked.
