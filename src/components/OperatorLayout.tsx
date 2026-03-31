import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Bus, Calendar, FileText, Armchair,
  Bell, ChevronDown, Menu, X, LucideIcon,
  Activity, Shield, Settings, LogOut,
} from 'lucide-react';

interface MenuItem {
  path: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

const menuItems: MenuItem[] = [
  { path: '/operator', label: 'Overview', icon: LayoutDashboard },
  { path: '/operator/fleet', label: 'Fleet & Staff', icon: Bus },
  { path: '/operator/scheduling', label: 'Scheduling', icon: Calendar },
  { path: '/operator/manifest', label: 'Manifest & Sales', icon: FileText },
  { path: '/operator/seats', label: 'Seat Inventory', icon: Armchair },
];

const OperatorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const notifications = [
    { id: 1, text: 'RAC 102B speeding — 72 km/h', time: '2 min ago', urgent: true },
    { id: 2, text: 'Harsh braking on RAC 205A', time: '15 min ago', urgent: true },
    { id: 3, text: '04:00 PM Huye trip predicted to sell out', time: '1 hr ago', urgent: false },
    { id: 4, text: 'RAC 310C idle for 45 minutes', time: '2 hr ago', urgent: false },
  ];

  const urgentCount = notifications.filter(n => n.urgent).length;
  const today = new Date().toLocaleDateString('en-RW', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const currentPage = menuItems.find(m => m.path === location.pathname)?.label ?? 'Dashboard';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} bg-[#0f3d23] text-white flex flex-col shadow-2xl shrink-0 transition-all duration-300`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-green-900 flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shrink-0 shadow">
            <Bus size={18} className="text-[#1E8449]" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight tracking-tight">TwagiyeNow</h1>
            <p className="text-xs text-green-400 font-medium">Operator Console</p>
          </div>
        </div>

        {/* Company Badge */}
        <div className="mx-4 mt-4 mb-1 bg-[#1a5c35] rounded-xl px-4 py-3 border border-green-800">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-green-400 shrink-0" />
            <div>
              <p className="text-xs text-green-400 uppercase tracking-widest font-semibold">Company</p>
              <p className="text-sm font-bold text-white">RITCO Ltd.</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-300">System Online</span>
          </div>
        </div>

        {/* Nav Label */}
        <p className="text-xs text-green-600 uppercase tracking-widest font-semibold px-5 mt-4 mb-1">Navigation</p>

        {/* Nav */}
        <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium group ${
                  isActive
                    ? 'bg-white text-[#1E8449] shadow-md'
                    : 'text-green-200 hover:bg-[#1a5c35] hover:text-white'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-[#1E8449]' : 'text-green-400 group-hover:text-white'} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${isActive ? 'bg-yellow-100 text-yellow-700' : 'bg-yellow-500 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>


      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="hidden sm:block">
              <p className="text-xs text-gray-400">{today}</p>
              <p className="text-sm font-bold text-gray-800">{currentPage}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live clock */}
            <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-500 font-mono">
              <Activity size={13} className="text-green-500" />
              <span className="text-gray-700 font-semibold">
                {time.toLocaleTimeString('en-RW', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
                className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition"
              >
                <Bell size={19} />
                {urgentCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                    {urgentCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                    <p className="font-bold text-gray-800 text-sm">Notifications</p>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{urgentCount} urgent</span>
                  </div>
                  <div className="divide-y max-h-72 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition ${n.urgent ? 'border-l-4 border-red-400' : 'border-l-4 border-transparent'}`}>
                        <div className="flex items-start gap-2">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.urgent ? 'bg-red-500' : 'bg-gray-300'}`} />
                          <div>
                            <p className="text-sm text-gray-800 font-medium">{n.text}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t bg-gray-50">
                    <button className="text-xs text-[#1E8449] font-bold hover:underline">Mark all as read</button>
                  </div>
                </div>
              )}
            </div>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition"
              >
                <div className="w-8 h-8 rounded-xl bg-[#1E8449] flex items-center justify-center text-white text-sm font-bold shadow">M</div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-gray-800">Manager</p>
                  <p className="text-xs text-gray-400">RITCO Ltd.</p>
                </div>
                <ChevronDown size={13} className="text-gray-400" />
              </button>
              {userOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <p className="text-xs font-bold text-gray-800">Manager</p>
                    <p className="text-xs text-gray-400">manager@ritco.rw</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => { setSettingsOpen(true); setUserOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Settings size={14} /> Settings
                    </button>
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto" onClick={() => { setNotifOpen(false); setUserOpen(false); }}>
          {children}
        </main>
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setSettingsOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">Settings</h2>
              <button onClick={() => setSettingsOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Account</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <span className="text-sm text-gray-700">Name</span>
                    <span className="text-sm font-semibold text-gray-900">Manager</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <span className="text-sm text-gray-700">Email</span>
                    <span className="text-sm font-semibold text-gray-900">manager@ritco.rw</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <span className="text-sm text-gray-700">Company</span>
                    <span className="text-sm font-semibold text-gray-900">RITCO Ltd.</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Preferences</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <span className="text-sm text-gray-700">Language</span>
                    <span className="text-sm font-semibold text-gray-900">English</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <span className="text-sm text-gray-700">Notifications</span>
                    <span className="text-sm font-semibold text-emerald-600">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSettingsOpen(false)}
              className="mt-5 w-full bg-[#1E8449] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorLayout;
