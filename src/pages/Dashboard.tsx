import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, Bus, AlertTriangle, LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RevenueData {
  date: string;
  revenue: number;
  commission: number;
}

interface DemandRoute {
  location: string;
  demand: number;
  available: number;
}

interface StatCard {
  label: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  trend: string;
  trendUp: boolean;
}

const revenueData: RevenueData[] = [
  { date: 'Mon', revenue: 45000, commission: 2250 },
  { date: 'Tue', revenue: 52000, commission: 2600 },
  { date: 'Wed', revenue: 48000, commission: 2400 },
  { date: 'Thu', revenue: 61000, commission: 3050 },
  { date: 'Fri', revenue: 55000, commission: 2750 },
  { date: 'Sat', revenue: 67000, commission: 3350 },
  { date: 'Sun', revenue: 72000, commission: 3600 },
];

const demandRoutes: DemandRoute[] = [
  { location: 'Kigali – Musanze',   demand: 85, available: 45 },
  { location: 'Kigali – Gitarama',  demand: 72, available: 60 },
  { location: 'Kigali – Muhanga',   demand: 90, available: 30 },
  { location: 'Kigali – Ruhengeri', demand: 65, available: 50 },
  { location: 'Kigali – Butare',    demand: 78, available: 40 },
];

const stats: StatCard[] = [
  {
    label: 'Total Revenue (Today)',
    value: '₨ 45.2M',
    icon: TrendingUp,
    iconBg: '#E8F5E9',
    iconColor: '#1E8449',
    trend: '+12% vs yesterday',
    trendUp: true,
  },
  {
    label: 'Active Buses',
    value: '1,234',
    icon: Bus,
    iconBg: '#FFF8E1',
    iconColor: '#F5A623',
    trend: '+18 since morning',
    trendUp: true,
  },
  {
    label: 'Total Users',
    value: '52.3K',
    icon: Users,
    iconBg: '#FEF3E2',
    iconColor: '#E67E22',
    trend: '+340 this week',
    trendUp: true,
  },
  {
    label: 'Pending Disputes',
    value: '23',
    icon: AlertTriangle,
    iconBg: '#F5F5F5',
    iconColor: '#888888',
    trend: '–5 from yesterday',
    trendUp: false,
  },
];

const Dashboard: React.FC = () => {
  return (
    <div className="page-container">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trendUp ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={idx} className="stat-card">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: stat.iconBg }}
                >
                  <Icon size={20} style={{ color: stat.iconColor }} />
                </div>
              </div>
              <p className="text-xs font-medium text-muted uppercase tracking-wide">{stat.label}</p>
              <p className="text-2xl font-bold text-black mt-1">{stat.value}</p>
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.trendUp ? 'text-primary' : 'text-muted'}`}>
                <TrendIcon size={13} />
                <span>{stat.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

        {/* Revenue Bar Chart — 2/3 width */}
        <div className="content-card xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-heading mb-0">Weekly Revenue & Commission</h2>
            <span className="badge badge-green">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#888888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#888888' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #F5F5F5', fontSize: 13 }}
                formatter={(value: number) => [`₨ ${value.toLocaleString()}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="revenue"    fill="#1E8449" name="Total Revenue"       radius={[4, 4, 0, 0]} />
              <Bar dataKey="commission" fill="#F5A623" name="Platform Commission" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats — 1/3 width */}
        <div className="content-card flex flex-col gap-4">
          <h2 className="section-heading mb-0">Platform Summary</h2>

          {[
            { label: 'Companies Onboarded', value: '38',     color: '#1E8449' },
            { label: 'Routes Defined',       value: '124',    color: '#F5A623' },
            { label: 'Bookings (Today)',      value: '4,820',  color: '#E67E22' },
            { label: 'Avg Ticket Price',      value: '₨ 9.5K', color: '#888888' },
            { label: 'System Uptime',         value: '99.9%',  color: '#1E8449' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-divider last:border-0">
              <span className="text-sm text-muted">{item.label}</span>
              <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Demand Heatmap */}
      <div className="content-card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="section-heading mb-0">🔥 Demand Heatmap — Sold Out Routes</h2>
            <p className="text-xs text-muted mt-1">Routes where users are searching but finding no available seats</p>
          </div>
          <span className="badge badge-yellow">Live</span>
        </div>

        <div className="space-y-4">
          {demandRoutes.map((route, idx) => {
            const shortage = route.demand - route.available;
            const pct = Math.round((shortage / route.demand) * 100);
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-black">{route.location}</span>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span>Demand: <strong className="text-black">{route.demand}</strong></span>
                    <span>Available: <strong className="text-black">{route.available}</strong></span>
                    <span className="text-warning font-semibold">–{shortage} seats</span>
                  </div>
                </div>
                <div className="progress-track">
                  <div className="progress-fill-red" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 p-4 bg-warning-light border border-warning/30 rounded-lg">
          <p className="text-sm text-warning">
            <strong>Action required:</strong> Contact bus companies to add more buses on high-demand routes.
            Kigali – Muhanga has the highest shortage (60 seats, 67% unmet demand).
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
