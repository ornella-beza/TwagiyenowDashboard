import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, RotateCcw } from 'lucide-react';

interface Dispute {
  id: number;
  passenger: string;
  company: string;
  route: string;
  issue: string;
  amount: number;
  status: 'pending' | 'resolved' | 'rejected';
  date: string;
}

const initialDisputes: Dispute[] = [
  { id: 1, passenger: 'John Doe',   company: 'RITCO',         route: 'Kigali–Musanze', issue: 'Bus cancelled without notice', amount: 15000, status: 'pending',  date: '2024-01-20' },
  { id: 2, passenger: 'Jane Smith', company: 'Horizon',       route: 'Kigali–Muhanga', issue: 'Overcharged for ticket',        amount: 5000,  status: 'resolved', date: '2024-01-19' },
  { id: 3, passenger: 'Bob Wilson', company: 'Kigali Express',route: 'Kigali–Gitarama',issue: 'Poor service quality',          amount: 8000,  status: 'pending',  date: '2024-01-18' },
  { id: 4, passenger: 'Alice M.',   company: 'Rwanda Star',   route: 'Kigali–Butare',  issue: 'Seat not available on boarding',amount: 20000, status: 'rejected', date: '2024-01-17' },
];

const statusConfig = {
  pending:  { badge: 'badge-yellow', icon: Clock,        label: 'Pending'  },
  resolved: { badge: 'badge-green',  icon: CheckCircle,  label: 'Resolved' },
  rejected: { badge: 'badge-red',    icon: AlertCircle,  label: 'Rejected' },
};

const DisputeCenter: React.FC = () => {
  const [disputes, setDisputes]     = useState<Dispute[]>(initialDisputes);
  const [massRoute, setMassRoute]   = useState('');
  const [massAmount, setMassAmount] = useState('');

  const setStatus = (id: number, status: 'pending' | 'resolved' | 'rejected') =>
    setDisputes((prev) => prev.map((d) => d.id === id ? { ...d, status } : d));

  const handleMassRefund = () => {
    if (massRoute && massAmount) {
      alert(`Mass refund initiated for route "${massRoute}": ₨ ${parseInt(massAmount).toLocaleString()} per passenger`);
      setMassRoute('');
      setMassAmount('');
    }
  };

  const pending  = disputes.filter((d) => d.status === 'pending').length;
  const refunded = disputes.filter((d) => d.status === 'resolved').reduce((s, d) => s + d.amount, 0);
  const resRate  = Math.round((disputes.filter((d) => d.status === 'resolved').length / disputes.length) * 100);

  return (
    <div className="page-container">

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Pending Disputes', value: pending,                          color: '#E67E22' },
          { label: 'Total Refunded',   value: `₨ ${refunded.toLocaleString()}`, color: '#1E8449' },
          { label: 'Resolution Rate',  value: `${resRate}%`,                    color: '#F5A623' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <p className="text-xs text-muted font-medium uppercase tracking-wide">{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Mass Refund */}
      <div className="mb-8 p-5 bg-warning-light border-2 border-warning/30 rounded-xl">
        <div className="flex items-center gap-2 mb-1">
          <RotateCcw size={18} className="text-warning" />
          <h2 className="text-base font-bold text-warning">Mass Refund — Route Cancellation</h2>
        </div>
        <p className="text-sm text-warning/80 mb-4">Trigger automatic refunds for all passengers on a cancelled route.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            className="input-field border-warning/30 focus:border-warning focus:ring-warning/20"
            placeholder="Route (e.g. Kigali–Musanze)"
            value={massRoute}
            onChange={(e) => setMassRoute(e.target.value)}
          />
          <input
            className="input-field border-warning/30 focus:border-warning focus:ring-warning/20"
            placeholder="Refund Amount per Passenger (₨)"
            type="number"
            value={massAmount}
            onChange={(e) => setMassAmount(e.target.value)}
          />
          <button onClick={handleMassRefund} className="btn-primary justify-center bg-warning hover:bg-warning/90 focus:ring-warning/30">
            Trigger Mass Refund
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th-cell">Passenger</th>
              <th className="th-cell">Company</th>
              <th className="th-cell">Route</th>
              <th className="th-cell">Issue</th>
              <th className="th-cell">Amount</th>
              <th className="th-cell">Status</th>
              <th className="th-cell">Date</th>
              <th className="th-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((d) => {
              const cfg = statusConfig[d.status];
              const StatusIcon = cfg.icon;
              return (
                <tr key={d.id} className="tr-row">
                  <td className="td-cell font-semibold text-black">{d.passenger}</td>
                  <td className="td-cell text-black">{d.company}</td>
                  <td className="td-cell text-black">{d.route}</td>
                  <td className="td-cell text-muted max-w-[200px] truncate">{d.issue}</td>
                  <td className="td-cell font-semibold text-primary">₨ {d.amount.toLocaleString()}</td>
                  <td className="td-cell">
                    <div className="flex items-center gap-1.5">
                      <StatusIcon size={14} />
                      <span className={cfg.badge}>{cfg.label}</span>
                    </div>
                  </td>
                  <td className="td-cell text-muted text-xs">{d.date}</td>
                  <td className="td-cell">
                    {d.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => setStatus(d.id, 'resolved')} className="btn-approve">Approve</button>
                        <button onClick={() => setStatus(d.id, 'rejected')} className="btn-reject">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisputeCenter;
