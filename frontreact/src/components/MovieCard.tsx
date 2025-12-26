import type { Movie } from '../store/slices/types';
import { lazy } from 'react';

type MovieCardProps = {
  movie: Movie;
  cssClass?: string;
  cursorPointer?: string;
  onMovieClick?: (movie: Movie) => void;
}

const LastUpdated = lazy(() => import('./LastUpdated'))

const MovieCardWrapper = (Slot: React.ComponentType<Movie>) =>
  ({ movie, cssClass = 'col-sm-6 col-md-4 col-lg-3', cursorPointer = '', onMovieClick }: MovieCardProps) => {

    const handleClick = () => {
      if (onMovieClick) onMovieClick(movie)
    }

    return (
      <div className={cssClass} key={movie.id} onClick={handleClick}>
        <div className={`card film-item-no-hover ${cursorPointer}`}>
          <div className="card-header">
            <div className="row g-2">
              <div className="col-3">
                <img src={movie.imageUrl} alt={movie.greekTitle} className="img-fluid" />
              </div>
              <div className="col-9">
                <h2 className="text-primary m-0">{movie.greekTitle}</h2>
                <div>{movie.originalTitle} </div>
              </div>
              <div className="row g-2">
                <div className="col-12 d-flex justify-content-start flex-wrap gap-1 align-items-center">
                  <div className="tag-outlined">Σε {movie.cinemas.length} σινεμά
                  </div>
                  <div className="tag-outlined"> {movie.duration} </div>
                  <div className="tag-outlined">{movie.year} </div>
                  {movie.imdbRating ? (
                    <div className="tag-outlined">
                      {movie.imdbRating === "None" ? '?/10' : `${movie.imdbRating}/10`}
                    </div>
                  ) : (
                    <div className="rating-placeholder placeholder-glow"><span
                      className="placeholder rounded-3 col-12"></span></div>
                  )}
                  {movie.tags.map((tag, i) => <div key={i} className="tag-square">{tag}</div>)}
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="d-flex gap-3">
              <div>
                <b>Σκηνοθεσία</b> {movie.directors.map((director, i) => <span key={i}>{director}</span>)}
              </div>
            </div>
            <div className="my-4">
              {movie.summary}
            </div>
            <Slot {...movie} />
            {movie.actors.length && (
              <div className='md-2'>
                <b>Παίζουν:</b> {movie.actors.map((actor, i) => <span key={i}>{actor} </span>)}
              </div>
            )}
          <LastUpdated />
          </div>
        </div>
      </div >
    )
  }

export default MovieCardWrapper