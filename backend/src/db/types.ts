import type { Movie, WeeklySchedule } from '../types.js';

export type MovieRow = {
  id: string;
  greek_title: string;
  original_title: string | null;
  year: string | null;
  duration: string | null;
  summary: string | null;
  tags: string;
  directors: string;
  actors: string;
  imdb_link: string | null;
  imdb_rating: string | null;
  imdb_votes: number | null;
  athinorama_link: string | null;
  image_url: string | null;
  trailer: string | null;
};

export type CinemaRow = {
  id: number;
  name: string;
  location: string;
  address: string | null;
  is_outdoor: number;
  tickets_url: string | null;
};

export type ShowtimeRow = { movie_id: string; cinema_id: number; day: string; time: string };

export type CinemaSummary = {
  id: number;
  name: string;
  location: string;
  address: string;
  isOutdoor: boolean;
  ticketsUrl?: string;
  movieCount: number;
};

// cinemaSchedule is the scraped text when it couldn't be parsed into days.
export type CinemaMovie = Omit<Movie, 'cinemas'> & { cinemaSchedule: WeeklySchedule | string };
