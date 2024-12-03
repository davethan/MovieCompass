import { defineStore } from 'pinia';
import axios from 'axios';
import { convertToNumber } from '@/tools/tools';
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
  //get all current movies in theaters
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
  //athinorama data scrapping
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
  //imdb data scrapping
  async getMovieImdbDataAction(payload) {
    const { imdbLink, id } = payload;
    try {
      const response = await axios.post(`${VITE_BACKEND_URL}/imdbMovieRating`, { imdbLink });
      this.setAthinoramaMovieImdbDataAction(id, imdbLink, response.data);
    }
    catch {
      throw (new Error);
    }
  },
  //omdb with id
  async getMovieOmdbDataBasedOnLinkAction(payload) {
    const { imdbLink, id } = payload;
    try {
      const imdbId = imdbLink.match(/\/title\/(tt\d+)\//);
      const response = await axios.get(`${VITE_OMDB_URL}/?apikey=${VITE_OMDB_API_KEY}&i=${imdbId[1]}`);
      if (response.data.Response === "True" && response.data.imdbRating !== 'N/A') {
        this.setAthinoramaMovieOmdbDataAction(id, response.data);
        return true;
      } else return false;
    }
    catch {
      return false;
    }
  },
  //omdb with title & year
  async getMovieOmdbDataBasedOnTitleAction(payload) {
    const { originalTitle, greekTitle, year, id } = payload;
    try {
      let title = originalTitle ? originalTitle : greekTitle;
      if (/[\u0370-\u03FF\u1F00-\u1FFF]/.test(title)) throw (new Error);
      if (title.includes('/')) title = title.split('/')[1].trim();
      title = title
        .replace(/.*\/(.*)/, '$1')
        .replace(/[^a-zA-Z0-9 ]+/g, '')
        .replace(/ /g, '+');
      const response = await axios.get(`${VITE_OMDB_URL}/?apikey=${VITE_OMDB_API_KEY}&t=${title}&y=${year}`);
      if (response.data.Response === "True" && response.data.imdbRating !== 'N/A') {
        const imdbLink = `http://www.imdb.com/title/${response.data.imdbID}/`;
        this.setAthinoramaMovieOmdbDataAction(id, response.data, imdbLink);
        return { success: true };
      } else if (response.data.Response === "True" && response.data.imdbID && response.data.imdbID !== 'N/A') {
        //i may retrieve the imdb id (but not the rating) from the omdb api. if so, data scrap.
        return { success: false, imdbLink: `http://www.imdb.com/title/${response.data.imdbID}/` };
      } else throw (new Error);
    }
    catch {
      return { success: false };
    }
  },
  //generic action to get the imdb data
  async getMovieMdbDataAction(payload) {
    const { imdbLink, id } = payload;
    try {
      if (!imdbLink) {
        const omdbResult = await this.getMovieOmdbDataBasedOnTitleAction(payload);
        if (!omdbResult.success && omdbResult.imdbLink) {
          await this.getMovieImdbDataAction({ id, imdbLink: omdbResult.imdbLink });
        } else if (!omdbResult.success) {
          throw (new Error);
        }
      }
      else {
        const rating = await this.getMovieOmdbDataBasedOnLinkAction(payload);
        if (!rating) await this.getMovieImdbDataAction(payload);
      }
      return true;
    }
    catch {
      this.setAthinoramaMovieOmdbDataAction(id, {});
      return false;
    }
  },
  //gets athinorama info for all
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
  //gets imdb data for all
  async getAllImdbRatings() {
    try {
      const requests = [];
      this.MOVIES.forEach((film) => {
        requests.push(this.getMovieMdbDataAction(film));
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
    this.ATHINORAMA_URLS = [...payload]//.slice(17, 18);
  },
  setAthinoramaMovieDetailsAction(payload) {
    this.MOVIES.push(payload)
  },
  setAthinoramaMovieImdbDataAction(id, imdbLink, payload) {
    this.MOVIES.forEach((film) => {
      if (film.id === id) {
        film.imdbRating = payload.rating ? payload.rating : 'None';
        film.popularity = payload.popularity ? convertToNumber(payload.popularity) : 0;
        film.imdbLink = imdbLink ? imdbLink : '';
      };
    })
  },
  setAthinoramaMovieOmdbDataAction(id, payload, imdbLink) {
    this.MOVIES.forEach((film) => {
      if (film.id === id) {
        if (!film.imdbLink) film.imdbLink = imdbLink ? imdbLink : '';
        film.imdbRating = (payload.imdbRating && payload.imdbRating !== 'N/A') ? payload.imdbRating : 'None';
        film.popularity = (payload.imdbVotes && payload.imdbVotes !== 'N/A') ? convertToNumber(payload.imdbVotes) : 0;
        film.awards = (payload.Awards && payload.Awards !== 'N/A') ? payload.Awards : '';
        film.rated = (payload.Rated && payload.Rated !== 'N/A') ? payload.Rated : '';
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
