import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OperatorLayout from './components/OperatorLayout';
import OperatorDashboard from './pages/operator/OperatorDashboard';
import FleetStaff from './pages/operator/FleetStaff';
import Scheduling from './pages/operator/Scheduling';
import Manifest from './pages/operator/Manifest';
import SeatInventory from './pages/operator/SeatInventory';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/operator" replace />} />
        <Route
          path="/operator/*"
          element={
            <OperatorLayout>
              <Routes>
                <Route path="/" element={<OperatorDashboard />} />
                <Route path="/fleet" element={<FleetStaff />} />
                <Route path="/scheduling" element={<Scheduling />} />
                <Route path="/manifest" element={<Manifest />} />
                <Route path="/seats" element={<SeatInventory />} />
              </Routes>
            </OperatorLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
