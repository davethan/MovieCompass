import { useSelector, useDispatch } from 'react-redux';
import { incrementByAmount, getAllCurrentMoviesDetails } from '../store/slices/moviesSlice';
import type { RootState } from '../store';
import type { AppDispatch } from '../store';

const HomeView = () => {
    const count = useSelector((state: RootState) => state.movies.count);
    const loading = useSelector((state: RootState) => state.movies.loading);
    const movies = useSelector((state: RootState) => state.movies.MOVIES);
  
    const dispatch = useDispatch<AppDispatch>();

    const handleIncrement = () => {
        dispatch(incrementByAmount(5));
    };
    
    const handleFetch = () => {
        dispatch(getAllCurrentMoviesDetails());
    };

    const handleCustomAmount = () => {
        const input = document.getElementById('amountInput') as HTMLInputElement;
        const amount = parseInt(input.value) || 0;
        dispatch(incrementByAmount(amount));
    };

  return (
    <>        
        <div>
          <p>Current Count: <strong>{count}</strong></p>
          <p>Loading Status: 
            <span>
              {loading ? 'Loading...' : 'Idle'}
            </span>
          </p>
        </div>

        <div>
          <button className="btn btn-primary me-2" onClick={handleIncrement} disabled={loading}>
            Add 5 to Count
          </button>
        </div>

        <div>
          <input 
            type="number" 
            id="amountInput"
            defaultValue="10"
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button className="btn btn-primary me-2" onClick={handleCustomAmount}>
            Add Custom Amount
          </button>
          </div>
          
        <button className="btn btn-primary me-2" onClick={handleFetch}>
            fetch
          </button>
          
          {!loading && movies.length > 0 && (
              movies.map((movie) => (
                  <div>
                      { movie.greekTitle }
                  </div>
              ))
          )}
    </>
  )
}

export default HomeView
