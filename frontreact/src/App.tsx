import './assets/main.scss'
import { useEffect, lazy, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import LoadingView from './views/LoadingView'
import { getAllCurrentMoviesDetails, getMovieOmdbDataBasedOnLinkAction } from './store/slices/moviesSlice';
import type { AppDispatch, RootState } from './store';

const HomeView = lazy(() => import('./views/HomeView'));

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const movies = useSelector((state: RootState) => state.movies.MOVIES);
  const isLoading = useSelector((state: RootState) => state.movies.loading);

  document.body.setAttribute('data-bs-theme', 'dark');

  useEffect(() => {
    const fetchMoviesAndRatings = async () => {
      if (!movies.length) {
        const response = await dispatch(getAllCurrentMoviesDetails());
        if (!response) return;
      }
      const requests: Promise<unknown>[] = [];
      movies.forEach(movie => {
        requests.push(dispatch(getMovieOmdbDataBasedOnLinkAction({ id: movie.id, imdbLink: movie.imdbLink })))
      })
      Promise.allSettled(requests);
    }
    fetchMoviesAndRatings();
  }, [movies.length]);

  return isLoading ?
    <LoadingView /> : <Suspense fallback={<LoadingView />}> <HomeView /> </Suspense>
}

export default App
