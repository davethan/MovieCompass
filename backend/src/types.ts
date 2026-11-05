export type WeeklySchedule = {
  Monday: string[];
  Tuesday: string[];
  Wednesday: string[];
  Thursday: string[];
  Friday: string[];
  Saturday: string[];
  Sunday: string[];
};

export type Day = keyof WeeklySchedule;

export type Cinema = {
  id?: number; // set by the database, not the scraper; changes after a restart
  cinema: string;
  cinemaLocation: string;
  cinemaAddress: string;
  isOutdoor: boolean;
  cinemaSchedule: WeeklySchedule | string; // string: the scraped text, when parseSchedule couldn't read it
  ticketsUrl?: string;
};

export type Movie = {
  id: string;
  greekTitle: string;
  originalTitle: string;
  year: string;
  duration: string;
  tags: string[];
  summary: string;
  directors: string[];
  actors: string[];
  imdbLink: string;
  athinoramaLink: string;
  imageUrl: string;
  trailer: string;
  cinemas: Cinema[];
  imdbRating?: string; // from the IMDb dataset, e.g. "7.4"; missing if not found
  popularity?: number; // IMDb vote count
};

export type AthinoramaUrl = {
  id: string,
  url: string
}

export type SpecialFilm = {
  title: string,
  cinema: string
}

export type UpcomingMovie = {
  greekTitle: string,
  originalTitle: string,
  directors: string,
  isBrief: boolean
}

export type UpcomingMovieDetails = {
  greekTitle : string,
  originalTitle : string,
  year: string,
  duration: number|null,
  tags: string[],
  summary: string,
  directors: string,
  premiere: string,
  isBrief: boolean,
}