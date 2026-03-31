import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from 'recharts';
import { TrendingUp, Zap, Brain, ArrowRight, Bus } from 'lucide-react';

interface ForecastData {
  time: string;
  historical: number;
  predicted: number;
  capacity: number;
}

interface RouteOption {
  id: string;
  label: string;
  route: string;
  time: string;
  bus: string;
  forecast: ForecastData[];
  willSellOut: boolean;
  confidence: number;
  recommendation: string;
  riskLevel: 'high' | 'medium' | 'low';
}

const routes: RouteOption[] = [
  {
    id: '1',
    label: 'Nyabugogo → Huye (04:00 PM)',
    route: 'Nyabugogo → Huye',
    time: '04:00 PM',
    bus: 'RAC 205A',
    willSellOut: true,
    confidence: 91,
    riskLevel: 'high',
    recommendation: 'High demand expected based on Friday patterns. Prepare backup bus RAC 310C by 3:30 PM.',
    forecast: [
      { time: '12:00', historical: 12, predicted: 14, capacity: 49 },
      { time: '01:00', historical: 20, predicted: 22, capacity: 49 },
      { time: '02:00', historical: 31, predicted: 35, capacity: 49 },
      { time: '03:00', historical: 40, predicted: 44, capacity: 49 },
      { time: '04:00', historical: 47, predicted: 49, capacity: 49 },
    ],
  },
  {
    id: '2',
    label: 'Nyabugogo → Rubavu (06:00 AM)',
    route: 'Nyabugogo → Rubavu',
    time: '06:00 AM',
    bus: 'RAC 102B',
    willSellOut: false,
    confidence: 78,
    riskLevel: 'low',
    recommendation: 'Normal demand. No backup bus needed. Expected 65% fill rate.',
    forecast: [
      { time: '03:00', historical: 5, predicted: 6, capacity: 49 },
      { time: '04:00', historical: 12, predicted: 13, capacity: 49 },
      { time: '05:00', historical: 22, predicted: 24, capacity: 49 },
      { time: '06:00', historical: 30, predicted: 32, capacity: 49 },
    ],
  },
  {
    id: '3',
    label: 'Nyabugogo → Musanze (08:00 AM)',
    route: 'Nyabugogo → Musanze',
    time: '08:00 AM',
    bus: 'RAC 310C',
    willSellOut: true,
    confidence: 85,
    riskLevel: 'medium',
    recommendation: 'Friday surge detected. Consider adding an extra bus or adjusting pricing.',
    forecast: [
      { time: '05:00', historical: 8, predicted: 10, capacity: 49 },
      { time: '06:00', historical: 18, predicted: 22, capacity: 49 },
      { time: '07:00', historical: 35, predicted: 42, capacity: 49 },
      { time: '08:00', historical: 45, predicted: 49, capacity: 49 },
    ],
  },
];

const weeklyData = [
  { day: 'Mon', sold: 38, capacity: 49 },
  { day: 'Tue', sold: 42, capacity: 49 },
  { day: 'Wed', sold: 35, capacity: 49 },
  { day: 'Thu', sold: 44, capacity: 49 },
  { day: 'Fri', sold: 49, capacity: 49 },
  { day: 'Sat', sold: 49, capacity: 49 },
  { day: 'Sun', sold: 46, capacity: 49 },
];

const demandHeatmap = [
  { route: '→ Huye', mon: 82, tue: 78, wed: 65, thu: 88, fri: 98, sat: 95, sun: 90 },
  { route: '→ Rubavu', mon: 60, tue: 55, wed: 70, thu: 65, fri: 72, sat: 88, sun: 80 },
  { route: '→ Musanze', mon: 75, tue: 80, wed: 68, thu: 85, fri: 95, sat: 92, sun: 78 },
  { route: '→ Rwamagana', mon: 50, tue: 48, wed: 55, thu: 60, fri: 70, sat: 65, sun: 58 },
];

const heatColor = (val: number) => {
  if (val >= 90) return 'bg-emerald-600 text-white';
  if (val >= 75) return 'bg-emerald-400 text-white';
  if (val >= 60) return 'bg-amber-300 text-gray-800';
  return 'bg-emerald-100 text-emerald-800';
};

const riskCfg = {
  high: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', icon: 'text-red-500' },
  medium: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-500' },
  low: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', icon: 'text-emerald-500' },
};

