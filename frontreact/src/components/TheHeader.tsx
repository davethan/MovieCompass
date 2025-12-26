import { useNavigate } from 'react-router-dom';

const TheHeader = () => {

  const navigate = useNavigate();
  const handleClick = () => navigate('/');

  return (
      <div className="navbar sticky-top navbar-dark bg-dark px-3">
        <div className="d-flex gap-3 justify-content-between align-items-center">
          <h4 className="m-0 cursor-pointer text-gradient" onClick={handleClick}>Athens Cinemas</h4>
        </div>
      </div>
  )
}

export default TheHeader