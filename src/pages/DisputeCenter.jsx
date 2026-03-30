import { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';

export default function DisputeCenter() {
  const [disputes, setDisputes] = useState([
    {
      id: 1,
      passenger: 'John Doe',
      company: 'RITCO',
      route: 'Kigali-Musanze',
      issue: 'Bus cancelled without notice',
      amount: 15000,
      status: 'pending',
      date: '2024-01-20',
    },
    {
      id: 2,
      passenger: 'Jane Smith',
      company: 'Horizon',
      route: 'Kigali-Muhanga',
      issue: 'Overcharged for ticket',
      amount: 5000,
      status: 'resolved',
      date: '2024-01-19',
    },
    {
      id: 3,
      passenger: 'Bob Wilson',
      company: 'Kigali Express',
      route: 'Kigali-Gitarama',
      issue: 'Poor service quality',
      amount: 8000,
      status: 'pending',
      date: '2024-01-18',
    },
  ]);

  const [massRefundRoute, setMassRefundRoute] = useState('');
  const [massRefundAmount, setMassRefundAmount] = useState('');

  const updateDisputeStatus = (id, newStatus) => {
    setDisputes(disputes.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  const handleMassRefund = () => {
    if (massRefundRoute && massRefundAmount) {
      alert(`Mass refund initiated for ${massRefundRoute}: ₨ ${massRefundAmount}`);
      setMassRefundRoute('');
      setMassRefundAmount('');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} className="text-yellow-600" />;
      case 'resolved':
        return <CheckCircle size={20} className="text-green-600" />;
      default:
        return <AlertCircle size={20} className="text-red-600" />;
    }
  };

  const pendingCount = disputes.filter(d => d.status === 'pending').length;
  const totalRefunded = disputes.filter(d => d.status === 'resolved').reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dispute & Refund Center</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Pending Disputes</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total Refunded</p>
          <p className="text-3xl font-bold text-green-600">₨ {totalRefunded.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Resolution Rate</p>
          <p className="text-3xl font-bold text-primary">67%</p>
        </div>
      </div>

      {/* Mass Refund Section */}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-red-800 mb-4">🚨 Mass Refund (Route Cancellation)</h2>
        <p className="text-red-700 mb-4">Trigger automatic refunds for all passengers on a cancelled route</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Route (e.g., Kigali-Musanze)"
            value={massRefundRoute}
            onChange={(e) => setMassRefundRoute(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="number"
            placeholder="Refund Amount per Passenger"
            value={massRefundAmount}
            onChange={(e) => setMassRefundAmount(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleMassRefund}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            Trigger Mass Refund
          </button>
        </div>
      </div>

      {/* Disputes Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-6 py-4 text-left">Passenger</th>
              <th className="px-6 py-4 text-left">Company</th>
              <th className="px-6 py-4 text-left">Route</th>
              <th className="px-6 py-4 text-left">Issue</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((dispute) => (
              <tr key={dispute.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">{dispute.passenger}</td>
                <td className="px-6 py-4 text-gray-700">{dispute.company}</td>
                <td className="px-6 py-4 text-gray-700">{dispute.route}</td>
                <td className="px-6 py-4 text-gray-700">{dispute.issue}</td>
                <td className="px-6 py-4 font-semibold text-primary">₨ {dispute.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(dispute.status)}
                    <span className="text-sm font-semibold capitalize">{dispute.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{dispute.date}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {dispute.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateDisputeStatus(dispute.id, 'resolved')}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateDisputeStatus(dispute.id, 'rejected')}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
