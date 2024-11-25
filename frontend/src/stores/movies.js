import { defineStore } from 'pinia';
import axios from 'axios';

const state = () => ({
  ATHINORAMA_URLS: [],
  MOVIES: [],
  loading: false,
  loadingRating: false
});

const actions = {
  async getAthinoramaUrlsAction() {
    try {
      const response = await axios.get('http://localhost:5000/athinoramaCurrentMovies');
      this.setAthinoramaUrlsAction(response.data);
      return true;
    }
    catch {
      return false;
    }
  },
  async getMovieAthinoramaInfoAction(payload) {
    try {
      const response = await axios.post('http://localhost:5000/athinoramaMovieDetails', { url: payload.url });
      this.setAthinoramaMovieDetailsAction({ ...response.data, id: payload.id });
      return true;
    }
    catch {
      return false;
    }
  },
  async getMovieImdbRatingAction(payload) {
    const { imdbLink, id } = payload;
    if (!imdbLink) {
      this.setAthinoramaMovieRatingAction(id, 'None');
      return true;
    }
    try {
      const response = await axios.post('http://localhost:5000/imdbMovieRating', { imdbLink });
      this.setAthinoramaMovieRatingAction(id, response.data);
      return true;
    }
    catch {
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
      //all settled...
      response = await Promise.all(requests);
      if (!response) throw(false)
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
        requests.push(this.getMovieImdbRatingAction(film));
      });
      this.setLoadingRatingAction(true);
      const response = await Promise.allSettled(requests);
      this.setLoadingRatingAction(false);
      if (!response) throw(false)
    } catch (error) {
      this.setLoadingRatingAction(false);
      console.log(error);
      return false;
    }
  },
  setAthinoramaUrlsAction(payload) {
    this.ATHINORAMA_URLS = [...payload].slice(0, 3);
  },
  setAthinoramaMovieDetailsAction(payload) {
    this.MOVIES.push(payload)
  },
  setAthinoramaMovieRatingAction(id, rating) {
    this.MOVIES.forEach((film) => {
      if (film.id === id) film.imdbRating = rating;
    })
  },
  setLoadingAction(value) {
    this.loading = value;
  },
  setLoadingRatingAction(value) {
    this.loadingRating = value;
  }
};

const getters = {
  getIndividualMovie: (state) => (movieId) => state.MOVIES.find((film) => film.id === movieId)
};

export const useMoviesStore = defineStore('movies', {
  state,
  actions,
  getters
});
