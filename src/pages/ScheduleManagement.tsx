import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, ArrowRight } from 'lucide-react';

interface Schedule {
  id: number;
  busName: string;
  route: string;
  departTime: string;
  arrivalTime: string;
  frequency: string;
  status: 'active' | 'inactive';
}

const initialSchedules: Schedule[] = [
  { id: 1, busName: 'RITCO Bus 1',   route: 'Kigali – Musanze', departTime: '06:30', arrivalTime: '08:50', frequency: 'Daily',   status: 'active' },
  { id: 2, busName: 'Horizon Bus 2', route: 'Kigali – Muhanga', departTime: '07:00', arrivalTime: '07:45', frequency: 'Daily',   status: 'active' },
  { id: 3, busName: 'Kigali Star 3', route: 'Kigali – Butare',  departTime: '08:00', arrivalTime: '10:30', frequency: 'Mon–Fri', status: 'active' },
];

const emptyForm = { busName: '', route: '', departTime: '', arrivalTime: '', frequency: '' };

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(emptyForm);

  const addSchedule = () => {
    if (!form.busName || !form.route || !form.departTime || !form.arrivalTime) return;
    setSchedules((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        busName: form.busName,
        route: form.route,
        departTime: form.departTime,
        arrivalTime: form.arrivalTime,
        frequency: form.frequency || 'Daily',
        status: 'active',
      },
    ]);
    setForm(emptyForm);
    setShowForm(false);
  };

  const deleteSchedule = (id: number) => setSchedules((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className="page-container">

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Total Schedules', value: schedules.length,                                        color: '#1E8449' },
          { label: 'Active',          value: schedules.filter((s) => s.status === 'active').length,   color: '#F5A623' },
          { label: 'Inactive',        value: schedules.filter((s) => s.status === 'inactive').length, color: '#888888' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <p className="text-xs text-muted font-medium uppercase tracking-wide">{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Add Form */}
      <div className="content-card mb-6">
        <div className="flex items-center justify-between">
          <h2 className="section-heading mb-0">All Schedules</h2>
          <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
            <Plus size={16} /> Add Schedule
          </button>
        </div>

        {showForm && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-6 gap-3 p-4 bg-divider rounded-lg border border-divider">
            <input className="input-field" placeholder="Bus Name"     value={form.busName}    onChange={(e) => setForm({ ...form, busName: e.target.value })} />
            <input className="input-field" placeholder="Route"        value={form.route}      onChange={(e) => setForm({ ...form, route: e.target.value })} />
            <input className="input-field" type="time" value={form.departTime}  onChange={(e) => setForm({ ...form, departTime: e.target.value })} />
            <input className="input-field" type="time" value={form.arrivalTime} onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })} />
            <input className="input-field" placeholder="Frequency (e.g. Daily)" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} />
            <button onClick={addSchedule} className="btn-primary justify-center">Save</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th-cell">Bus Name</th>
              <th className="th-cell">Route</th>
              <th className="th-cell">Depart</th>
              <th className="th-cell">Arrive</th>
              <th className="th-cell">Frequency</th>
              <th className="th-cell">Status</th>
              <th className="th-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s.id} className="tr-row">
                <td className="td-cell font-semibold text-black">{s.busName}</td>
                <td className="td-cell text-black">{s.route}</td>
                <td className="td-cell">
                  <div className="flex items-center gap-1.5 text-black">
                    <Clock size={14} className="text-primary flex-shrink-0" />
                    {s.departTime}
                  </div>
                </td>
                <td className="td-cell">
                  <div className="flex items-center gap-1.5 text-black">
                    <ArrowRight size={14} className="text-muted flex-shrink-0" />
                    {s.arrivalTime}
                  </div>
                </td>
                <td className="td-cell text-muted">{s.frequency}</td>
                <td className="td-cell">
                  <span className={s.status === 'active' ? 'badge-green' : 'badge-gray'}>
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </span>
                </td>
                <td className="td-cell">
                  <div className="flex gap-1">
                    <button className="icon-btn-blue" title="Edit"><Edit2 size={16} /></button>
                    <button className="icon-btn-red"  title="Delete" onClick={() => deleteSchedule(s.id)}><Trash2 size={16} /></button>
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
