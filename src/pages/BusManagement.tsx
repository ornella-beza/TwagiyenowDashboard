import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Bus } from 'lucide-react';

interface BusRecord {
  id: number;
  name: string;
  plateNumber: string;
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
  gpsLocation: string;
  company: string;
}

const initialBuses: BusRecord[] = [
  { id: 1, name: 'RITCO Bus 1',   plateNumber: 'RW-001-ABC', capacity: 50, status: 'active',      gpsLocation: 'Kigali – Musanze', company: 'RITCO'   },
  { id: 2, name: 'Horizon Bus 2', plateNumber: 'RW-002-XYZ', capacity: 45, status: 'active',      gpsLocation: 'Kigali – Muhanga', company: 'Horizon' },
  { id: 3, name: 'Kigali Star 3', plateNumber: 'RW-003-DEF', capacity: 40, status: 'maintenance', gpsLocation: 'Depot — Kigali',   company: 'KE'      },
];

const statusBadge: Record<string, string> = {
  active:      'badge-green',
  inactive:    'badge-gray',
  maintenance: 'badge-yellow',
};

const emptyForm = { name: '', plateNumber: '', capacity: '', company: '' };

export default function BusManagement() {
  const [buses, setBuses]       = useState<BusRecord[]>(initialBuses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(emptyForm);

  const addBus = () => {
    if (!form.name || !form.plateNumber || !form.capacity || !form.company) return;
    setBuses((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: form.name,
        plateNumber: form.plateNumber,
        capacity: parseInt(form.capacity),
        status: 'active',
        gpsLocation: 'Pending GPS',
        company: form.company,
      },
    ]);
    setForm(emptyForm);
    setShowForm(false);
  };

  const deleteBus = (id: number) => setBuses((prev) => prev.filter((b) => b.id !== id));

  const active      = buses.filter((b) => b.status === 'active').length;
  const maintenance = buses.filter((b) => b.status === 'maintenance').length;

  return (
    <div className="page-container">

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Total Buses',    value: buses.length, color: '#1E8449', bg: '#E8F5E9' },
          { label: 'Active',         value: active,       color: '#F5A623', bg: '#FFF8E1' },
          { label: 'In Maintenance', value: maintenance,  color: '#E67E22', bg: '#FEF3E2' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <p className="text-xs text-muted font-medium uppercase tracking-wide">{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Add Bus Panel */}
      <div className="content-card mb-6">
        <div className="flex items-center justify-between">
          <h2 className="section-heading mb-0">All Buses</h2>
          <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
            <Plus size={16} /> Add Bus
          </button>
        </div>

        {showForm && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 bg-divider rounded-lg border border-divider">
            <input className="input-field" placeholder="Bus Name"     value={form.name}        onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input-field" placeholder="Plate Number" value={form.plateNumber} onChange={(e) => setForm({ ...form, plateNumber: e.target.value })} />
            <input className="input-field" placeholder="Capacity"     type="number" value={form.capacity}    onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            <input className="input-field" placeholder="Company"      value={form.company}     onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <button onClick={addBus} className="btn-primary justify-center">Save</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th-cell">Bus Name</th>
              <th className="th-cell">Plate Number</th>
              <th className="th-cell">Capacity</th>
              <th className="th-cell">Company</th>
              <th className="th-cell">Status</th>
              <th className="th-cell">GPS Location</th>
              <th className="th-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id} className="tr-row">
                <td className="td-cell">
                  <div className="flex items-center gap-2 font-semibold text-black">
                    <Bus size={15} className="text-primary flex-shrink-0" />
                    {bus.name}
                  </div>
                </td>
                <td className="td-cell font-mono text-xs text-muted">{bus.plateNumber}</td>
                <td className="td-cell">{bus.capacity} seats</td>
                <td className="td-cell text-black">{bus.company}</td>
                <td className="td-cell">
                  <span className={statusBadge[bus.status]}>
                    {bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}
                  </span>
                </td>
                <td className="td-cell">
                  <div className="flex items-center gap-1.5 text-muted text-xs">
                    <MapPin size={13} className="flex-shrink-0" />
                    {bus.gpsLocation}
                  </div>
                </td>
                <td className="td-cell">
                  <div className="flex gap-1">
                    <button className="icon-btn-blue" title="Edit"><Edit2 size={16} /></button>
                    <button className="icon-btn-red" title="Delete" onClick={() => deleteBus(bus.id)}><Trash2 size={16} /></button>
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
