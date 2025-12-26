export type WeeklySchedule = {
  Monday: string[];
  Tuesday: string[];
  Wednesday: string[];
  Thursday: string[];
  Friday: string[];
  Saturday: string[];
  Sunday: string[];
};

export type Cinema = {
  cinema: string;
  cinemaLocation: string;
  isOutdoor: boolean;
  cinemaSchedule: WeeklySchedule;
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
  note: string;
  imdbRating: number | string | undefined;
  popularity: number;
  awards: string;
  rated: string;
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

export type MoviesState = {
  MOVIES: Movie[];
  lastUpdate: string;
  selectedCinema: string;
  loading: boolean;
  loadingRating: boolean;
}

export type getMovieOmdbDataBasedOnLinkActionPayload = {
  imdbLink: string;
  id: string;
}

export type takeNotePayload = {
  id: string;
  note: string;
}