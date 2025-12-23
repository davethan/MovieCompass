import { useLocation } from 'react-router-dom';
import { lazy } from 'react'

const MovieCard = lazy(() => import('../components/MovieCard'));

const IndividualMovie = () => {
    const location = useLocation();
    const movie = location.state?.movie;
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
        </div>
    )
}

export default IndividualMovie