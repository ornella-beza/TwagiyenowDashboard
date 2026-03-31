import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Bus } from 'lucide-react';
import api from '../api';

const emptyForm = { name: '', plate: '', capacity: '' };

export default function BusManagement() {
  const [buses, setBuses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const fetchBuses = async () => {
    try {
      const res = await api.get('/buses');
      setBuses(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBuses(); }, []);

  const addBus = async () => {
    if (!form.name || !form.plate || !form.capacity) return;
    try {
      await api.post('/admin/buses', { name: form.name, plate: form.plate, capacity: parseInt(form.capacity) });
      setForm(emptyForm);
      setShowForm(false);
      fetchBuses();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed to add bus'); }
  };

  const deleteBus = async (id: string) => {
    if (!confirm('Delete this bus?')) return;
    try {
      await api.delete(`/admin/buses/${id}`);
      fetchBuses();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed to delete bus'); }
  };

  if (loading) return <div className="page-container flex items-center justify-center h-64"><p className="text-muted">Loading...</p></div>;

  return (
    <div className="page-container">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {[
          { label: 'Total Buses', value: buses.length, color: '#1E8449' },
          { label: 'Total Seats', value: buses.reduce((s: number, b: any) => s + b.capacity, 0), color: '#F5A623' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <p className="text-xs text-muted font-medium uppercase tracking-wide">{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="content-card mb-6">
        <div className="flex items-center justify-between">
          <h2 className="section-heading mb-0">All Buses</h2>
          <button onClick={() => setShowForm(v => !v)} className="btn-primary">
            <Plus size={16} /> Add Bus
          </button>
        </div>

        {showForm && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-divider rounded-lg border border-divider">
            <input className="input-field" placeholder="Bus Name"   value={form.name}     onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="input-field" placeholder="Plate"      value={form.plate}    onChange={e => setForm({ ...form, plate: e.target.value })} />
            <input className="input-field" placeholder="Capacity"   type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
            <button onClick={addBus} className="btn-primary justify-center">Save</button>
          </div>
        )}
      </div>

      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th-cell">Bus Name</th>
              <th className="th-cell">Plate</th>
              <th className="th-cell">Capacity</th>
              <th className="th-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus: any) => (
              <tr key={bus.id} className="tr-row">
                <td className="td-cell">
                  <div className="flex items-center gap-2 font-semibold text-black">
                    <Bus size={15} className="text-primary flex-shrink-0" />
                    {bus.name}
                  </div>
                </td>
                <td className="td-cell font-mono text-xs text-muted">{bus.plate}</td>
                <td className="td-cell">{bus.capacity} seats</td>
                <td className="td-cell">
                  <button className="icon-btn-red" onClick={() => deleteBus(bus.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
