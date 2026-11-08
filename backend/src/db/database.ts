import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// This file is in src/db (dev) or built/src/db (build), so walk up to the backend folder.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let backendRoot = path.resolve(__dirname, '..', '..');
if (path.basename(backendRoot) === 'built') backendRoot = path.dirname(backendRoot);

// The file survives restarts, but it's only a cache: each startup scrape refills it.
const dbPath = process.env.DB_PATH ?? path.join(backendRoot, 'data', 'moviecompass.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS movies (
    id TEXT PRIMARY KEY,
    position INTEGER NOT NULL,              -- scrape order
    greek_title TEXT NOT NULL,
    original_title TEXT,
    year TEXT,
    duration TEXT,
    summary TEXT,
    tags TEXT NOT NULL DEFAULT '[]',        -- JSON arrays
    directors TEXT NOT NULL DEFAULT '[]',
    actors TEXT NOT NULL DEFAULT '[]',
    imdb_link TEXT,
    imdb_rating TEXT,
    imdb_votes INTEGER,
    athinorama_link TEXT,
    image_url TEXT,
    trailer TEXT
  );

  -- Upserted by (name, location) and never deleted, so ids stay stable until a restart.
  CREATE TABLE IF NOT EXISTS cinemas (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    address TEXT,
    is_outdoor INTEGER NOT NULL DEFAULT 0,
    tickets_url TEXT,
    UNIQUE (name, location)
  );

  -- Which movie plays at which cinema (keeps cinemas that have no parsed times).
  CREATE TABLE IF NOT EXISTS movie_cinemas (
    movie_id TEXT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    cinema_id INTEGER NOT NULL REFERENCES cinemas(id),
    position INTEGER NOT NULL,
    raw_schedule TEXT,                      -- the scraped text when parseSchedule couldn't read it, shown as is
    PRIMARY KEY (movie_id, cinema_id)
  );

  -- Order of times is kept by insertion order (rowid).
  CREATE TABLE IF NOT EXISTS showtimes (
    movie_id TEXT NOT NULL,
    cinema_id INTEGER NOT NULL,
    day TEXT NOT NULL,                      -- WeeklySchedule key, e.g. "Monday"
    time TEXT NOT NULL,
    FOREIGN KEY (movie_id, cinema_id) REFERENCES movie_cinemas ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS showtimes_cinema ON showtimes(cinema_id);
  CREATE INDEX IF NOT EXISTS showtimes_movie_cinema ON showtimes(movie_id, cinema_id);

  -- lastUpdate: UTC ISO string of the last time movies were saved
  CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT);
`);

// A database file made before raw_schedule existed gets the column added.
const movieCinemaColumns = db.prepare('PRAGMA table_info(movie_cinemas)').all() as { name: string }[];
if (!movieCinemaColumns.some(column => column.name === 'raw_schedule')) {
  db.exec('ALTER TABLE movie_cinemas ADD COLUMN raw_schedule TEXT');
}

// Runs fn in one transaction, rolling back if it throws.
const transaction = <T>(fn: () => T): T => {
  db.exec('BEGIN');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
};

export { db, transaction };
