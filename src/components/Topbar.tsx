import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Settings } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/':             'Dashboard',
  '/companies':    'Company Onboarding',
  '/buses':        'Bus Management',
  '/schedules':    'Schedule Management',
  '/private-cars': 'Private Cars',
  '/bookings':     'Bookings',
  '/revenue':      'Revenue Analytics',
  '/disputes':     'Dispute Center',
  '/routes':       'Route Regulator',
  '/health':       'Platform Health',
};

const Topbar: React.FC = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? 'Dashboard';

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-divider flex-shrink-0">
      <div>
        <h1 className="text-lg font-bold text-black leading-none">{title}</h1>
        <p className="text-xs text-muted mt-1">{dateStr}</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button className="relative p-2 text-muted hover:text-black hover:bg-divider rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-secondary rounded-full ring-2 ring-white" />
        </button>

        {/* Settings */}
        <button className="p-2 text-muted hover:text-black hover:bg-divider rounded-lg transition-colors">
          <Settings size={18} />
        </button>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-divider">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: '#1E8449' }}
          >
            SA
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-black leading-none">Super Admin</p>
            <p className="text-xs text-muted mt-0.5">admin@twagiyenow.rw</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
