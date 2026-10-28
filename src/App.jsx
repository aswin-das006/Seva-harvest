import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Homepage from './Components/Homepage';
import DonationForm from './Components/Donationform';
import DonationDashboard from './Components/Donationdashboard';
import AdminPanel from './Components/Adminpanel';
import Login from './Components/Login';
import VolunteerLogin from './Components/VolunteerLogin';
import Volunteers from './Components/Volunteer';

function ProtectedAdmin() {
  const isAdmin =
    sessionStorage.getItem('isFoodBridgeAdmin') === 'true';

  return isAdmin
    ? <AdminPanel />
    : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/donate" element={<DonationForm />} />
        <Route path="/dashboard" element={<DonationDashboard />} />
        <Route path="/admin" element={<ProtectedAdmin />} />

        {/* Volunteer pages */}
        <Route
          path="/volunteer-login"
          element={<VolunteerLogin />}
        />
        <Route
          path="/volunteers"
          element={<Volunteers />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;