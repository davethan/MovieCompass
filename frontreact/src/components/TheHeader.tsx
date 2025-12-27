import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getSpecials } from '../store/slices/specialsSlice';
import type { AppDispatch } from '../store';

const TheHeader = () => {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const handleHomeClick = () => navigate('/');
  const handleSpecialsClick = async () => {
    const response = await dispatch(getSpecials());
    if (getSpecials.fulfilled.match(response)) navigate('/specials');
  };

  return (
      <div className="navbar sticky-top navbar-dark bg-dark px-3">
        <div className="d-flex gap-3 justify-content-between align-items-center">
          <h4 className="m-0 cursor-pointer text-gradient" onClick={handleHomeClick}>Athens Cinemas</h4>
          <button className='btn btn-outline-secondary' onClick={handleSpecialsClick}>Specials</button>
        </div>
      </div>
  )
}

export default TheHeader