import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../api';

const emptyForm = { from_city: '', to_city: '', distance_km: '', price: '' };

const RouteRegulator: React.FC = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchRoutes = async () => {
    try {
      const res = await api.get('/routes');
      setRoutes(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRoutes(); }, []);

  const addRoute = async () => {
    if (!form.from_city || !form.to_city || !form.distance_km) return;
    try {
      await api.post('/admin/routes', {
        from_city: form.from_city,
        to_city: form.to_city,
        distance_km: parseInt(form.distance_km),
      });
      setForm(emptyForm);
      setShowForm(false);
      fetchRoutes();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed to add route'); }
  };

  const deleteRoute = async (id: string) => {
    if (!confirm('Delete this route?')) return;
    try {
      await api.delete(`/admin/routes/${id}`);
      fetchRoutes();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed to delete route'); }
  };

  if (loading) return <div className="page-container flex items-center justify-center h-64"><p className="text-muted">Loading...</p></div>;

  return (
    <div className="page-container">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {[
          { label: 'Total Routes', value: routes.length,                                    color: '#1E8449' },
          { label: 'Total Distance', value: `${routes.reduce((s: number, r: any) => s + (r.distance_km || 0), 0)} km`, color: '#F5A623' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <p className="text-xs text-muted font-medium uppercase tracking-wide">{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="content-card mb-6">
        <div className="flex items-center justify-between">
          <h2 className="section-heading mb-0">Official Routes</h2>
          <button onClick={() => setShowForm(v => !v)} className="btn-primary">
            <Plus size={16} /> Add Route
          </button>
        </div>

        {showForm && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-divider rounded-lg border border-divider">
            <input className="input-field" placeholder="From City"     value={form.from_city}   onChange={e => setForm({ ...form, from_city: e.target.value })} />
            <input className="input-field" placeholder="To City"       value={form.to_city}     onChange={e => setForm({ ...form, to_city: e.target.value })} />
            <input className="input-field" placeholder="Distance (km)" type="number" value={form.distance_km} onChange={e => setForm({ ...form, distance_km: e.target.value })} />
            <button onClick={addRoute} className="btn-primary justify-center">Save Route</button>
          </div>
        )}
      </div>

      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th-cell">From</th>
              <th className="th-cell">To</th>
              <th className="th-cell">Distance</th>
              <th className="th-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.length === 0 && (
              <tr><td colSpan={4} className="td-cell text-center text-muted py-8">No routes yet.</td></tr>
            )}
            {routes.map((r: any) => (
              <tr key={r.id} className="tr-row">
                <td className="td-cell font-semibold text-black">{r.from_city}</td>
                <td className="td-cell text-black">{r.to_city}</td>
                <td className="td-cell text-muted">{r.distance_km} km</td>
                <td className="td-cell">
                  <button className="icon-btn-red" onClick={() => deleteRoute(r.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RouteRegulator;
