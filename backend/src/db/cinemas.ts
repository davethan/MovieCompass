import { db } from './database.js';
import { emptySchedule, groupShowtimes, rowToMovie } from './movies.js';
import type { CinemaRow, CinemaMovie, CinemaSummary, MovieRow, ShowtimeRow } from './types.js';

const toSummary = (row: CinemaRow & { movie_count: number }): CinemaSummary => {
  const cinema: CinemaSummary = {
    id: row.id,
    name: row.name,
    location: row.location,
    address: row.address ?? '',
    isOutdoor: row.is_outdoor === 1,
    movieCount: row.movie_count,
  };
  if (row.tickets_url !== null) cinema.ticketsUrl = row.tickets_url;
  return cinema;
};

// Only cinemas that currently show movies.
const selectCinemas = db.prepare(`
  SELECT c.*, COUNT(*) AS movie_count FROM cinemas c JOIN movie_cinemas mc ON mc.cinema_id = c.id
  WHERE (? IS NULL OR c.id = ?)
  GROUP BY c.id ORDER BY c.location, c.name
`);
const selectCinemaMovies = db.prepare(`
  SELECT m.*, mc.raw_schedule FROM movies m JOIN movie_cinemas mc ON mc.movie_id = m.id
  WHERE mc.cinema_id = ? ORDER BY m.position
`);
const selectCinemaShowtimes = db.prepare('SELECT movie_id, cinema_id, day, time FROM showtimes WHERE cinema_id = ? ORDER BY rowid');

const getAllCinemas = (): CinemaSummary[] => (selectCinemas.all(null, null) as (CinemaRow & { movie_count: number })[]).map(toSummary);

// The cinema and its movies, each with its schedule at this cinema. null if it shows no movies.
const getCinemaWithMovies = (id: number): (CinemaSummary & { movies: CinemaMovie[] }) | null => {
  const row = selectCinemas.get(id, id) as (CinemaRow & { movie_count: number }) | undefined;
  if (!row) return null;

  const schedules = groupShowtimes(selectCinemaShowtimes.all(id) as ShowtimeRow[]);
  const movies = (selectCinemaMovies.all(id) as (MovieRow & { raw_schedule: string | null })[]).map(movieRow => {
    const { cinemas, ...movie } = rowToMovie(movieRow, []);
    const cinemaSchedule = movieRow.raw_schedule ?? schedules.get(`${movieRow.id}|${id}`) ?? emptySchedule();
    return { ...movie, cinemaSchedule };
  });

  return { ...toSummary(row), movies };
};

export { getAllCinemas, getCinemaWithMovies };
