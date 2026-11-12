# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

MovieCompass ("Athens Cinemas", https://athens-cinemas.gr/) scrapes the movies currently playing in Athens cinemas and shows them in a Vue PWA. Two npm projects, no root `package.json`:

- `backend/` — Express + TypeScript (ESM, `nodenext`): scrapes the sites, stores the current movies in SQLite, and serves the built frontend.
- `frontend/` — Vue 3 + Vite + Pinia + Bootstrap/SCSS, plain JS.

There are no tests. Node `>=24.3.0`.

## Commands

```sh
# backend (http://localhost:5000). --dev limits the scrape to 5 movies
cd backend && npm run dev      # tsx watch index.ts --dev
cd backend && npm run build    # tsc -> backend/built
cd backend && npm start        # node --max-old-space-size=160 built/index.js

# frontend (http://localhost:5173)
cd frontend && npm run dev
cd frontend && npm run build          # outputs to backend/built/dist
cd frontend && npm run build:UPLOAD   # production build, uses .env.UPLOAD
cd frontend && npm run lint           # eslint --fix
cd frontend && npm run format         # prettier
```

The frontend needs `frontend/.env` (not committed) with `VITE_BACKEND_URL='http://localhost:5000/'`, `VITE_OMDB_URL` and `VITE_OMDB_API_KEY`.

`node host-build.js` installs and builds both (frontend in UPLOAD mode); `deploy.sh` runs it on the Pi.

Hosted on a Raspberry Pi at home, reachable at `https://athens-cinemas.gr` through a Cloudflare Tunnel (`cloudflared` systemd service on the Pi). To deploy on the Pi, push to `main`, then run `ssh unexpected-mushroom@192.168.2.9 "~/MovieCompass/deploy.sh"` (it pulls, builds with `host-build.js` and restarts the `moviecompass` systemd service from `deploy/moviecompass.service`). That service runs the `npm start` command directly, so keep the two in sync. `deploy.sh` doesn't install the service file: when `deploy/moviecompass.service` changes, copy it to `/etc/systemd/system/` and run `sudo systemctl daemon-reload` once. The service is sandboxed and can only write to `backend/data`, so a feature that writes files elsewhere needs `ReadWritePaths=` updated.

## Architecture

- **Single server in production.** The Vite build writes into `backend/built/dist`, and Express serves it statically plus a catch-all to `index.html`. The frontend talks to the backend through the axios instance in `frontend/src/http/request.js`.
- **Backend state is in SQLite.** `backend/src/db/` (Node's built-in `node:sqlite`, file `backend/data/moviecompass.db` or `DB_PATH`) holds movies, cinemas and showtimes. `backend/src/scraping/cron.ts` refills it with the Athinorama scrape + IMDb dataset ratings on server start and on a Thursday/Friday schedule. The file survives restarts (the old movies show until the startup scrape replaces them); on a first start the app is empty until that scrape finishes. **Failed run rule:** if a scrape fails, the old movies are kept only if they were saved this cinema week (since Thursday 00:00 Athens time); otherwise they're cleared. `GET /cinemas` and `GET /cinemas/:id` serve cinemas and their movies (used by the frontend search and cinema page). Specials (Athinorama) and upcoming movies (Filmy) are not stored; they're scraped on each request in `scrapingActions.ts`. HTML parsing lives in `scraping/transformations.ts` (cheerio); shared types in `src/types.ts`.
- **Memory is tight.** The Pi 4 has 1 GB RAM, shared with the OS and the builds that `deploy.sh` runs next to the live app. The `--max-old-space-size=160` cap and the streaming of IMDb datasets are deliberate; don't remove them or add memory-heavy work without measuring.
- **Frontend data flow.** `App.vue` loads all movies once, then fills in missing ratings via OMDB (`stores/movies.js`). Filters (day, cinema, hour range, location, etc.) live in the movies store and are applied with helpers in `src/tools/tools.js`, both on the home view and the movie page.
- **Search.** `shared/SearchAutocomplete.vue` (header dropdown on desktop, `SearchDrawer.vue` on mobile) matches movie titles from `MOVIES` and cinema names from `CINEMAS` (`GET /cinemas`, loaded after the movies), shown in two groups.
- **Cinema page.** `/cinema/:id` (`components/Cinema.vue`) loads its own data from `GET /cinemas/:id`, so it can be opened directly. Cinema ids change after a backend restart, so an old shared link may open another cinema (accepted).
- **Route guard.** Routes with `meta.isProtected` (`/specials`, `/upcoming`) redirect to `/` when opened directly (no previous route), because they rely on data loaded through the app.

For details on scraping, the cron schedule, IMDb title matching, OMDB fallback and hosting (Pi, deploy, Cloudflare Tunnel), use the `movie-data-flow` skill (`.claude/skills/movie-data-flow/SKILL.md`).
