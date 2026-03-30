import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';

interface BusData {
  region: string;
  active: number;
  inactive: number;
  utilization: number;
}

interface SystemHealth {
  time: string;
  uptime: number;
  latency: number;
}

const PlatformHealth: React.FC = () => {
  const busData: BusData[] = [
    { region: 'Kigali', active: 245, inactive: 12, utilization: 95 },
    { region: 'Muhanga', active: 89, inactive: 5, utilization: 92 },
    { region: 'Musanze', active: 67, inactive: 8, utilization: 88 },
    { region: 'Gitarama', active: 123, inactive: 10, utilization: 91 },
    { region: 'Butare', active: 98, inactive: 7, utilization: 93 },
    { region: 'Gisenyi', active: 76, inactive: 6, utilization: 89 },
  ];

  const systemHealth: SystemHealth[] = [
    { time: '00:00', uptime: 99.9, latency: 45 },
    { time: '04:00', uptime: 99.8, latency: 52 },
    { time: '08:00', uptime: 99.95, latency: 38 },
    { time: '12:00', uptime: 99.7, latency: 68 },
    { time: '16:00', uptime: 99.85, latency: 55 },
    { time: '20:00', uptime: 99.9, latency: 42 },
  ];

  const totalActiveBuses = busData.reduce((sum, r) => sum + r.active, 0);
  const totalInactiveBuses = busData.reduce((sum, r) => sum + r.inactive, 0);
  const avgUtilization = (busData.reduce((sum, r) => sum + r.utilization, 0) / busData.length).toFixed(1);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Platform Health Monitor</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Buses</p>
              <p className="text-3xl font-bold text-green-600">{totalActiveBuses}</p>
            </div>
            <CheckCircle size={40} className="text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Inactive Buses</p>
              <p className="text-3xl font-bold text-red-600">{totalInactiveBuses}</p>
            </div>
            <AlertTriangle size={40} className="text-red-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Utilization</p>
              <p className="text-3xl font-bold text-primary">{avgUtilization}%</p>
            </div>
            <Activity size={40} className="text-primary opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">System Uptime</p>
              <p className="text-3xl font-bold text-blue-600">99.9%</p>
            </div>
            <MapPin size={40} className="text-blue-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Buses by Region */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Active Buses by Region</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={busData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="active" fill="#1E8449" name="Active" />
            <Bar dataKey="inactive" fill="#FF6B6B" name="Inactive" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">System Health (24h)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={systemHealth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="uptime" stroke="#1E8449" strokeWidth={2} name="Uptime %" />
            <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#FFC107" strokeWidth={2} name="Latency (ms)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Regional Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Regional Status</h2>
        <div className="space-y-4">
          {busData.map((region, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800">{region.region}</span>
                <span className="text-sm font-bold text-primary">Utilization: {region.utilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all"
                  style={{ width: `${region.utilization}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>Active: {region.active}</span>
                <span>Inactive: {region.inactive}</span>
                <span>Total: {region.active + region.inactive}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformHealth;
