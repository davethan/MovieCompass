import { defineStore } from 'pinia';
import request from '@/http/request';
import { convertToNumber } from '@/tools/tools';
const { VITE_OMDB_URL, VITE_OMDB_API_KEY } = import.meta.env;

const state = () => ({
  MOVIES: [],
  selectedCinema: '',
  loading: false,
  loadingRating: false,
  filters: {
    sortedBy: 1,
    filteredByDay: 1,
    filteredByCinema: 1,
    filteredByType: 1,
    filteredByDuration: 3,
    filteredByReleaseYear: 1,
    filteredByLocation: [],
  }
});

const actions = {
  //get all current movies in theaters
  async getAllCurrentMoviesDetails() {
    this.setLoadingAction(true);
    try {
      const response = await request.get(`/athinoramaMoviesDetails`);
      this.setAthinoramaMoviesDetailsAction(response.data);
      return true;
    }
    catch {
      return false;
    }
    finally {
      this.setLoadingAction(false);
    }
  },
  //imdb data scrapping
  async getMovieImdbDataAction(payload) {
    const { imdbLink, id } = payload;
    try {
      const response = await request.post(`/imdbMovieRating`, { imdbLink });
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
      const response = await request.get(`${VITE_OMDB_URL}/?apikey=${VITE_OMDB_API_KEY}&i=${imdbId[1]}`);
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
      const response = await request.get(`${VITE_OMDB_URL}/?apikey=${VITE_OMDB_API_KEY}&t=${title}&y=${year}`);
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
  setAthinoramaMoviesDetailsAction(payload) {
    this.MOVIES = payload
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
  setSelectedCinemaAction(value) {
    this.selectedCinema = value;
  },
  setFiltersAction(value) {
    this.filters = { ...this.filters, ...value };
  }
};

const getters = {
  getIndividualMovie: (state) => (movieId) => state.MOVIES?.find((film) => film.id === movieId) || false,
  getMinReleaseDate: (state) =>  Math.min(...state.MOVIES.map(film => film.year)),
};

export const useMoviesStore = defineStore('movies', {
  state,
  actions,
  getters
});
