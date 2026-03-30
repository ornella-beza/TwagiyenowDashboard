import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Building2, TrendingUp, AlertCircle, MapPin, Activity } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/companies', label: 'Company Onboarding', icon: Building2 },
    { path: '/revenue', label: 'Revenue Analytics', icon: TrendingUp },
    { path: '/disputes', label: 'Dispute Center', icon: AlertCircle },
    { path: '/routes', label: 'Route Regulator', icon: MapPin },
    { path: '/health', label: 'Platform Health', icon: Activity },
  ];

  return (
    <aside className="w-64 bg-primary text-white shadow-lg">
      <div className="p-6 border-b border-primaryLight">
        <h1 className="text-2xl font-bold">TwagiyeNow</h1>
        <p className="text-sm text-primaryLight">Super Admin</p>
      </div>

      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                isActive
                  ? 'bg-white text-primary font-semibold'
                  : 'text-primaryLight hover:bg-primaryLight hover:text-primary'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
