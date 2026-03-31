import React, { useEffect, useState } from 'react';
import { Ticket } from 'lucide-react';
import api from '../api';

const statusBadge: Record<string, string> = {
  confirmed: 'badge-green',
  pending:   'badge-yellow',
  cancelled: 'badge-red',
};

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/bookings')
      .then(res => setBookings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container flex items-center justify-center h-64"><p className="text-muted">Loading...</p></div>;

  const total    = bookings.reduce((s, b) => s + parseFloat(b.price || 0), 0);
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const cancelled = bookings.filter(b => b.status === 'cancelled').length;

  return (
    <div className="page-container">

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Bookings', value: bookings.length,                    color: '#1E8449' },
          { label: 'Total Revenue',  value: `${total.toLocaleString()} RWF`,    color: '#F5A623' },
          { label: 'Confirmed',      value: confirmed,                           color: '#1E8449' },
          { label: 'Cancelled',      value: cancelled,                           color: '#E67E22' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <p className="text-xs text-muted font-medium uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th-cell"><div className="flex items-center gap-1.5"><Ticket size={13} />ID</div></th>
              <th className="th-cell">Passenger</th>
              <th className="th-cell">Route</th>
              <th className="th-cell">Departure</th>
              <th className="th-cell">Seat</th>
              <th className="th-cell">Price</th>
              <th className="th-cell">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b: any) => (
              <tr key={b.id} className="tr-row">
                <td className="td-cell font-mono text-xs text-muted">{b.id.slice(0, 8)}...</td>
                <td className="td-cell font-semibold text-black">{b.user_name}</td>
                <td className="td-cell text-black">{b.from_city} → {b.to_city}</td>
                <td className="td-cell text-muted">{new Date(b.departure_time).toLocaleString()}</td>
                <td className="td-cell">{b.seat_number}</td>
                <td className="td-cell font-semibold text-primary">{parseFloat(b.price).toLocaleString()} RWF</td>
                <td className="td-cell">
                  <span className={statusBadge[b.status] || 'badge-gray'}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan={7} className="td-cell text-center text-muted py-8">No bookings yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