const InventoryForecast: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0].id);
  const selectedRoute = routes.find(r => r.id === selectedRouteId)!;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Brain size={20} className="text-yellow-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Inventory Forecast</h1>
            <p className="text-xs text-gray-400 mt-0.5">Predicts seat sell-out probability from historical booking patterns</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
          <Zap size={14} className="text-yellow-500" />
          <span className="text-xs font-bold text-yellow-700">AI Engine Active</span>
        </div>
      </div>

      {/* Route Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-wrap items-center gap-4">
        <label className="text-sm font-semibold text-gray-700">Forecast Trip:</label>
        <select
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-emerald-200"
          value={selectedRouteId}
          onChange={e => setSelectedRouteId(e.target.value)}
        >
          {routes.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
          <Bus size={13} className="text-gray-400" />
          <span className="font-semibold text-gray-700">{selectedRoute.bus}</span>
          <span className="text-gray-300">·</span>
          <span>{selectedRoute.time}</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Booking Velocity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-[#1E8449]" />
            <div>
              <h2 className="text-sm font-bold text-gray-800">Booking Velocity Forecast</h2>
              <p className="text-xs text-gray-400">Historical avg vs AI prediction</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={selectedRoute.forecast} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E8449" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1E8449" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 55]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine y={49} stroke="#ef4444" strokeDasharray="5 3" label={{ value: 'Capacity (49)', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
              <Area type="monotone" dataKey="predicted" stroke="#1E8449" strokeWidth={2.5} fill="url(#predGrad)" name="AI Prediction" strokeDasharray="5 3" />
              <Line type="monotone" dataKey="historical" stroke="#9ca3af" strokeWidth={2} dot={false} name="Historical Avg" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Pattern */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Brain size={16} className="text-violet-500" />
            <div>
              <h2 className="text-sm font-bold text-gray-800">Weekly Booking Pattern</h2>
              <p className="text-xs text-gray-400">Last 7 days — seats sold vs capacity</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 55]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine y={49} stroke="#ef4444" strokeDasharray="5 3" />
              <Bar dataKey="sold" fill="#1E8449" name="Seats Sold" radius={[5, 5, 0, 0]} />
              <Bar dataKey="capacity" fill="#f3f4f6" name="Capacity" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demand Heatmap */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Zap size={16} className="text-yellow-500" />
          <div>
            <h2 className="text-sm font-bold text-gray-800">Demand Heatmap — Fill Rate % by Route & Day</h2>
            <p className="text-xs text-gray-400">Higher % = more demand. Red = very high demand.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 font-semibold uppercase tracking-wide">
                <th className="pb-3 pr-4 text-left">Route</th>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <th key={d} className="pb-3 px-2 text-center">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="space-y-1">
              {demandHeatmap.map(row => (
                <tr key={row.route}>
                  <td className="py-1.5 pr-4 font-semibold text-gray-700 whitespace-nowrap">{row.route}</td>
                  {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map(day => (
                    <td key={day} className="py-1.5 px-2 text-center">
                      <span className={`inline-block w-12 py-1 rounded-lg font-bold text-xs ${heatColor((row as any)[day])}`}>
                        {(row as any)[day]}%
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-medium">Legend:</span>
          {[
            { label: '≥90% — Very High demand', cls: 'bg-emerald-600 text-white' },
            { label: '75–89% — High demand', cls: 'bg-emerald-400 text-white' },
            { label: '60–74% — Moderate', cls: 'bg-amber-300 text-gray-800' },
            { label: '<60% — Normal', cls: 'bg-emerald-100 text-emerald-800' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${l.cls}`} />
              <span className="text-xs text-gray-500">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* All Routes Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 mb-5">All Routes — Sell-Out Risk Summary</h2>
        <div className="space-y-3">
          {routes.map(route => {
            const rcfg = riskCfg[route.riskLevel];
            return (
              <div
                key={route.id}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer hover:shadow-sm transition ${selectedRouteId === route.id ? `${rcfg.bg} ${rcfg.border}` : 'border-gray-100 hover:border-gray-200'}`}
                onClick={() => setSelectedRouteId(route.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900 text-sm">{route.label}</p>
                    <span className="text-xs text-gray-400">{route.bus}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{route.recommendation}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Confidence</p>
                    <p className="font-bold text-gray-800 text-sm">{route.confidence}%</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${route.willSellOut ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {route.willSellOut ? '⚠️ SELL OUT' : '✅ NORMAL'}
                  </span>
                  <ArrowRight size={14} className="text-gray-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InventoryForecast;
