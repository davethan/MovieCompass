import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import HomeView from '../views/HomeView';
import IndividualMovie from '../components/IndividualMovie';
import Specials from '../components/Specials';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" index element={<HomeView />} />
      <Route path="/film/:filmId" element={<IndividualMovie />} />
      <Route path="/specials" element={<Specials />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;