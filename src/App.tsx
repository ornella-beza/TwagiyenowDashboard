import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import QRScanner from './pages/QRScanner';
import Login from './pages/Login';
import './index.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('admin_token'));

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;
  return (
    <Router>
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
              <Route path="/scan-qr" element={<QRScanner />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
