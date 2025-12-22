import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../http/request';
import type { MoviesState } from './types';

const initialState: MoviesState = {
  count: 0,
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

export const getAllCurrentMoviesDetails = createAsyncThunk( 'movies/getAllCurrentMoviesDetails', async (_, { rejectWithValue }) => {
  try {
    const response = await request.get(`/athinoramaMoviesDetails`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    incrementByAmount: (state, action) => {
      state.count += action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    reset: (state) => {
      state.count = 0;
      state.loading = false;
      state.loadingRating = false;
    }
  },
  extraReducers: (builder) => {
    builder
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
      });
  }
});

export const {
  incrementByAmount,
  setLoading,
  reset
} = moviesSlice.actions;

export default moviesSlice.reducer;