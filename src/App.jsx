import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CompanyOnboarding from './pages/CompanyOnboarding';
import RevenueAnalytics from './pages/RevenueAnalytics';
import DisputeCenter from './pages/DisputeCenter';
import RouteRegulator from './pages/RouteRegulator';
import PlatformHealth from './pages/PlatformHealth';
import './index.css';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/companies" element={<CompanyOnboarding />} />
            <Route path="/revenue" element={<RevenueAnalytics />} />
            <Route path="/disputes" element={<DisputeCenter />} />
            <Route path="/routes" element={<RouteRegulator />} />
            <Route path="/health" element={<PlatformHealth />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
