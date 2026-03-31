import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';

type SeatStatus = 'available' | 'booked' | 'blocked';

interface Seat {
  id: string;
  status: SeatStatus;
  passenger?: string;
}

const trips = [
  { id: '1', label: 'RAC 102B — Nyabugogo → Rubavu (08:00 AM)', gate: 'Gate 3' },
  { id: '2', label: 'RAC 205A — Nyabugogo → Huye (09:30 AM)', gate: 'Gate 1' },
  { id: '3', label: 'RAC 310C — Nyabugogo → Musanze (11:00 AM)', gate: 'Gate 5' },
];

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const COLS = [1, 2, 3, 4];

const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  ROWS.forEach(row => {
    COLS.forEach(col => {
      const id = `${row}${col}`;
      const rand = Math.random();
      seats.push({
        id,
        status: rand < 0.38 ? 'booked' : rand < 0.48 ? 'blocked' : 'available',
        passenger: rand < 0.38 ? 'Passenger' : undefined,
      });
    });
  });
  return seats;
};

const SeatInventory: React.FC = () => {
  const [selectedTripId, setSelectedTripId] = useState(trips[0].id);
  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [selected, setSelected] = useState<string[]>([]);

  const selectedTrip = trips.find(t => t.id === selectedTripId)!;

  const handleTripChange = (id: string) => {
    setSelectedTripId(id);
    setSeats(generateSeats());
    setSelected([]);
  };

  const toggleSelect = (seat: Seat) => {
    if (seat.status === 'booked') return;
    setSelected(prev =>
      prev.includes(seat.id) ? prev.filter(s => s !== seat.id) : [...prev, seat.id]
    );
  };

  const blockSelected = () => {
    setSeats(seats.map(s => selected.includes(s.id) ? { ...s, status: 'blocked' } : s));
    setSelected([]);
  };

  const unblockSelected = () => {
    setSeats(seats.map(s => selected.includes(s.id) ? { ...s, status: 'available' } : s));
    setSelected([]);
  };

  const available = seats.filter(s => s.status === 'available').length;
  const booked = seats.filter(s => s.status === 'booked').length;
  const blocked = seats.filter(s => s.status === 'blocked').length;
  const total = seats.length;
  const fillPct = Math.round(((booked + blocked) / total) * 100);

  const getSeatStyle = (seat: Seat) => {
    const isSelected = selected.includes(seat.id);
    if (isSelected) return 'bg-blue-500 border-blue-600 text-white shadow-md scale-105';
    if (seat.status === 'booked') return 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed';
    if (seat.status === 'blocked') return 'bg-red-100 border-red-300 text-red-600 cursor-pointer hover:bg-red-200';
    return 'bg-emerald-50 border-emerald-300 text-emerald-700 cursor-pointer hover:bg-emerald-100 hover:shadow-sm';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Seat Inventory</h1>
          <p className="text-xs text-gray-400 mt-0.5">Block or unblock seats for counter-top sales</p>
        </div>
      </div>

      {/* Trip Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-wrap items-center gap-4">
        <label className="text-sm font-semibold text-gray-700">Select Trip:</label>
        <select
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-emerald-200"
          value={selectedTripId}
          onChange={e => handleTripChange(e.target.value)}
        >
          {trips.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
        {selected.length > 0 && (
          <div className="flex gap-2 ml-auto">
            <button
              onClick={blockSelected}
              className="flex items-center gap-1.5 bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-600 transition shadow-sm"
            >
              <Lock size={13} /> Block {selected.length} seat{selected.length > 1 ? 's' : ''}
            </button>
            <button
              onClick={unblockSelected}
              className="flex items-center gap-1.5 bg-[#1E8449] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-green-700 transition shadow-sm"
            >
              <Unlock size={13} /> Unblock
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Available', value: available, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
          { label: 'Booked', value: booked, bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' },
          { label: 'Fill Rate', value: `${fillPct}%`, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border ${s.border} shadow-sm`}>
            <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
            <p className="text-xs text-gray-600 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SeatInventory;
