import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3, Building2, TrendingUp, AlertCircle, MapPin,
  Bus, Calendar, Car, Ticket, ChevronLeft, ChevronRight, QrCode,
  LucideIcon,
} from 'lucide-react';

interface MenuItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { path: '/',             label: 'Dashboard',       icon: BarChart3    },
  { path: '/companies',   label: 'Companies',        icon: Building2    },
  { path: '/buses',       label: 'Buses',            icon: Bus          },
  { path: '/schedules',   label: 'Schedules',        icon: Calendar     },
  { path: '/private-cars',label: 'Private Cars',     icon: Car          },
  { path: '/bookings',    label: 'Bookings',         icon: Ticket       },
  { path: '/revenue',     label: 'Revenue',          icon: TrendingUp   },
  { path: '/disputes',    label: 'Disputes',         icon: AlertCircle  },
  { path: '/routes',      label: 'Routes',           icon: MapPin       },
  { path: '/scan-qr',     label: 'Scan QR',          icon: QrCode       },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
        collapsed ? 'w-[64px]' : 'w-[240px]'
      }`}
      style={{ backgroundColor: '#14532D' }}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-[18px] border-b flex-shrink-0 ${
          collapsed ? 'justify-center' : ''
        }`}
        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <Bus size={16} className="text-primary-700" style={{ color: '#145A32' }} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-white leading-none truncate">TwagiyeNow</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: '#86efac' }}>
              Super Admin
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-0.5 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium ${
                    collapsed ? 'justify-center' : ''
                  }`}
                  style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                    color: isActive ? '#ffffff' : 'rgba(187,247,208,0.75)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.08)';
                      (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(187,247,208,0.75)';
                    }
                  }}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div
        className="flex-shrink-0 border-t p-3"
        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all text-sm font-medium ${
            collapsed ? 'justify-center' : ''
          }`}
          style={{ color: 'rgba(187,247,208,0.75)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.08)';
            (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(187,247,208,0.75)';
          }}
        >
          {collapsed ? <ChevronRight size={18} /> : (
            <>
              <ChevronLeft size={18} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
