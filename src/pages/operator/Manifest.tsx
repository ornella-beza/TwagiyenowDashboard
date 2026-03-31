import { useState } from 'react';
import { Download, Banknote, Smartphone, Users, FileText } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

interface Passenger {
  id: string;
  name: string;
  seat: string;
  phone: string;
  paymentMethod: 'Cash' | 'MoMo';
  amount: number;
  boardingStatus: 'boarded' | 'pending' | 'no-show';
}

interface TripOption {
  id: string;
  label: string;
  route: string;
  time: string;
  bus: string;
  passengers: Passenger[];
}

const trips: TripOption[] = [
  {
    id: '1',
    label: 'RAC 102B — Nyabugogo → Rubavu (08:00)',
    route: 'Nyabugogo → Rubavu',
    time: '08:00 AM',
    bus: 'RAC 102B',
    passengers: [
      { id: '1', name: 'Amina Uwimana', seat: 'A1', phone: '+250 788 001 001', paymentMethod: 'MoMo', amount: 3500, boardingStatus: 'boarded' },
      { id: '2', name: 'Claude Habimana', seat: 'A2', phone: '+250 788 002 002', paymentMethod: 'Cash', amount: 3500, boardingStatus: 'boarded' },
      { id: '3', name: 'Diane Mukamana', seat: 'B1', phone: '+250 788 003 003', paymentMethod: 'MoMo', amount: 3500, boardingStatus: 'boarded' },
      { id: '4', name: 'Emmanuel Nzeyimana', seat: 'B2', phone: '+250 788 004 004', paymentMethod: 'Cash', amount: 3500, boardingStatus: 'no-show' },
      { id: '5', name: 'Francine Ingabire', seat: 'C1', phone: '+250 788 005 005', paymentMethod: 'MoMo', amount: 3500, boardingStatus: 'boarded' },
    ],
  },
  {
    id: '2',
    label: 'RAC 205A — Nyabugogo → Huye (09:30)',
    route: 'Nyabugogo → Huye',
    time: '09:30 AM',
    bus: 'RAC 205A',
    passengers: [
      { id: '1', name: 'Grace Uwase', seat: 'A1', phone: '+250 788 006 006', paymentMethod: 'Cash', amount: 2500, boardingStatus: 'boarded' },
      { id: '2', name: 'Henri Nkurunziza', seat: 'A2', phone: '+250 788 007 007', paymentMethod: 'MoMo', amount: 2500, boardingStatus: 'boarded' },
      { id: '3', name: 'Isabelle Mukandori', seat: 'A3', phone: '+250 788 008 008', paymentMethod: 'MoMo', amount: 2500, boardingStatus: 'pending' },
    ],
  },
];

const revenueByHour = [
  { hour: '06:00', cash: 12000, momo: 18000 },
  { hour: '07:00', cash: 25000, momo: 32000 },
  { hour: '08:00', cash: 48000, momo: 61000 },
  { hour: '09:00', cash: 35000, momo: 44000 },
  { hour: '10:00', cash: 22000, momo: 29000 },
  { hour: '11:00', cash: 18000, momo: 25000 },
];

const boardingCfg = {
  boarded: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700' },
  'no-show': { bg: 'bg-red-100', text: 'text-red-600' },
};

const Manifest: React.FC = () => {
  const [selectedTripId, setSelectedTripId] = useState(trips[0].id);
  const selectedTrip = trips.find(t => t.id === selectedTripId)!;
  const passengers = selectedTrip.passengers;

  const cashTotal = passengers.filter(p => p.paymentMethod === 'Cash').reduce((s, p) => s + p.amount, 0);
  const momoTotal = passengers.filter(p => p.paymentMethod === 'MoMo').reduce((s, p) => s + p.amount, 0);
  const total = cashTotal + momoTotal;
  const boarded = passengers.filter(p => p.boardingStatus === 'boarded').length;

  const downloadCSV = () => {
    const header = 'Name,Seat,Phone,Payment,Amount,Status\n';
    const rows = passengers.map(p => `${p.name},${p.seat},${p.phone},${p.paymentMethod},${p.amount},${p.boardingStatus}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manifest-trip-${selectedTrip.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Manifest & Sales</h1>
          <p className="text-xs text-gray-400 mt-0.5">Passenger records and revenue tracking per trip</p>
        </div>
      </div>

      {/* Trip Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#1E8449]" />
          <label className="text-sm font-semibold text-gray-700">Select Trip:</label>
        </div>
        <select
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-emerald-200"
          value={selectedTripId}
          onChange={e => setSelectedTripId(e.target.value)}
        >
          {trips.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400">{selectedTrip.route}</p>
            <p className="text-xs font-semibold text-gray-700">{selectedTrip.time} · {selectedTrip.bus}</p>
          </div>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-1.5 bg-[#1E8449] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-green-700 transition shadow-sm"
          >
            <Download size={14} /> Download CSV
          </button>
        </div>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Cash Revenue', value: cashTotal, icon: Banknote, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', sub: `${passengers.filter(p => p.paymentMethod === 'Cash').length} passengers` },
          { label: 'MoMo Revenue', value: momoTotal, icon: Smartphone, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', sub: `${passengers.filter(p => p.paymentMethod === 'MoMo').length} passengers` },
          { label: 'Total Revenue', value: total, icon: Banknote, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', sub: `${passengers.length} total passengers` },
          { label: 'Boarded', value: null, icon: Users, iconBg: 'bg-violet-100', iconColor: 'text-violet-600', sub: `${passengers.length - boarded} pending/no-show`, count: `${boarded}/${passengers.length}` },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.iconBg}`}>
                <Icon size={18} className={card.iconColor} />
              </div>
              <p className="text-xl font-bold text-gray-900">
                {card.count ?? `${card.value!.toLocaleString()} RWF`}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-800">Hourly Revenue Breakdown</h2>
          <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">Today</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={revenueByHour} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
            <Tooltip formatter={(v: number) => `${v.toLocaleString()} RWF`} contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="cash" fill="#1E8449" name="Cash" radius={[4, 4, 0, 0]} />
            <Bar dataKey="momo" fill="#f59e0b" name="MoMo" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Passenger Manifest Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-gray-800">Passenger Manifest</h2>
          <span className="text-xs text-gray-400">{passengers.length} passengers</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">#</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Passenger</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Seat</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Phone</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Payment</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Amount</th>
                <th className="pb-3 font-semibold uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {passengers.map((p, i) => {
                const cfg = boardingCfg[p.boardingStatus];
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 pr-4 text-gray-400 text-xs">{i + 1}</td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                          {p.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-800 text-xs">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg text-xs font-mono font-bold">{p.seat}</span>
                    </td>
                    <td className="py-3.5 pr-4 text-gray-500 text-xs">{p.phone}</td>
                    <td className="py-3.5 pr-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${p.paymentMethod === 'MoMo' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {p.paymentMethod === 'MoMo' ? '📱 MoMo' : '💵 Cash'}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-gray-700 font-semibold text-xs">{p.amount.toLocaleString()} RWF</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${cfg.bg} ${cfg.text}`}>
                        {p.boardingStatus.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200">
                <td colSpan={5} className="pt-3 text-xs font-bold text-gray-700">Total</td>
                <td className="pt-3 text-sm font-bold text-[#1E8449]">{total.toLocaleString()} RWF</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Manifest;
