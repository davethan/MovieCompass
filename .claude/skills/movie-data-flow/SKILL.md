---
name: movie-data-flow
description: How MovieCompass gets current movies (Athinorama scraping cron), stores them (SQLite, /cinemas endpoints) and gets their IMDb ratings (official IMDb dataset on the backend, OMDB fallback in the frontend). Use when working on, debugging, or explaining movie fetching, the cron jobs, the SQLite database, the IMDb dataset, OMDB calls, the rating lookup in the frontend store, or hosting (Raspberry Pi: systemd service, deploy.sh, Cloudflare Tunnel, RAM/heat limits, Node version).
---

# MovieCompass movie & rating data flow

## Hosting
- **Hosted on a Raspberry Pi at home** at `https://athens-cinemas.gr` since 2026-11-08. It used to run on Render (`athenscinemas.onrender.com`, $7/month); that service was deleted on 2026-11-08 with no redirect, so the old URL is dead.
- **Domain and tunnel:** `athens-cinemas.gr` is registered at Papaki, with its nameservers set to Cloudflare (free plan), which manages DNS. Visitors reach the Pi through a **Cloudflare Tunnel** named `moviecompass`: the Pi connects out to Cloudflare, so no router ports are open and the home IP stays hidden. The tunnel is managed in the Cloudflare dashboard (Zero Trust → Networks → Tunnels): routes `athens-cinemas.gr` and `www.athens-cinemas.gr` → `http://localhost:5000`. **The routes must be HTTP, not HTTPS**: the app has no certificate, and Cloudflare adds HTTPS for visitors. A redirect rule sends `www` to the main address (301, keeps path and query). On the Pi it runs as the `cloudflared` systemd service (installed with `cloudflared service install <token>`, token in `/etc/cloudflared/token`, ~40 MB RAM, starts on boot). Logs: `journalctl -u cloudflared -f`. A 502 means the tunnel can't reach the app (app down, or a route set to HTTPS); a 530/1016 means a route or DNS record is missing.
- **Raspberry Pi 4, 1 GB RAM** (~905 MB usable, 904 MB swap), 32 GB SD card, wired Ethernet, Raspberry Pi OS Lite 64-bit (Debian 13). LAN address `192.168.2.9`, app on port 5000 (hard-coded in `backend/index.ts`). SSH: `ssh unexpected-mushroom@192.168.2.9` (key only, from the home LAN).
- **Runs as a systemd service** from `deploy/moviecompass.service` (the file has the install commands). It runs `node --max-old-space-size=160 built/index.js` in `backend/`, the same as `npm start` but without npm, to save the RAM of an extra Node process. **If `npm start` changes, update the unit too.** It starts on boot and restarts 5 s after a crash, but gives up after 3 starts within 15 minutes (`StartLimitBurst=3`, `StartLimitIntervalSec=15min`), so a crash during the scrape can't loop and re-download ~240 MB from IMDb every minute. Manual starts count toward that limit too, so `deploy.sh` runs `systemctl reset-failed` before restarting. Logs: `journalctl -u moviecompass -f`.
- **Service hardening (since 2026-11-12):** the unit sets `NoNewPrivileges`, `ProtectSystem=strict`, `ProtectHome=read-only`, `PrivateTmp` and other sandboxing options, so a hacked app can't use sudo or change the system. **The app can only write to `backend/data`** (`ReadWritePaths=`). A feature that writes anywhere else fails with `EROFS`/permission denied until that folder is added to `ReadWritePaths=`. `/tmp` is private and emptied on restart. No `MemoryDenyWriteExecute` (breaks Node's JIT). Check the score with `systemd-analyze security moviecompass` (3.3 "OK" when added). Builds and `deploy.sh` run from SSH, outside the sandbox.
- **Deploy (manual), step by step.** Pushing alone changes nothing; the Pi doesn't watch GitHub.
  1. Push to `main`, then run `ssh unexpected-mushroom@192.168.2.9 "~/MovieCompass/deploy.sh"`. `deploy.sh` stops at the first failing step (`set -e`).
  2. `git pull --ff-only` (refuses if the Pi's copy has local changes or diverged).
  3. `host-build.js` under a 256 MB heap cap, so it fits next to the running app (~90 s): backend `npm i` + `tsc` into `backend/built/`, then frontend `npm i` + `vite build --mode UPLOAD` into `backend/built/dist/` (emptied first).
  4. `systemctl reset-failed` (clears the 3-starts limit), then `systemctl restart moviecompass`.
  5. The new process opens SQLite and serves the old movies at once; `cloudflared` keeps running and forwards to it. The startup scrape (Athinorama + IMDb datasets, ~45 s–1 min) then replaces them. The in-memory scrape cache (`src/cache.ts`) starts empty.
  6. Users' PWAs (`registerType: 'autoUpdate'`) pick up the new frontend the next time they open the site; some need one more reload.
- **When `deploy/moviecompass.service` changes**, `deploy.sh` does not install it (systemd reads `/etc/systemd/system/moviecompass.service`). Run once: `ssh unexpected-mushroom@192.168.2.9 "cd ~/MovieCompass && git pull --ff-only && sudo cp deploy/moviecompass.service /etc/systemd/system/ && sudo systemctl daemon-reload && ./deploy.sh"`. Check with `systemctl show moviecompass -p ProtectSystem` and `journalctl -u moviecompass -n 50`.
- **Deploy side effects (known, not fixed):** the frontend build empties `backend/built/dist` while the old app runs, so the site's files are missing for ~30 s during each deploy. If the build fails, the old process keeps running from memory, but `backend/built` is already half-updated, so a crash or reboot would start that. Deploy again soon after a failure. A fix would be to build into a separate folder and switch only after success.
- **Frontend env:** `frontend/.env.UPLOAD` sets `VITE_BACKEND_URL = '/'`, so the frontend calls whatever server it was loaded from (the domain or the LAN IP). The OMDB URL and key are in `frontend/.env.UPLOAD.local` on the Pi, created by hand (gitignored).
- **Node:** 26.13.0 from the NodeSource `node_26.x` apt repo, so the major version only changes if the repo is switched. unattended-upgrades installs Debian security updates but **not** NodeSource, Cloudflare (`cloudflared`) or Raspberry Pi packages, and it **never reboots** (the user's choice). Run `sudo apt upgrade` now and then, and reboot by hand after kernel updates. Both `package.json` files have `"engines": { "node": ">=24.3.0" }`.
- **Measured on the Pi (2026-11-06/07):** first scrape 76 films (66 rated), 38 cinemas, app peak 161 MB; lowest available RAM during a build 364 MB, with no swap used; 52°C idle, ~63°C right after a build and scrape. Check heat with `vcgencmd measure_temp` (keep under 70°C) and `vcgencmd get_throttled` (`0x0` = no throttling).
- The small CPU and RAM are the main limits: keep scraping and the IMDb downloads light on memory, and don't add work that needs more resources without checking it fits.

## Backend (Express, `backend/src`)

### 1. Movies: Athinorama scraping cron (`scraping/cron.ts`)
- `cronJob()` scrapes `https://www.athinorama.gr/cinema` (`getAthinoramaCurrentMovies` → `parseAthinoramaMovies`), then fetches each movie's detail page in parallel (`getAthinoramaMovieDetails` → `extractAthinoramaMovieDetails`). Failed detail fetches are dropped.
- Before saving, it calls `applyImdbRatings(movies, { matchTitles: true })` (see 2). If that throws, the movies are saved without ratings and the frontend's OMDB fallback fills them in. Then `addTicketLinks`, then `replaceAllMovies(movies)` (see 3). The old list stays visible while a scrape runs (~1 min).
- **Failed run rule** (`handleFailedRun`): if fetching the link list fails, the list is empty, or every movie fetch fails, the old movies are kept only if they were saved during the current cinema week (since the latest Thursday 00:00 Athens time, `athensWeekStart` in `db/time.ts`). Otherwise the movies and the update time are cleared, so last week's movies are never shown. If only some movie fetches fail, the ones that worked are saved.
- Always started through `runCronJob()`, which reuses the job already running, so runs never overlap. While the list is still empty (right after a cold start), `/athinoramaMoviesDetails` waits for the running job (`waitForCurrentRun`) instead of returning no movies.
- Runs at server start (`app.ts`), Thursday 17:00 and 21:00, and Friday 18:00 (Europe/Athens).
  - **Why these times:** in Greece the cinema schedule changes every Thursday for all cinemas, so new movies and showtimes appear then.
  - **Why the repeats:** Athinorama often finishes adding the new movies only a day later, so the 21:00 and Friday runs catch late updates. Don't remove them as "duplicates".
  - Ratings are refreshed only by these runs. If the schedule changes, ratings freshness changes with it.
- Served by `GET /athinoramaMoviesDetails` → `{ films, lastCronJobRun }`. `lastCronJobRun` is when the movies were last saved, as `"YYYY-MM-DD HH:mm:ss"` in Europe/Athens time (`formatAthens`), or `null` before the first save. The frontend hides the "last update" line when it's empty.

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

### 3. Storage: SQLite (`db/`)
- Node's built-in `node:sqlite` (`DatabaseSync`), no npm dependency. One file: `backend/data/moviecompass.db` (gitignored), or `DB_PATH`. `db/database.ts` creates the folder and tables on startup (imported first in `app.ts`), with WAL and foreign keys on.
- On the Pi the file stays on the SD card across restarts: the old movies show until the startup scrape replaces them, and if that scrape fails, the failed run rule decides whether they stay. Keeping history is not a goal.
- Tables: `movies` (with scrape `position`; arrays as JSON text), `cinemas` (id, name, location, address, is_outdoor, tickets_url; unique on name + location), `movie_cinemas` (which movie plays where, keeps cinemas with no parsed times; `raw_schedule` holds the scraped text when `parseSchedule` couldn't read it, and it's sent to the frontend as `cinemaSchedule` unchanged), `showtimes` (movie, cinema, day, time; ordered by rowid), `meta` (`lastUpdate`, UTC ISO string).
- `db/movies.ts`: `replaceAllMovies` deletes all movies (links and showtimes cascade), inserts the new ones, upserts cinemas (last scraped address / tickets link wins) and sets `lastUpdate`, all in one transaction. `clearMovies`, `getLastUpdate`, and `getAllMovies`, which rebuilds the exact JSON the frontend expects.
- Cinema rows are never deleted, so cinema ids stay stable until a restart.
- `db/cinemas.ts` serves `GET /cinemas` (cinemas that currently show movies, with `movieCount`) and `GET /cinemas/:id` (the cinema plus its movies, each with its `cinemaSchedule` there; 404 if unknown or no movies). The frontend uses `/cinemas` for search (`moviesStore.CINEMAS`, fetched after the movies, since on a cold server it's empty until the first scrape is saved) and `/cinemas/:id` for the cinema page (`/cinema/:id`).
- Each cinema inside a movie in `/athinoramaMoviesDetails` also carries its `id`, so the movie page links to `/cinema/:id`. Ids come from the database and change after a restart.
- Specials (Athinorama) and upcoming movies (Filmy) are not stored; they're still scraped on each request.

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
- Every restart re-scrapes and re-downloads the IMDb files, on the Pi too (where the database file itself survives). Notes were removed from the backend (`/takeNote` is gone); the frontend note code stays commented out.
- Each scrape downloads ~240 MB from IMDb. The Pi has 1 GB shared with the OS and the builds (see Hosting), so `npm start` and the systemd unit cap the JS heap with `--max-old-space-size=160`. Measured peaks with the cap (on Render, 2026-11): ~260 MB during the Athinorama scrape and ~235 MB during the IMDb step (vs ~350/335 MB without). Don't remove the cap or raise memory use without re-measuring. With an empty database (first start, or after deleting the file) the list is `[]` until the first scrape finishes (~1 min).
- A wrong title match is possible for generic titles (year ±1 and runtime guard against it). Matches are logged as `IMDb title match: "<title>" (<year>) -> tt…` so they can be checked.
