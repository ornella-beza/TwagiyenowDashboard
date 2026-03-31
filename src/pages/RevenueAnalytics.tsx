import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { DollarSign, TrendingUp, Ticket } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', revenue: 1200000, commission: 60000 },
  { month: 'Feb', revenue: 1400000, commission: 70000 },
  { month: 'Mar', revenue: 1600000, commission: 80000 },
  { month: 'Apr', revenue: 1800000, commission: 90000 },
  { month: 'May', revenue: 2000000, commission: 100000 },
  { month: 'Jun', revenue: 2200000, commission: 110000 },
];

const companyRevenue = [
  { name: 'RITCO',         value: 450000, pct: 35 },
  { name: 'Horizon',       value: 380000, pct: 30 },
  { name: 'Kigali Express',value: 280000, pct: 22 },
  { name: 'Others',        value: 90000,  pct: 13 },
];

const COLORS = ['#1E8449', '#F5A623', '#E67E22', '#888888'];

const fmt = (v: number) => `₨ ${(v / 1000).toFixed(0)}k`;

const RevenueAnalytics: React.FC = () => (
  <div className="page-container">

    {/* KPIs */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
      {[
        { label: 'Total Platform Revenue',      value: '₨ 8.2M',  sub: '↑ 12% from last month', icon: DollarSign, color: '#1E8449', bg: '#E8F5E9' },
        { label: 'Total Commission (₨50/ticket)',value: '₨ 410K', sub: '↑ 8% from last month',   icon: TrendingUp, color: '#E67E22', bg: '#FEF3E2' },
        { label: 'Tickets Sold (This Month)',    value: '8,200',   sub: 'Avg: 273 tickets/day',   icon: Ticket,     color: '#F5A623', bg: '#FFF8E1' },
      ].map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                <Icon size={20} style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-xs text-muted font-medium uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold text-black mt-1">{s.value}</p>
            <p className="text-xs text-primary mt-1 font-medium">{s.sub}</p>
          </div>
        );
      })}
    </div>

    {/* Monthly Trend */}
    <div className="content-card mb-6">
      <h2 className="section-heading">Monthly Revenue Trend</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#888888' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#888888' }} axisLine={false} tickLine={false} tickFormatter={fmt} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #F5F5F5', fontSize: 13 }} formatter={(v: number) => [`₨ ${v.toLocaleString()}`, '']} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="revenue"    stroke="#1E8449" strokeWidth={2.5} dot={false} name="Total Revenue" />
          <Line type="monotone" dataKey="commission" stroke="#F5A623" strokeWidth={2.5} dot={false} name="Commission" />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Charts Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Pie Chart */}
      <div className="content-card">
        <h2 className="section-heading">Revenue by Company</h2>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={companyRevenue}
              cx="50%" cy="50%"
              outerRadius={90}
              dataKey="value"
              label={({ name, pct }) => `${name} ${pct}%`}
              labelLine={false}
            >
              {companyRevenue.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => [`₨ ${v.toLocaleString()}`, '']} contentStyle={{ borderRadius: '8px', border: '1px solid #F5F5F5', fontSize: 13 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Commission Breakdown */}
      <div className="content-card">
        <h2 className="section-heading">Commission Breakdown</h2>
        <div className="space-y-3">
          {[
            { label: 'Commission per Ticket',      value: '₨ 50',      type: ''        },
            { label: 'Total Tickets (This Month)', value: '8,200',      type: ''        },
            { label: 'Total Commission',           value: '₨ 410,000', type: 'primary' },
            { label: 'Platform Operating Costs',   value: '₨ 150,000', type: 'warning' },
            { label: 'Net Profit',                 value: '₨ 260,000', type: 'success' },
          ].map((row, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm ${
                row.type === 'primary' ? 'bg-primary text-white'                          :
                row.type === 'success' ? 'bg-primary-light border border-primary/20'     :
                row.type === 'warning' ? 'bg-warning-light'                              :
                'bg-divider'
              }`}
            >
              <span className={`font-medium ${row.type === 'primary' ? 'text-white' : 'text-black'}`}>{row.label}</span>
              <span className={`font-bold ${
                row.type === 'primary' ? 'text-white'   :
                row.type === 'warning' ? 'text-warning' :
                row.type === 'success' ? 'text-primary' :
                'text-black'
              }`}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default RevenueAnalytics;
