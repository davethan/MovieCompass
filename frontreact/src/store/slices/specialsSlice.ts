import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import request from '../../http/request';
import type { special } from './types';

const initialState = {
  SPECIALS: [] as special[],
  loading: false,
};

export const getSpecials = createAsyncThunk( 'specials/getSpecials', async () => {
  const response = await request.get(`/athinoramaSpecials`);
  return response.data;
});

const specialsSlice = createSlice({
  name: 'specials',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //getSpecials
      .addCase(getSpecials.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSpecials.fulfilled, (state, action) => {
        state.SPECIALS = action.payload
        state.loading = false;
      })
      .addCase(getSpecials.rejected, (state) => {
        state.loading = false;
      })
  }
});

export default specialsSlice.reducer;