# movieCompass

Vue 3 + Vite frontend of MovieCompass.

## Project Setup

Install the dependencies in both folders:

```sh
cd frontend && npm install
cd backend && npm install
```

The frontend reads its settings from `frontend/.env` (not committed). For local work it should point to the local backend:

```sh
VITE_BACKEND_URL = 'http://localhost:5000/'
VITE_OMDB_URL = 'https://www.omdbapi.com'
VITE_OMDB_API_KEY = '<your OMDB key>'
```

## Development

Run both, each in its own terminal:

```sh
# frontend: hot reload, open the url Vite prints (http://localhost:5173)
cd frontend
npm run dev
```

```sh
# backend: http://localhost:5000, restarts on every change, scrapes only 5 movies
cd backend
npm run dev
```

## Serve the built app locally from the backend

Build the frontend first, then the backend, then start the backend and open http://localhost:5000

```sh
cd frontend
npm run build   # outputs to backend/built/dist

cd ../backend
npm run build   # compiles the TypeScript to backend/built
npm start
```
