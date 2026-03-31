import { useState } from 'react';
import { Plus, Calendar, DoorOpen, Trash2, Clock, MapPin } from 'lucide-react';

interface Trip {
  id: string;
  bus: string;
  driver: string;
  from: string;
  to: string;
  departureTime: string;
  gate: string;
  date: string;
  status: 'scheduled' | 'departed' | 'completed';
  seats: number;
  capacity: number;
}

const initialTrips: Trip[] = [
  { id: '1', bus: 'RAC 102B', driver: 'Jean Bosco', from: 'Nyabugogo', to: 'Rubavu', departureTime: '08:00', gate: 'Gate 3', date: '2025-07-10', status: 'departed', seats: 44, capacity: 49 },
  { id: '2', bus: 'RAC 205A', driver: 'Eric Mugisha', from: 'Nyabugogo', to: 'Huye', departureTime: '09:30', gate: 'Gate 1', date: '2025-07-10', status: 'departed', seats: 38, capacity: 49 },
  { id: '3', bus: 'RAC 310C', driver: 'Alice Uwase', from: 'Nyabugogo', to: 'Musanze', departureTime: '11:00', gate: 'Gate 5', date: '2025-07-10', status: 'scheduled', seats: 22, capacity: 49 },
  { id: '4', bus: 'RAC 418D', driver: 'Patrick Nkusi', from: 'Nyabugogo', to: 'Rwamagana', departureTime: '13:00', gate: 'Gate 2', date: '2025-07-10', status: 'scheduled', seats: 8, capacity: 49 },
  { id: '5', bus: 'RAC 102B', driver: 'Jean Bosco', from: 'Nyabugogo', to: 'Huye', departureTime: '16:00', gate: 'Gate 4', date: '2025-07-10', status: 'scheduled', seats: 3, capacity: 49 },
];

const buses = ['RAC 102B', 'RAC 205A', 'RAC 310C', 'RAC 418D'];
const drivers = ['Jean Bosco', 'Eric Mugisha', 'Alice Uwase', 'Patrick Nkusi'];
const destinations = ['Rubavu', 'Huye', 'Musanze', 'Rwamagana', 'Muhanga', 'Gitarama', 'Butare'];
const gates = ['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Gate 5', 'Gate 6'];

const emptyForm = { bus: buses[0], driver: drivers[0], from: 'Nyabugogo', to: destinations[0], departureTime: '', gate: gates[0], date: '', seats: 0, capacity: 49 };

const statusCfg = {
  scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  departed: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-400' },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

const Scheduling: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const saveTrip = () => {
    if (!form.departureTime || !form.date) return;
    setTrips([...trips, { ...form, id: Date.now().toString(), status: 'scheduled' }]);
    setForm(emptyForm);
    setShowForm(false);
  };

  const deleteTrip = (id: string) => setTrips(trips.filter(t => t.id !== id));

  const scheduled = trips.filter(t => t.status === 'scheduled').length;
  const departed = trips.filter(t => t.status === 'departed').length;
  const completed = trips.filter(t => t.status === 'completed').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Smart Scheduling</h1>
          <p className="text-xs text-gray-400 mt-0.5">Create and manage trip schedules with gate assignments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-[#1E8449] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-green-700 transition shadow-sm"
        >
          <Plus size={14} /> Create Trip
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Scheduled', value: scheduled, bg: 'bg-blue-50', text: 'text-blue-700' },
          { label: 'Departed', value: departed, bg: 'bg-amber-50', text: 'text-amber-700' },
          { label: 'Completed', value: completed, bg: 'bg-emerald-50', text: 'text-emerald-700' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-white shadow-sm`}>
            <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
            <p className="text-xs text-gray-600 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Create Trip Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <Calendar size={16} className="text-[#1E8449]" /> New Trip
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Bus', type: 'select', key: 'bus', options: buses },
              { label: 'Driver', type: 'select', key: 'driver', options: drivers },
              { label: 'Gate Number', type: 'select', key: 'gate', options: gates },
              { label: 'Destination', type: 'select', key: 'to', options: destinations },
              { label: 'Departure Time', type: 'time', key: 'departureTime' },
              { label: 'Date', type: 'date', key: 'date' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs text-gray-500 mb-1 block font-medium">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    value={(form as any)[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  >
                    {field.options!.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    value={(form as any)[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={saveTrip} className="bg-[#1E8449] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition">
              Save Trip
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-600 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Timeline View */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
          <Clock size={16} className="text-[#1E8449]" /> Today's Schedule Timeline
        </h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[72px] top-0 bottom-0 w-px bg-gray-100" />
          <div className="space-y-3">
            {trips.map((trip, i) => {
              const cfg = statusCfg[trip.status];
              const fillPct = Math.round((trip.seats / trip.capacity) * 100);
              return (
                <div key={trip.id} className="flex items-start gap-4 group">
                  {/* Time */}
                  <div className="w-16 text-right shrink-0 pt-2">
                    <p className="text-xs font-bold text-gray-700">{trip.departureTime}</p>
                  </div>
                  {/* Dot */}
                  <div className="relative z-10 mt-2.5 shrink-0">
                    <div className={`w-3 h-3 rounded-full border-2 border-white shadow ${cfg.dot}`} />
                  </div>
                  {/* Card */}
                  <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-lg font-mono">{trip.bus}</span>
                          <span className="flex items-center gap-1 text-xs text-gray-600">
                            <MapPin size={11} className="text-gray-400" />
                            {trip.from} → {trip.to}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-lg">
                            <DoorOpen size={11} /> {trip.gate}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">{trip.driver}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 max-w-[120px] bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${fillPct > 90 ? 'bg-red-500' : fillPct > 70 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{trip.seats}/{trip.capacity} seats</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                        </span>
                        <button onClick={() => deleteTrip(trip.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 mb-5">All Trips — Table View</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Bus</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Driver</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Route</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Departure</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Gate</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Fill Rate</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Status</th>
                <th className="pb-3 font-semibold uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {trips.map(trip => {
                const cfg = statusCfg[trip.status];
                const fillPct = Math.round((trip.seats / trip.capacity) * 100);
                return (
                  <tr key={trip.id} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 pr-4">
                      <span className="font-bold text-gray-900 text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{trip.bus}</span>
                    </td>
                    <td className="py-3.5 pr-4 text-gray-600 text-xs">{trip.driver}</td>
                    <td className="py-3.5 pr-4 text-gray-500 text-xs">{trip.from} → {trip.to}</td>
                    <td className="py-3.5 pr-4 text-gray-700 font-semibold text-xs">{trip.departureTime}</td>
                    <td className="py-3.5 pr-4">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg text-xs font-semibold">{trip.gate}</span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${fillPct > 90 ? 'bg-red-500' : fillPct > 70 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{fillPct}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <button onClick={() => deleteTrip(trip.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
