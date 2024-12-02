import { defineStore } from 'pinia';
import axios from 'axios';
const { VITE_BACKEND_URL, VITE_OMDB_URL, VITE_OMDB_API_KEY } = import.meta.env;

const state = () => ({
  ATHINORAMA_URLS: [],
  MOVIES: [],
  selectedMovieId: '',
  loading: false,
  loadingRating: false,
  filters: {
    sortedBy: 1,
    filteredByDay: 1,
    filteredByCinema: 1,
    filteredByType: 1,
  }
});

const actions = {
  async getAthinoramaUrlsAction() {
    try {
      const response = await axios.get(`${VITE_BACKEND_URL}/athinoramaCurrentMovies`);
      this.setAthinoramaUrlsAction(response.data);
      return true;
    }
    catch {
      return false;
    }
  },
  async getMovieAthinoramaInfoAction(payload) {
    try {
      const response = await axios.post(`${VITE_BACKEND_URL}/athinoramaMovieDetails`, { url: payload.url });
      this.setAthinoramaMovieDetailsAction({ ...response.data, id: payload.id });
      return true;
    }
    catch {
      return false;
    }
  },
  async getMovieImdbDataAction(payload) {
    const { imdbLink, id } = payload;
    try {
      if (!imdbLink) throw new Error(`No link found for ${imdbLink}`);
      const response = await axios.post(`${VITE_BACKEND_URL}/imdbMovieRating`, { imdbLink });
      this.setAthinoramaMovieImdbDataAction(id, response.data);
      return true;
    }
    catch {
      this.setAthinoramaMovieImdbDataAction(id, 'None');
      return false;
    }
  },
  async getMovieOmdbDataAction(payload) {
    const { imdbLink, id } = payload;
    try {
      if (!imdbLink) throw new Error(`No link found for ${imdbLink}`);
      const imdbId = imdbLink.match(/\/title\/(tt\d+)\//);
      const response = await axios.get(`${VITE_OMDB_URL}/?apikey=${VITE_OMDB_API_KEY}&i=${imdbId[1]}`);
      //if i found imdb rating from the omdb api, then set data, else try imdb.
      if (response.data.imdbRating && response.data.imdbRating !== 'N/A') this.setAthinoramaMovieOmdbDataAction(id, response.data);
      else await this.getMovieImdbDataAction(payload);
      return true;
    }
    catch {
      this.setAthinoramaMovieOmdbDataAction(id, 'None');
      return false;
    }
  },
  async getAllCurrentMoviesDetails() {
    try {
      this.setLoadingAction(true);
      let response = await this.getAthinoramaUrlsAction();
      if (!response) throw(false)
      const requests = [];
      this.ATHINORAMA_URLS.forEach((athUrl) => {
        requests.push(this.getMovieAthinoramaInfoAction(athUrl));
      });
      await Promise.allSettled(requests);
      this.setLoadingAction(false);
      return true;
    } catch (error) {
      this.setLoadingAction(false);
      console.log(error);
      return false;
    }
  },
  async getAllImdbRatings() {
    try {
      const requests = [];
      this.MOVIES.forEach((film) => {
        requests.push(this.getMovieOmdbDataAction(film));
      });
      this.setLoadingRatingAction(true);
      await Promise.allSettled(requests);
      this.setLoadingRatingAction(false);
    } catch (error) {
      this.setLoadingRatingAction(false);
      console.log(error);
      return false;
    }
  },
  setAthinoramaUrlsAction(payload) {
    this.ATHINORAMA_URLS = [...payload]//.slice(19, 34);
  },
  setAthinoramaMovieDetailsAction(payload) {
    this.MOVIES.push(payload)
  },
  setAthinoramaMovieImdbDataAction(id, payload) {
    this.MOVIES.forEach((film) => {
      if (film.id === id) {
        film.imdbRating = payload.rating ? payload.rating : 'None';
        film.popularity = payload.popularity ? payload.popularity : 'None';
      };
    })
  },
  setAthinoramaMovieOmdbDataAction(id, payload) {
    this.MOVIES.forEach((film) => {
      if (film.id === id) {
        film.imdbRating = (payload.imdbRating && payload.imdbRating !== 'N/A') ? payload.imdbRating : 'None';
        film.popularity = (payload.imdbVotes && payload.imdbVotes !== 'N/A') ? payload.imdbVotes : 'None';
        film.awards = payload.Awards !== 'N/A' ? payload.Awards : '';
        film.rated = payload.Rated !== 'N/A' ? payload.Rated : '';
      };
    })
  },
  setLoadingAction(value) {
    this.loading = value;
  },
  setLoadingRatingAction(value) {
    this.loadingRating = value;
  },
  setSelectedMovieAction(value) {
    this.selectedMovieId = value;
  },
  setFiltersAction(value) {
    this.filters.sortedBy = value.sortedBy;
    this.filters.filteredByDay = value.filteredByDay;
    this.filters.filteredByCinema = value.filteredByCinema;
    this.filters.filteredByType = value.filteredByType;
  }
};

const getters = {
  getIndividualMovie: (state) => (movieId) => state.MOVIES.find((film) => film.id === movieId),
  getSelectedMovie: (state) => state.MOVIES.find((film) => film.id === state.selectedMovieId) || ''
};

export const useMoviesStore = defineStore('movies', {
  state,
  actions,
  getters
});
