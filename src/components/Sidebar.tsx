import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Building2, TrendingUp, AlertCircle, MapPin, Activity, LucideIcon } from 'lucide-react';

interface MenuItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/companies', label: 'Companies', icon: Building2 },
    { path: '/revenue', label: 'Revenue', icon: TrendingUp },
    { path: '/disputes', label: 'Disputes', icon: AlertCircle },
    { path: '/routes', label: 'Routes', icon: MapPin },
    { path: '/health', label: 'Health', icon: Activity },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-primary text-white shadow-lg border-t border-primaryLight">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold">TwagiyeNow</h1>
          <span className="text-xs text-primaryLight">Super Admin</span>
        </div>

        <div className="flex items-center gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-primary font-semibold'
                    : 'text-primaryLight hover:bg-primaryLight hover:text-primary'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
