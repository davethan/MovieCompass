# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

MovieCompass ("Athens Cinemas", https://athenscinemas.onrender.com/) scrapes the movies currently playing in Athens cinemas and shows them in a Vue PWA. Two npm projects, no root `package.json`:

- `backend/` — Express + TypeScript (ESM, `nodenext`): scrapes the sites, keeps everything in memory, and serves the built frontend.
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

Deployment on Render runs `node host-build.js` (installs and builds both, frontend in UPLOAD mode) and `node host-start.js` (backend `npm start`).

## Architecture

- **Single server in production.** The Vite build writes into `backend/built/dist`, and Express serves it statically plus a catch-all to `index.html`. The frontend talks to the backend through the axios instance in `frontend/src/http/request.js`.
- **Backend state is in memory only.** `backend/src/scraping/cron.ts` holds the current movie list. It is refreshed by the Athinorama scrape + IMDb dataset ratings on server start and on a Thursday/Friday schedule. A restart starts empty until the first scrape finishes. Specials (Athinorama) and upcoming movies (Filmy) are scraped on each request in `scrapingActions.ts`. HTML parsing lives in `scraping/transformations.ts` (cheerio); shared types in `src/types.ts`.
- **Memory is tight.** Render plan is <1 CPU / 512 MB RAM. The `--max-old-space-size=160` cap and the streaming of IMDb datasets are deliberate; don't remove them or add memory-heavy work without measuring.
- **Frontend data flow.** `App.vue` loads all movies once, then fills in missing ratings via OMDB (`stores/movies.js`). Filters (day, cinema, hour range, location, etc.) live in the movies store and are applied with helpers in `src/tools/tools.js`, both on the home view and the movie page.
- **Route guard.** Routes with `meta.isProtected` (`/cinema/:cinema`, `/specials`, `/upcoming`) redirect to `/` when opened directly (no previous route), because they rely on data loaded through the app.

For details on scraping, the cron schedule, IMDb title matching, OMDB fallback and Render hosting, use the `movie-data-flow` skill (`.claude/skills/movie-data-flow/SKILL.md`).
