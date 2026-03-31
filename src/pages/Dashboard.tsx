import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Bus, Calendar, ArrowUpRight, Route } from 'lucide-react';
import api from '../api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [weekData, setWeekData] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, weekRes, busesRes, routesRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/stats/bookings-week'),
          api.get('/buses'),
          api.get('/routes'),
        ]);
        setStats(statsRes.data);
        setWeekData(weekRes.data.map((d: any) => ({
          date: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
          revenue: parseFloat(d.revenue),
          bookings: parseInt(d.bookings),
        })));
        setBuses(busesRes.data);
        setRoutes(routesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="page-container flex items-center justify-center h-64"><p className="text-muted">Loading dashboard...</p></div>;

  const statCards = [
    { label: 'Total Users',       value: stats?.total_users ?? 0,      icon: Users,      iconBg: '#E8F5E9', iconColor: '#1E8449' },
    { label: 'Total Buses',       value: stats?.total_buses ?? 0,      icon: Bus,        iconBg: '#FFF8E1', iconColor: '#F5A623' },
    { label: 'Total Routes',      value: stats?.total_routes ?? 0,     icon: Route,      iconBg: '#FEF3E2', iconColor: '#E67E22' },
    { label: 'Bookings Today',    value: stats?.bookings_today ?? 0,   icon: Calendar,   iconBg: '#F5F5F5', iconColor: '#888888' },
    { label: 'Revenue Today (RWF)', value: `${(stats?.revenue_today ?? 0).toLocaleString()} RWF`, icon: TrendingUp, iconBg: '#E8F5E9', iconColor: '#1E8449' },
    { label: 'Schedules Today',   value: stats?.schedules_today ?? 0,  icon: Calendar,   iconBg: '#FFF8E1', iconColor: '#F5A623' },
  ];

  return (
    <div className="page-container">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="stat-card">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.iconBg }}>
                  <Icon size={20} style={{ color: stat.iconColor }} />
                </div>
                <ArrowUpRight size={16} className="text-muted" />
              </div>
              <p className="text-xs font-medium text-muted uppercase tracking-wide">{stat.label}</p>
              <p className="text-2xl font-bold text-black mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

        {/* Weekly Revenue Chart */}
        <div className="content-card xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-heading mb-0">Weekly Bookings & Revenue</h2>
            <span className="badge badge-green">Last 7 Days</span>
          </div>
          {weekData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weekData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#888888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#888888' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #F5F5F5', fontSize: 13 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="revenue"  fill="#1E8449" name="Revenue (RWF)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bookings" fill="#F5A623" name="Bookings"      radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted text-sm">No booking data yet</div>
          )}
        </div>

        {/* Platform Summary */}
        <div className="content-card flex flex-col gap-4">
          <h2 className="section-heading mb-0">Platform Summary</h2>
          {[
            { label: 'Total Buses',      value: stats?.total_buses,      color: '#1E8449' },
            { label: 'Total Routes',     value: stats?.total_routes,     color: '#F5A623' },
            { label: 'Bookings Today',   value: stats?.bookings_today,   color: '#E67E22' },
            { label: 'Schedules Today',  value: stats?.schedules_today,  color: '#888888' },
            { label: 'Total Users',      value: stats?.total_users,      color: '#1E8449' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-divider last:border-0">
              <span className="text-sm text-muted">{item.label}</span>
              <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Routes Table */}
      <div className="content-card mb-6">
        <h2 className="section-heading mb-4">Active Routes ({routes.length})</h2>
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th className="th-cell">From</th>
                <th className="th-cell">To</th>
                <th className="th-cell">Distance (km)</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r: any) => (
                <tr key={r.id} className="tr-row">
                  <td className="td-cell font-semibold text-black">{r.from_city}</td>
                  <td className="td-cell text-black">{r.to_city}</td>
                  <td className="td-cell text-muted">{r.distance_km} km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buses Table */}
      <div className="content-card">
        <h2 className="section-heading mb-4">Registered Buses ({buses.length})</h2>
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th className="th-cell">Name</th>
                <th className="th-cell">Plate</th>
                <th className="th-cell">Capacity</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((b: any) => (
                <tr key={b.id} className="tr-row">
                  <td className="td-cell font-semibold text-black">{b.name}</td>
                  <td className="td-cell font-mono text-xs text-muted">{b.plate}</td>
                  <td className="td-cell text-muted">{b.capacity} seats</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
