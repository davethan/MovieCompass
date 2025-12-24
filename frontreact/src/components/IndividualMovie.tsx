import { useLocation } from 'react-router-dom';
import { lazy } from 'react'
import { useDispatch } from 'react-redux';
import { takeNote } from '../store/slices/moviesSlice';
import type { AppDispatch } from '../store';
import type { Movie } from '../store/slices/types';

const MovieCard = lazy(() => import('../components/MovieCard'));

const IndividualMovie = () => {
    const location = useLocation();

    const movie = location.state?.movie as Movie;
    const dispatch = useDispatch<AppDispatch>();

    const handleClick = () => dispatch(takeNote({ id: movie.id, note: 'my note is here!' }));
    return (
        <div className='row g-3 m-2'>
            <MovieCard movie={movie} cssClass='col-6' />
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
                <textarea></textarea>
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