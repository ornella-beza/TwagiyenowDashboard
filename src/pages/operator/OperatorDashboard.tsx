import { useState, useEffect } from 'react';
import {
  Bus, Users, AlertTriangle, CheckCircle, MapPin, Banknote,
  TrendingUp, Clock,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

interface BusLive {
  id: string;
  plate: string;
  driver: string;
  route: string;
  speed: number;
  status: 'on-route' | 'idle' | 'speeding';
  passengers: number;
  capacity: number;
  location: string;
}

interface TripTimeline {
  id: string;
  bus: string;
  route: string;
  time: string;
  gate: string;
  status: 'upcoming' | 'boarding' | 'departed';
  filled: number;
  capacity: number;
}

const initialBuses: BusLive[] = [
  { id: '1', plate: 'RAC 102B', driver: 'Jean Bosco', route: 'Nyabugogo → Rubavu', speed: 72, status: 'speeding', passengers: 44, capacity: 49, location: 'Muhanga' },
  { id: '2', plate: 'RAC 205A', driver: 'Eric Mugisha', route: 'Nyabugogo → Huye', speed: 58, status: 'on-route', passengers: 38, capacity: 49, location: 'Gitarama' },
  { id: '3', plate: 'RAC 310C', driver: 'Alice Uwase', route: 'Nyabugogo → Musanze', speed: 0, status: 'idle', passengers: 0, capacity: 49, location: 'Nyabugogo' },
  { id: '4', plate: 'RAC 418D', driver: 'Patrick Nkusi', route: 'Nyabugogo → Rwamagana', speed: 55, status: 'on-route', passengers: 31, capacity: 49, location: 'Kigali East' },
];

const alerts = [
  { id: '1', driver: 'Jean Bosco', bus: 'RAC 102B', message: 'Speeding: 72 km/h (limit 60 km/h)', time: '2 min ago', severity: 'high' as const },
  { id: '2', driver: 'Eric Mugisha', bus: 'RAC 205A', message: 'Harsh braking detected', time: '15 min ago', severity: 'medium' as const },
];

const timeline: TripTimeline[] = [
  { id: '1', bus: 'RAC 102B', route: 'Nyabugogo → Rubavu', time: '08:00 AM', gate: 'Gate 3', status: 'departed', filled: 44, capacity: 49 },
  { id: '2', bus: 'RAC 205A', route: 'Nyabugogo → Huye', time: '09:30 AM', gate: 'Gate 1', status: 'departed', filled: 38, capacity: 49 },
  { id: '3', bus: 'RAC 310C', route: 'Nyabugogo → Musanze', time: '11:00 AM', gate: 'Gate 5', status: 'boarding', filled: 22, capacity: 49 },
  { id: '4', bus: 'RAC 418D', route: 'Nyabugogo → Rwamagana', time: '01:00 PM', gate: 'Gate 2', status: 'upcoming', filled: 8, capacity: 49 },
  { id: '5', bus: 'RAC 102B', route: 'Nyabugogo → Huye', time: '04:00 PM', gate: 'Gate 4', status: 'upcoming', filled: 3, capacity: 49 },
];

const revenueData = [
  { hour: '06:00', cash: 45000, momo: 62000 },
  { hour: '07:00', cash: 78000, momo: 95000 },
  { hour: '08:00', cash: 120000, momo: 145000 },
  { hour: '09:00', cash: 95000, momo: 110000 },
  { hour: '10:00', cash: 60000, momo: 88000 },
  { hour: '11:00', cash: 72000, momo: 91000 },
  { hour: '12:00', cash: 55000, momo: 70000 },
  { hour: '13:00', cash: 42000, momo: 65000 },
];

const statusConfig = {
  speeding: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Speeding' },
  idle: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-400', label: 'Idle' },
  'on-route': { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'On Route' },
};

const tripStatusConfig = {
  departed: { bg: 'bg-gray-100', text: 'text-gray-500' },
  boarding: { bg: 'bg-amber-100', text: 'text-amber-700' },
  upcoming: { bg: 'bg-blue-100', text: 'text-blue-700' },
};

const OperatorDashboard: React.FC = () => {
  const [buses, setBuses] = useState<BusLive[]>(initialBuses);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prev => prev.map(b => {
        if (b.status === 'idle') return b;
        const delta = Math.floor(Math.random() * 7) - 3;
        const newSpeed = Math.max(0, Math.min(90, b.speed + delta));
        return { ...b, speed: newSpeed, status: newSpeed > 60 ? 'speeding' : 'on-route' };
      }));
      setTick(t => t + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalRevenue = 1_284_500;
  const cashRevenue = 512_000;
  const momoRevenue = totalRevenue - cashRevenue;
  const activeAlerts = buses.filter(b => b.status === 'speeding').length;
  const activeBuses = buses.filter(b => b.status !== 'idle').length;

  const kpis = [
    {
      label: "Today's Revenue",
      value: `${(totalRevenue / 1000).toFixed(0)}K`,
      unit: 'RWF',
      icon: Banknote,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      trend: '+12%',
      trendUp: true,
      sub: 'vs. yesterday',
    },
    {
      label: 'Active Buses',
      value: String(activeBuses),
      unit: `/ ${buses.length}`,
      icon: Bus,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: '+1',
      trendUp: true,
      sub: 'fleet deployed',
    },
    {
      label: 'Trips Today',
      value: '34',
      unit: 'trips',
      icon: MapPin,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      trend: '6 left',
      trendUp: true,
      sub: 'remaining today',
    },
    {
      label: 'Driver Alerts',
      value: String(activeAlerts),
      unit: 'active',
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
      trend: activeAlerts > 0 ? 'Action needed' : 'All clear',
      trendUp: activeAlerts === 0,
      sub: 'behavior alerts',
    },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Fleet Overview</h1>
          <p className="text-xs text-gray-400 mt-0.5">Live data · auto-refreshes every 3 seconds</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-gray-500 font-medium">Live Feed</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-700 font-mono font-semibold">tick #{tick}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${kpi.iconBg}`}>
                  <Icon size={20} className={kpi.iconColor} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {kpi.value} <span className="text-sm font-medium text-gray-400">{kpi.unit}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart + Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-800">Revenue Trend — Cash vs MoMo</h2>
              <p className="text-xs text-gray-400 mt-0.5">Hourly breakdown for today</p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg font-medium">
              {totalRevenue.toLocaleString()} RWF total
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E8449" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1E8449" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="momoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip formatter={(v: number) => `${v.toLocaleString()} RWF`} contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="cash" stroke="#1E8449" strokeWidth={2} fill="url(#cashGrad)" name="Cash" />
              <Area type="monotone" dataKey="momo" stroke="#f59e0b" strokeWidth={2} fill="url(#momoGrad)" name="MoMo" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Split */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-1">Payment Split</h2>
            <p className="text-xs text-gray-400 mb-4">Cash vs Mobile Money</p>
            <div className="flex rounded-full overflow-hidden h-4 mb-3">
              <div
                className="bg-emerald-500 transition-all"
                style={{ width: `${(cashRevenue / totalRevenue) * 100}%` }}
              />
              <div
                className="bg-amber-400 transition-all"
                style={{ width: `${(momoRevenue / totalRevenue) * 100}%` }}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-gray-600 font-medium">Cash</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{cashRevenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{Math.round((cashRevenue / totalRevenue) * 100)}%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="text-xs text-gray-600 font-medium">MoMo</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{momoRevenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{Math.round((momoRevenue / totalRevenue) * 100)}%</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Total Revenue</span>
              <span className="text-base font-bold text-gray-900">{(totalRevenue / 1000).toFixed(1)}K RWF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Table + Alerts + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Live Fleet Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Bus size={18} className="text-[#1E8449]" />
              <h2 className="text-sm font-bold text-gray-800">Real-Time Fleet Command</h2>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg font-semibold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Bus</th>
                  <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Driver</th>
                  <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Route</th>
                  <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Speed</th>
                  <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Load</th>
                  <th className="pb-3 font-semibold uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {buses.map((bus) => {
                  const cfg = statusConfig[bus.status];
                  return (
                    <tr key={bus.id} className="hover:bg-gray-50 transition group">
                      <td className="py-3.5 pr-4">
                        <p className="font-bold text-gray-900 text-xs">{bus.plate}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{bus.location}</p>
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-gray-600">{bus.driver}</td>
                      <td className="py-3.5 pr-4 text-xs text-gray-500 max-w-[120px] truncate">{bus.route}</td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-14 bg-gray-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${bus.speed > 60 ? 'bg-red-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(100, (bus.speed / 90) * 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${bus.speed > 60 ? 'text-red-600' : 'text-gray-700'}`}>
                            {bus.speed} <span className="font-normal text-gray-400">km/h</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-gray-100 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full bg-blue-400 transition-all"
                              style={{ width: `${(bus.passengers / bus.capacity) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{bus.passengers}/{bus.capacity}</span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Map placeholder */}
          <div className="mt-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-32 flex items-center justify-center border-2 border-dashed border-gray-200">
            <div className="text-center text-gray-400">
              <MapPin size={24} className="mx-auto mb-1.5 text-gray-300" />
              <p className="text-xs font-semibold text-gray-500">Live GPS Map</p>
              <p className="text-xs text-gray-400">Integrate Google Maps / Mapbox API</p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Driver Alerts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500" />
                <h2 className="text-sm font-bold text-gray-800">Driver Alerts</h2>
              </div>
              {alerts.length > 0 && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-lg font-bold">{alerts.length}</span>
              )}
            </div>
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-gray-400">
                <CheckCircle size={28} className="mb-2 text-emerald-400" />
                <p className="text-xs font-medium">All drivers behaving well</p>
              </div>
            ) : (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-xl ${alert.severity === 'high' ? 'bg-red-50 border border-red-100' : 'bg-amber-50 border border-amber-100'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${alert.severity === 'high' ? 'bg-red-500' : 'bg-amber-400'}`} />
                        <p className="font-bold text-gray-800 text-xs">{alert.driver}</p>
                      </div>
                      <p className="text-xs text-gray-400">{alert.time}</p>
                    </div>
                    <p className="text-xs text-gray-500 pl-3.5">{alert.bus}</p>
                    <p className="text-xs text-gray-700 mt-1 pl-3.5 font-medium">{alert.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Trip Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-[#1E8449]" />
              <h2 className="text-sm font-bold text-gray-800">Today's Trips</h2>
            </div>
            <div className="space-y-1.5">
              {timeline.map((trip) => {
                const cfg = tripStatusConfig[trip.status];
                return (
                  <div key={trip.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition">
                    <div className="text-center shrink-0 w-14">
                      <p className="text-xs font-bold text-gray-700">{trip.time}</p>
                      <p className="text-xs text-blue-600 font-semibold">{trip.gate}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{trip.route}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex-1 bg-gray-100 rounded-full h-1">
                          <div
                            className="h-1 rounded-full bg-[#1E8449] transition-all"
                            style={{ width: `${(trip.filled / trip.capacity) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">{trip.filled}/{trip.capacity}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-lg font-semibold capitalize shrink-0 ${cfg.bg} ${cfg.text}`}>
                      {trip.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Staff on Duty */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-[#1E8449]" />
              <h2 className="text-sm font-bold text-gray-800">Staff on Duty</h2>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Drivers Active', value: '9', color: 'text-emerald-600' },
                { label: 'Conductors', value: '7', color: 'text-blue-600' },
                { label: 'On Leave', value: '2', color: 'text-amber-600' },
                { label: 'Total Staff', value: '18', color: 'text-gray-800' },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;
