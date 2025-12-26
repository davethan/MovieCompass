import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../store/slices/types';
import MovieCardWrapper from '../components/MovieCard';

const NothingComponent = () => <></>
const MovieCard = MovieCardWrapper(NothingComponent)

const HomeView = () => {
  const loading = useSelector((state: RootState) => state.movies.loading);
  const loadingRating = useSelector((state: RootState) => state.movies.loadingRating);
  const movies = useSelector((state: RootState) => state.movies.MOVIES);
  const navigate = useNavigate();

  const onMovieClick = (movie: Movie) => {
    navigate(`/film/${movie.id}`, {
      state: { movieId: movie.id }
    });
  };

  const sortedMovies = useMemo(() => {
    const sortedOnes = [...movies]
    .sort((a, b) => {
      if (a.imdbRating !== 'None' && b.imdbRating !== 'None') {
        if (b.imdbRating !== a.imdbRating) {
          return Number(b.imdbRating) - Number(a.imdbRating);
        }
      }
      if (a.imdbRating === 'None' && b.imdbRating !== 'None') {
        return 1;
      }
      if (a.imdbRating !== 'None' && b.imdbRating === 'None') {
        return -1;
      }
      return b.cinemas.length - a.cinemas.length;
    })
    return sortedOnes
  }, [movies]);

  const [isSorted, setIsSorted] = useState(false);
  
  const moviesToDisplay = isSorted ? sortedMovies : movies;

  const sortByRating = () => setIsSorted(!isSorted);

  return (
    <div className='m-2'>
      {!loadingRating && (
        <button className='btn btn-outline-primary mb-2' onClick={sortByRating}>
          {isSorted ? 'Show original' : 'Sort by rating'}
        </button>
      )}
      {!loading && moviesToDisplay.length > 0 && (
        <div className='row g-2'>
          {moviesToDisplay.map((movie) => (
            <MovieCard key={movie.id} movie={movie} cursorPointer='cursor-pointer' onMovieClick={onMovieClick} />
          ))}
        </div>
      )}
      {!loading && moviesToDisplay.length === 0 && (
        <div>no movies</div>
      )}
    </div>
  )
}

export default HomeView