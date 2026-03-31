import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OperatorLayout from './components/OperatorLayout';
import OperatorDashboard from './pages/operator/OperatorDashboard';
import FleetStaff from './pages/operator/FleetStaff';
import Scheduling from './pages/operator/Scheduling';
import Manifest from './pages/operator/Manifest';
import SeatInventory from './pages/operator/SeatInventory';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import CompanyOnboarding from './pages/CompanyOnboarding';
import BusManagement from './pages/BusManagement';
import ScheduleManagement from './pages/ScheduleManagement';
import PrivateCarsManagement from './pages/PrivateCarsManagement';
import BookingsManagement from './pages/BookingsManagement';
import RevenueAnalytics from './pages/RevenueAnalytics';
import DisputeCenter from './pages/DisputeCenter';
import RouteRegulator from './pages/RouteRegulator';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Operator Routes */}
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
        {/* Super Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <div className="flex h-screen overflow-hidden bg-surface">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                <Topbar />
                <main className="flex-1 overflow-y-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/companies" element={<CompanyOnboarding />} />
                    <Route path="/buses" element={<BusManagement />} />
                    <Route path="/schedules" element={<ScheduleManagement />} />
                    <Route path="/private-cars" element={<PrivateCarsManagement />} />
                    <Route path="/bookings" element={<BookingsManagement />} />
                    <Route path="/revenue" element={<RevenueAnalytics />} />
                    <Route path="/disputes" element={<DisputeCenter />} />
                    <Route path="/routes" element={<RouteRegulator />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
