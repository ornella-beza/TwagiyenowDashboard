import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp } from 'lucide-react';

interface MonthlyData {
  month: string;
  revenue: number;
  commission: number;
}

interface CompanyRevenue {
  name: string;
  value: number;
  percentage: number;
}

const RevenueAnalytics: React.FC = () => {
  const monthlyData: MonthlyData[] = [
    { month: 'Jan', revenue: 1200000, commission: 60000 },
    { month: 'Feb', revenue: 1400000, commission: 70000 },
    { month: 'Mar', revenue: 1600000, commission: 80000 },
    { month: 'Apr', revenue: 1800000, commission: 90000 },
    { month: 'May', revenue: 2000000, commission: 100000 },
    { month: 'Jun', revenue: 2200000, commission: 110000 },
  ];

  const companyRevenue: CompanyRevenue[] = [
    { name: 'RITCO', value: 450000, percentage: 35 },
    { name: 'Horizon', value: 380000, percentage: 30 },
    { name: 'Kigali Express', value: 280000, percentage: 22 },
    { name: 'Others', value: 90000, percentage: 13 },
  ];

  const COLORS = ['#1E8449', '#FFC107', '#FF6B6B', '#4ECDC4'];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Revenue Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Platform Revenue</p>
              <p className="text-3xl font-bold text-primary">₨ 8.2M</p>
              <p className="text-green-600 text-sm mt-2">↑ 12% from last month</p>
            </div>
            <DollarSign size={40} className="text-primary opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Commission (50 RWF/ticket)</p>
              <p className="text-3xl font-bold text-accent">₨ 410K</p>
              <p className="text-green-600 text-sm mt-2">↑ 8% from last month</p>
            </div>
            <TrendingUp size={40} className="text-accent opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div>
            <p className="text-gray-600 text-sm">Tickets Sold (This Month)</p>
            <p className="text-3xl font-bold text-blue-600">8,200</p>
            <p className="text-gray-600 text-sm mt-2">Avg: 273 tickets/day</p>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Revenue Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `₨ ${value.toLocaleString()}`} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#1E8449" strokeWidth={2} name="Total Revenue" />
            <Line type="monotone" dataKey="commission" stroke="#FFC107" strokeWidth={2} name="Commission" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue by Company */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Revenue by Company</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={companyRevenue}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {companyRevenue.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `₨ ${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Commission Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Commission Breakdown</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
              <span className="font-semibold">Commission per Ticket</span>
              <span className="text-primary font-bold">₨ 50</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
              <span className="font-semibold">Total Tickets (This Month)</span>
              <span className="text-primary font-bold">8,200</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-primary text-white rounded">
              <span className="font-semibold">Total Commission</span>
              <span className="font-bold">₨ 410,000</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
              <span className="font-semibold">Platform Operating Costs</span>
              <span className="text-red-600 font-bold">₨ 150,000</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-green-50 rounded border-2 border-green-200">
              <span className="font-semibold">Net Profit</span>
              <span className="text-green-600 font-bold">₨ 260,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
