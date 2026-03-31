import React from 'react';
import { Eye, Download, Ticket } from 'lucide-react';

interface Booking {
  id: number;
  passenger: string;
  busName: string;
  route: string;
  date: string;
  amount: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  qrCode: string;
}

const bookings: Booking[] = [
  { id: 1, passenger: 'John Doe',   busName: 'RITCO Bus 1',    route: 'Kigali – Musanze', date: '2024-03-30', amount: 15000, paymentStatus: 'paid',    qrCode: 'QR-001-ABC' },
  { id: 2, passenger: 'Jane Smith', busName: 'Horizon Bus 2',  route: 'Kigali – Muhanga', date: '2024-03-30', amount: 8000,  paymentStatus: 'paid',    qrCode: 'QR-002-XYZ' },
  { id: 3, passenger: 'Bob Wilson', busName: 'Kigali Express', route: 'Kigali – Gitarama',date: '2024-03-31', amount: 5000,  paymentStatus: 'pending', qrCode: 'QR-003-DEF' },
  { id: 4, passenger: 'Alice M.',   busName: 'Rwanda Star',    route: 'Kigali – Butare',  date: '2024-03-31', amount: 20000, paymentStatus: 'failed',  qrCode: 'QR-004-GHI' },
];

const statusBadge: Record<string, string> = {
  paid:    'badge-green',
  pending: 'badge-yellow',
  failed:  'badge-red',
};

export default function BookingsManagement() {
  const total   = bookings.reduce((s, b) => s + b.amount, 0);
  const paid    = bookings.filter((b) => b.paymentStatus === 'paid').length;
  const pending = bookings.filter((b) => b.paymentStatus === 'pending').length;
  const failed  = bookings.filter((b) => b.paymentStatus === 'failed').length;

  return (
    <div className="page-container">

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Bookings',    value: bookings.length,                color: '#1E8449' },
          { label: 'Total Revenue',     value: `₨ ${total.toLocaleString()}`, color: '#F5A623' },
          { label: 'Paid',              value: paid,                           color: '#1E8449' },
          { label: 'Pending / Failed',  value: `${pending} / ${failed}`,       color: '#E67E22' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <p className="text-xs text-muted font-medium uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="table-container mb-6">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th-cell">
                <div className="flex items-center gap-1.5"><Ticket size={13} />ID</div>
              </th>
              <th className="th-cell">Passenger</th>
              <th className="th-cell">Bus</th>
              <th className="th-cell">Route</th>
              <th className="th-cell">Date</th>
              <th className="th-cell">Amount</th>
              <th className="th-cell">Payment</th>
              <th className="th-cell">QR Code</th>
              <th className="th-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="tr-row">
                <td className="td-cell font-mono text-xs text-muted">#{b.id}</td>
                <td className="td-cell font-semibold text-black">{b.passenger}</td>
                <td className="td-cell text-black">{b.busName}</td>
                <td className="td-cell text-black">{b.route}</td>
                <td className="td-cell text-muted">{b.date}</td>
                <td className="td-cell font-semibold text-primary">₨ {b.amount.toLocaleString()}</td>
                <td className="td-cell">
                  <span className={statusBadge[b.paymentStatus]}>
                    {b.paymentStatus.charAt(0).toUpperCase() + b.paymentStatus.slice(1)}
                  </span>
                </td>
                <td className="td-cell font-mono text-xs text-muted">{b.qrCode}</td>
                <td className="td-cell">
                  <div className="flex gap-1">
                    <button className="icon-btn-blue" title="View Details"><Eye size={16} /></button>
                    <button className="icon-btn text-primary hover:bg-primary-light" title="Download QR"><Download size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info */}
      <div className="p-4 bg-primary-light border border-primary/20 rounded-lg">
        <p className="text-sm text-primary">
          <strong>Read-only view.</strong> Bookings are managed automatically by the system.
          You can view payment statuses and download QR codes for passengers.
        </p>
      </div>
    </div>
  );
}
