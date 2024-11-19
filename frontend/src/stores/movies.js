import { defineStore } from 'pinia';
import axios from 'axios';

const state = () => ({
  ATHINORAMA_URLS: [
    { url: "/cinema/movie/anora-10083336/", id: "8f4a65f2-3c55-495b-84b9-f7c621aa9912" },
    { url: "/cinema/movie/i_aliki_de_menei_pia_edo-1001858/", id: "67187619-c320-448b-ab05-dc23d0ca6daa" }
  ],
  MOVIES: [
    { "greekTitle": "Anora", "originalTitle": "", "year": "2024", "duration": "139", "summary": "Η Ανόρα, μια νεαρή σεξεργάτρια από το Μπρούκλιν, παντρεύεται παρορμητικά τον απερίσκεπτο γιο ενός Ρώσου ολιγάρχη. Μόλις, όμως, το μαθαίνουν οι γονείς του, καταφθάνουν επειγόντως στη Νέα Υόρκη για να ακυρώσουν το γάμο.", "directors": ["Σον Μπέικερ"], "actors": ["Μίκι Μάντισον", "Μαρκ Έιντελστεϊν", "Γιούρα Μπορίσοφ"], "imdbLink": "http://www.imdb.com/title/tt28607951/", "cinemas": [{ "cinema": "Άστορ", "isOutdoor": false, "cinemaSchedule": { "Monday": ["22.30"], "Tuesday": ["22.30"], "Wednesday": ["22.30"], "Thursday": ["22.30"], "Friday": ["22.30"], "Saturday": ["22.30"], "Sunday": [] } }, { "cinema": "Cinobo Όπερα", "isOutdoor": false, "cinemaSchedule": { "Monday": [], "Tuesday": [], "Wednesday": ["19.30"], "Thursday": ["19.30"], "Friday": ["19.30"], "Saturday": [], "Sunday": [] } }, { "cinema": "Μικρόκοσμος", "isOutdoor": false, "cinemaSchedule": { "Monday": ["21.45"], "Tuesday": ["21.45"], "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": ["17.45"], "Sunday": [] } }, { "cinema": "Νιρβάνα 1 & 2 Cinemax", "isOutdoor": false, "cinemaSchedule": { "Monday": ["22.40"], "Tuesday": ["22.40"], "Wednesday": ["22.40"], "Thursday": ["22.40"], "Friday": ["22.40"], "Saturday": ["22.40"], "Sunday": ["22.40"] } }, { "cinema": "Αίγλη 3D Digital", "isOutdoor": false, "cinemaSchedule": { "Monday": ["21.45"], "Tuesday": ["21.45"], "Wednesday": ["21.45"], "Thursday": ["21.45"], "Friday": ["21.45"], "Saturday": ["21.45"], "Sunday": ["21.45"] } }, { "cinema": "Κηφισιά Cinemax", "isOutdoor": false, "cinemaSchedule": { "Monday": ["19.00"], "Tuesday": ["19.00"], "Wednesday": ["19.00"], "Thursday": ["19.00"], "Friday": ["19.00"], "Saturday": ["19.00"], "Sunday": ["19.00"] } }, { "cinema": "Νανά Cinemax", "isOutdoor": false, "cinemaSchedule": { "Monday": ["21.45"], "Tuesday": ["21.45"], "Wednesday": ["21.45"], "Thursday": ["21.45"], "Friday": ["21.45"], "Saturday": ["21.45"], "Sunday": ["21.45"] } }, { "cinema": "WestCity Cinemas", "isOutdoor": false, "cinemaSchedule": { "Monday": ["18.45"], "Tuesday": ["18.45"], "Wednesday": ["18.45"], "Thursday": ["18.45"], "Friday": ["18.45"], "Saturday": ["18.45"], "Sunday": ["18.45"] } }, { "cinema": "Δημ. Κιν. Όνειρο Ρέντη", "isOutdoor": false, "cinemaSchedule": { "Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": ["21.30"], "Saturday": ["20.45"], "Sunday": ["20.00"] } }, { "cinema": "Δημ. Κιν. Σινεάκ", "isOutdoor": false, "cinemaSchedule": { "Monday": ["19.25"], "Tuesday": [], "Wednesday": ["17.30"], "Thursday": [], "Friday": [], "Saturday": ["21.50"], "Sunday": [] } }], "id": "17339f1c-245f-4d96-aab9-25299f364471", "imdbRating": 8.2 },
    {"greekTitle":"Η Αλίκη Δε Μένει Πια Εδώ","originalTitle":"Alice Doesn’t Live Here Anymore","year":"1974","duration":"112","summary":"Μια γυναίκα που πρόσφατα έγινε χήρα, ταξιδεύει με το γιο της στην αμερικανική επαρχία αποφασισμένη να ξεκινήσει μια νέα ζωή ως τραγουδίστρια.","directors":["Μάρτιν Σκορτσέζε"],"actors":["Κρις Κριστόφερσον","Έλεν Μπέρνστιν","Χάρβει Κάιτελ"],"imdbLink":"http://www.imdb.com/title/tt0071115/","cinemas":[{"cinema":"Cinobo Πατησίων","isOutdoor":false,"cinemaSchedule":{"Monday":[],"Tuesday":["22.30"],"Wednesday":[],"Thursday":[],"Friday":[],"Saturday":[],"Sunday":[]}}],"id":"8c8b5a72-1a8e-4748-a253-622c0e238986","imdbRating":7.3}
  ]
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
    if (!imdbLink) return;
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
      let response = await this.getAthinoramaUrlsAction();
      if (!response) return false;
      const requests = [];
      this.ATHINORAMA_URLS.forEach((athUrl) => {
        requests.push(this.getMovieAthinoramaInfoAction(athUrl));
      });
      //all settled...
      response = await Promise.all(requests);
      if (!response) return false;
      this.MOVIES.forEach((film) => {
        requests.push(this.getMovieImdbRatingAction(film));
      });
      response = await Promise.allSettled(requests);
      if (!response) return false
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  setAthinoramaUrlsAction(payload) {
    this.ATHINORAMA_URLS = [...payload];
    this.ATHINORAMA_URLS = this.ATHINORAMA_URLS.slice(2,4);
  },
  setAthinoramaMovieDetailsAction(payload) {
    this.MOVIES.push(payload)
  },
  setAthinoramaMovieRatingAction(id, rating) {
    this.MOVIES.forEach((film) => {
      if (film.id === id) film.imdbRating = rating;
    })
  }
};

const getters = {

};

export const useMoviesStore = defineStore('movies', {
  state,
  actions,
  getters
});
