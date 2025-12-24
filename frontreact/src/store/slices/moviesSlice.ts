import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../http/request';
import type { MoviesState, getMovieOmdbDataBasedOnLinkActionPayload, takeNotePayload } from './types';
const { VITE_OMDB_URL, VITE_OMDB_API_KEY } = import.meta.env;

const initialState: MoviesState = {
  MOVIES: [],
  lastUpdate: '',
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
};

export const getAllCurrentMoviesDetails = createAsyncThunk( 'movies/getAllCurrentMoviesDetails', async () => {
  const response = await request.get(`/athinoramaMoviesDetails`);
  return response.data;
});

export const getMovieOmdbDataBasedOnLinkAction = createAsyncThunk('movies/getMovieOmdbDataBasedOnLinkAction', async (payload: getMovieOmdbDataBasedOnLinkActionPayload) => {
  const { imdbLink, id } = payload;
  if (!imdbLink) throw ('No link available');
  const imdbId = imdbLink.match(/\/title\/(tt\d+)\//);
  if (!imdbId || !imdbId[1]) throw ('No link available');
  const response = await request.get(`${VITE_OMDB_URL}/?apikey=${VITE_OMDB_API_KEY}&i=${imdbId[1]}`);
  return {apiResponse: response.data, imdbLink, id}
});

export const takeNote = createAsyncThunk('movies/takeNote', async (payload: takeNotePayload) => {
  const response = await request.post(`/takeNote`, payload);
  return response.data;
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      //getAllCurrentMoviesDetails
      .addCase(getAllCurrentMoviesDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCurrentMoviesDetails.fulfilled, (state, action) => {
        const { films, lastCronJobRun } = action.payload;
        state.MOVIES = films;
        state.lastUpdate = lastCronJobRun.replace('T', ' ').replace('Z', '');
        state.loading = false;
      })
      .addCase(getAllCurrentMoviesDetails.rejected, (state) => {
        state.loading = false;
      })
    
      //getAllCurrentMoviesDetails
      .addCase(getMovieOmdbDataBasedOnLinkAction.pending, (state) => {
        state.loadingRating = true;
      })
      .addCase(getMovieOmdbDataBasedOnLinkAction.fulfilled, (state, action) => {
        const {apiResponse, id, imdbLink } = action.payload
        state.MOVIES.forEach((film) => {
          if (film.id === id) {
            film.imdbLink = imdbLink || film.imdbLink;
            film.imdbRating = (apiResponse.imdbRating && apiResponse.imdbRating !== 'N/A') ? apiResponse.imdbRating : 'None';
            film.popularity = (apiResponse.imdbVotes && apiResponse.imdbVotes !== 'N/A') ? apiResponse.imdbVotes : 0;
            film.awards = (apiResponse.Awards && apiResponse.Awards !== 'N/A') ? apiResponse.Awards : '';
            film.rated = (apiResponse.Rated && apiResponse.Rated !== 'N/A') ? apiResponse.Rated : '';
          };
        });
        state.loadingRating = false
      })
      .addCase(getMovieOmdbDataBasedOnLinkAction.rejected, (state, action) => {
        const {id, imdbLink } = action.meta.arg
        state.MOVIES.forEach((film) => {
          if (film.id === id) {
            film.imdbLink = imdbLink || film.imdbLink;
            film.imdbRating = 'None';
            film.popularity = 0;
            film.awards = '';
            film.rated = '';
          };
        });
        state.loadingRating = false;
      })
      //takeNote
      .addCase(takeNote.fulfilled, (state, action) => {
        const { id, note } = action.payload as takeNotePayload;
        state.MOVIES.forEach((film) => {
          if (film.id === id) film.note = note;
        });
      })
  }
});

export const {
  setLoading,
} = moviesSlice.actions;

export default moviesSlice.reducer;