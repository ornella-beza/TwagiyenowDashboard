import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Clock, Edit2, X, Check } from 'lucide-react';
import api from '../api';

const emptyForm = { route_id: '', bus_id: '', departure_time: '', expected_arrival: '', price: '' };

const toDatetimeLocal = (iso: string) => iso ? iso.slice(0, 16) : '';

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [routes, setRoutes]       = useState<any[]>([]);
  const [buses, setBuses]         = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [editId, setEditId]       = useState<string | null>(null);
  const [editForm, setEditForm]   = useState(emptyForm);

  const fetchAll = async () => {
    try {
      const [schRes, routeRes, busRes] = await Promise.all([
        api.get('/schedules/all'),
        api.get('/routes'),
        api.get('/buses'),
      ]);
      setSchedules(schRes.data);
      setRoutes(routeRes.data);
      setBuses(busRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const addSchedule = async () => {
    if (!form.route_id || !form.bus_id || !form.departure_time || !form.price) return;
    try {
      await api.post('/admin/schedules', {
        route_id: form.route_id,
        bus_id: form.bus_id,
        departure_time: form.departure_time,
        expected_arrival: form.expected_arrival || null,
        price: parseFloat(form.price),
      });
      setForm(emptyForm);
      setShowForm(false);
      fetchAll();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed to add schedule'); }
  };

  const startEdit = (s: any) => {
    setEditId(s.id);
    setEditForm({
      route_id: s.route_id || '',
      bus_id: s.bus_id || '',
      departure_time: toDatetimeLocal(s.departure_time),
      expected_arrival: toDatetimeLocal(s.expected_arrival),
      price: s.price,
    });
  };

  const saveEdit = async () => {
    if (!editId) return;
    try {
      await api.put(`/admin/schedules/${editId}`, {
        route_id: editForm.route_id,
        bus_id: editForm.bus_id,
        departure_time: editForm.departure_time,
        expected_arrival: editForm.expected_arrival || null,
        price: parseFloat(editForm.price),
      });
      setEditId(null);
      fetchAll();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed to update schedule'); }
  };

  const deleteSchedule = async (id: string) => {
    if (!confirm('Delete this schedule?')) return;
    try {
      await api.delete(`/admin/schedules/${id}`);
      fetchAll();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div className="page-container flex items-center justify-center h-64"><p className="text-muted">Loading...</p></div>;

  return (
    <div className="page-container">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {[
          { label: 'Total Schedules',   value: schedules.length, color: '#1E8449' },
          { label: "Today's Schedules", value: schedules.filter((s: any) => new Date(s.departure_time).toDateString() === new Date().toDateString()).length, color: '#F5A623' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <p className="text-xs text-muted font-medium uppercase tracking-wide">{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="content-card mb-6">
        <div className="flex items-center justify-between">
          <h2 className="section-heading mb-0">All Schedules</h2>
          <button onClick={() => setShowForm(v => !v)} className="btn-primary">
            <Plus size={16} /> Add Schedule
          </button>
        </div>

        {showForm && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-6 gap-3 p-4 bg-divider rounded-lg border border-divider">
            <select className="input-field" value={form.route_id} onChange={e => setForm({ ...form, route_id: e.target.value })}>
              <option value="">Select Route</option>
              {routes.map((r: any) => <option key={r.id} value={r.id}>{r.from_city} → {r.to_city}</option>)}
            </select>
            <select className="input-field" value={form.bus_id} onChange={e => setForm({ ...form, bus_id: e.target.value })}>
              <option value="">Select Bus</option>
              {buses.map((b: any) => <option key={b.id} value={b.id}>{b.name} ({b.plate})</option>)}
            </select>
            <input className="input-field" type="datetime-local" value={form.departure_time} onChange={e => setForm({ ...form, departure_time: e.target.value })} />
            <input className="input-field" type="datetime-local" value={form.expected_arrival} onChange={e => setForm({ ...form, expected_arrival: e.target.value })} />
            <input className="input-field" type="number" placeholder="Price (RWF)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <button onClick={addSchedule} className="btn-primary justify-center">Save</button>
          </div>
        )}
      </div>

      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th-cell">Route</th>
              <th className="th-cell">Bus</th>
              <th className="th-cell">Departure</th>
              <th className="th-cell">Expected Arrival</th>
              <th className="th-cell">Price</th>
              <th className="th-cell">Seats</th>
              <th className="th-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 && (
              <tr><td colSpan={7} className="td-cell text-center text-muted py-8">No schedules yet.</td></tr>
            )}
            {schedules.map((s: any) => (
              <tr key={s.id} className="tr-row">
                {editId === s.id ? (
                  <>
                    <td className="td-cell">
                      <select className="input-field text-xs" value={editForm.route_id} onChange={e => setEditForm({ ...editForm, route_id: e.target.value })}>
                        {routes.map((r: any) => <option key={r.id} value={r.id}>{r.from_city} → {r.to_city}</option>)}
                      </select>
                    </td>
                    <td className="td-cell">
                      <select className="input-field text-xs" value={editForm.bus_id} onChange={e => setEditForm({ ...editForm, bus_id: e.target.value })}>
                        {buses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </td>
                    <td className="td-cell">
                      <input className="input-field text-xs" type="datetime-local" value={editForm.departure_time} onChange={e => setEditForm({ ...editForm, departure_time: e.target.value })} />
                    </td>
                    <td className="td-cell">
                      <input className="input-field text-xs" type="datetime-local" value={editForm.expected_arrival} onChange={e => setEditForm({ ...editForm, expected_arrival: e.target.value })} />
                    </td>
                    <td className="td-cell">
                      <input className="input-field text-xs w-24" type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} />
                    </td>
                    <td className="td-cell text-muted">{s.available_seats} / {s.capacity}</td>
                    <td className="td-cell">
                      <div className="flex gap-1">
                        <button className="icon-btn-blue" onClick={saveEdit} title="Save"><Check size={16} /></button>
                        <button className="icon-btn" onClick={() => setEditId(null)} title="Cancel"><X size={16} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="td-cell font-semibold text-black">{s.from_city} → {s.to_city}</td>
                    <td className="td-cell text-black">{s.bus_name} <span className="text-xs text-muted">({s.plate})</span></td>
                    <td className="td-cell">
                      <div className="flex items-center gap-1.5 text-black">
                        <Clock size={14} className="text-primary flex-shrink-0" />
                        {new Date(s.departure_time).toLocaleString()}
                      </div>
                    </td>
                    <td className="td-cell text-muted">
                      {s.expected_arrival ? new Date(s.expected_arrival).toLocaleString() : '—'}
                    </td>
                    <td className="td-cell font-semibold text-primary">{parseFloat(s.price).toLocaleString()} RWF</td>
                    <td className="td-cell text-muted">{s.available_seats} / {s.capacity}</td>
                    <td className="td-cell">
                      <div className="flex gap-1">
                        <button className="icon-btn-blue" onClick={() => startEdit(s)} title="Edit"><Edit2 size={16} /></button>
                        <button className="icon-btn-red"  onClick={() => deleteSchedule(s.id)} title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
