import { useLocation } from 'react-router-dom';
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { takeNote, getMovieById } from '../store/slices/moviesSlice';
import type { AppDispatch, RootState } from '../store';
import type { Movie } from '../store/slices/types';
import MovieCardWrapper from '../components/MovieCard';
import { LastUpdateContext } from '../context/index'

const MovieNote = (movie: Movie) => (
  <>
    {movie.note && <div className="mb-4">Note: {movie.note}</div>}
  </>
);
const MovieCard = MovieCardWrapper(MovieNote);

const IndividualMovie = () => {
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();

    const movie = useSelector((state: RootState) => getMovieById(state, location.state.movieId)) as Movie;
    const [filmNote, setFilmNote] = useState(movie.note)
    const handleClick = () => dispatch(takeNote({ id: movie.id, note: filmNote }));
    return (
        <div className='row g-3 m-2'>
            <LastUpdateContext.Provider value={'value from indvidual movie'}>
                <MovieCard movie={movie} cssClass='col-6' />
            </LastUpdateContext.Provider>
            <div className='col-6'>
                {movie.trailer && (
                    <div className="card film-item-no-hover">
                        <div className="card-body" style={{minHeight: '350px'}}>
                            <iframe src={movie.trailer} style={{width: "100%", height:"100%"}} />
                        </div>
                    </div>
                )}
            </div>
            <div className='col-12 d-flex gap-2'>
                <label>Note:</label>
                <textarea value={filmNote} onChange={(e) => setFilmNote(e.target.value)}></textarea>
                <button className='btn btn-outline-secondary' onClick={handleClick}>Send!</button>
            </div>
            <div className="col-12">
                <div className="row g-2">
                    {movie.cinemas.map((cinema, i) =>
                        <div key={i} className='col-3'>
                            <div className='card'>
                                <div className='card-header'>{cinema.cinema}</div>
                                <div className='card-body d-flex gap-2 flex-column'>{Object.entries(cinema.cinemaSchedule).map(([day, schedule]) =>
                                    <div key={day}>{day}: {schedule}</div>
                                )}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default IndividualMovie