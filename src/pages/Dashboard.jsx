import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, MapPin, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const revenueData = [
    { date: 'Mon', revenue: 45000, commission: 2250 },
    { date: 'Tue', revenue: 52000, commission: 2600 },
    { date: 'Wed', revenue: 48000, commission: 2400 },
    { date: 'Thu', revenue: 61000, commission: 3050 },
    { date: 'Fri', revenue: 55000, commission: 2750 },
    { date: 'Sat', revenue: 67000, commission: 3350 },
    { date: 'Sun', revenue: 72000, commission: 3600 },
  ];

  const demandHeatmap = [
    { location: 'Kigali-Musanze', demand: 85, available: 45 },
    { location: 'Kigali-Gitarama', demand: 72, available: 60 },
    { location: 'Kigali-Muhanga', demand: 90, available: 30 },
    { location: 'Kigali-Ruhengeri', demand: 65, available: 50 },
    { location: 'Kigali-Butare', demand: 78, available: 40 },
  ];

  const stats = [
    { label: 'Total Revenue (Today)', value: '₨ 45.2M', icon: TrendingUp, color: 'bg-green-100' },
    { label: 'Active Buses', value: '1,234', icon: MapPin, color: 'bg-blue-100' },
    { label: 'Total Users', value: '52.3K', icon: Users, color: 'bg-purple-100' },
    { label: 'Pending Disputes', value: '23', icon: AlertTriangle, color: 'bg-red-100' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Super Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg shadow p-6">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="text-primary" size={24} />
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Revenue & Commission</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#1E8449" name="Total Revenue" />
            <Bar dataKey="commission" fill="#FFC107" name="Platform Commission" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Demand Heatmap */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🔥 Demand Heatmap - Sold Out Routes</h2>
        <p className="text-gray-600 text-sm mb-4">Routes where users are searching but finding no available seats</p>
        
        <div className="space-y-4">
          {demandHeatmap.map((route, idx) => {
            const shortage = route.demand - route.available;
            const percentage = (shortage / route.demand) * 100;
            return (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">{route.location}</span>
                  <span className="text-sm text-red-600 font-bold">Shortage: {shortage} seats</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-500 h-3 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>Demand: {route.demand}</span>
                  <span>Available: {route.available}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Action:</strong> Contact bus companies to add more buses on high-demand routes. 
            Kigali-Muhanga has the highest shortage (60 seats).
          </p>
        </div>
      </div>
    </div>
  );
}
