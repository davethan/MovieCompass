import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './slices/moviesSlice';
import specialsReducer from './slices/specialsSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    specials: specialsReducer,
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
