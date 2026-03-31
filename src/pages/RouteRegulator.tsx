import React, { useState } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

interface Route {
  id: number;
  name: string;
  distance: number;
  priceCap: number;
  currentAvgPrice: number;
  status: 'active' | 'warning';
}

const initialRoutes: Route[] = [
  { id: 1, name: 'Kigali–Musanze',  distance: 85,  priceCap: 15000, currentAvgPrice: 14500, status: 'active'  },
  { id: 2, name: 'Kigali–Muhanga',  distance: 45,  priceCap: 8000,  currentAvgPrice: 7800,  status: 'active'  },
  { id: 3, name: 'Kigali–Gitarama', distance: 30,  priceCap: 5000,  currentAvgPrice: 5200,  status: 'warning' },
  { id: 4, name: 'Kigali–Butare',   distance: 120, priceCap: 20000, currentAvgPrice: 19800, status: 'active'  },
];

const emptyForm = { name: '', distance: '', priceCap: '' };

const RouteRegulator: React.FC = () => {
  const [routes, setRoutes]     = useState<Route[]>(initialRoutes);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(emptyForm);

  const addRoute = () => {
    if (!form.name || !form.distance || !form.priceCap) return;
    const cap = parseInt(form.priceCap);
    setRoutes((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: form.name,
        distance: parseInt(form.distance),
        priceCap: cap,
        currentAvgPrice: Math.round(cap * 0.95),
        status: 'active',
      },
    ]);
    setForm(emptyForm);
    setShowForm(false);
  };

  const deleteRoute = (id: number) => setRoutes((prev) => prev.filter((r) => r.id !== id));

  const overcharged = routes.filter((r) => r.currentAvgPrice > r.priceCap);

  return (
    <div className="page-container">

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Total Routes',     value: routes.length,                                       color: '#1E8449' },
          { label: 'Active Routes',    value: routes.filter((r) => r.status === 'active').length,  color: '#F5A623' },
          { label: 'Price Violations', value: overcharged.length,                                  color: '#E67E22' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <p className="text-xs text-muted font-medium uppercase tracking-wide">{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Violation Alert */}
      {overcharged.length > 0 && (
        <div className="mb-6 p-5 bg-warning-light border-2 border-warning/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-warning mb-2">Price Cap Violations Detected</h3>
              <ul className="space-y-1.5 mb-3">
                {overcharged.map((r) => (
                  <li key={r.id} className="text-sm text-warning/80">
                    <strong>{r.name}:</strong> Current ₨ {r.currentAvgPrice.toLocaleString()} &gt; Cap ₨ {r.priceCap.toLocaleString()}
                  </li>
                ))}
              </ul>
              <button className="btn-primary bg-warning hover:bg-warning/90 focus:ring-warning/30 text-sm">
                Issue Warning to Companies
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Route Form */}
      <div className="content-card mb-6">
        <div className="flex items-center justify-between">
          <h2 className="section-heading mb-0">Official Routes</h2>
          <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
            <Plus size={16} /> Add Route
          </button>
        </div>

        {showForm && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-divider rounded-lg border border-divider">
            <input className="input-field" placeholder="Route Name (e.g. Kigali–Musanze)" value={form.name}      onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input-field" placeholder="Distance (km)"   type="number" value={form.distance}   onChange={(e) => setForm({ ...form, distance: e.target.value })} />
            <input className="input-field" placeholder="Price Cap (₨)"   type="number" value={form.priceCap}   onChange={(e) => setForm({ ...form, priceCap: e.target.value })} />
            <button onClick={addRoute} className="btn-primary justify-center">Save Route</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th-cell">Route Name</th>
              <th className="th-cell">Distance</th>
              <th className="th-cell">Price Cap</th>
              <th className="th-cell">Avg Price</th>
              <th className="th-cell">Compliance</th>
              <th className="th-cell">Status</th>
              <th className="th-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => {
              const isOver = r.currentAvgPrice > r.priceCap;
              return (
                <tr key={r.id} className={`tr-row ${isOver ? 'bg-warning-light/40' : ''}`}>
                  <td className="td-cell font-semibold text-black">{r.name}</td>
                  <td className="td-cell text-black">{r.distance} km</td>
                  <td className="td-cell font-semibold text-primary">₨ {r.priceCap.toLocaleString()}</td>
                  <td className={`td-cell font-semibold ${isOver ? 'text-warning' : 'text-primary'}`}>
                    ₨ {r.currentAvgPrice.toLocaleString()}
                  </td>
                  <td className="td-cell">
                    {isOver
                      ? <div className="flex items-center gap-1.5 text-warning text-xs font-medium"><AlertTriangle size={14} /> Violation</div>
                      : <div className="flex items-center gap-1.5 text-primary text-xs font-medium"><CheckCircle size={14} /> Compliant</div>
                    }
                  </td>
                  <td className="td-cell">
                    <span className={r.status === 'active' ? 'badge-green' : 'badge-yellow'}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </td>
                  <td className="td-cell">
                    <div className="flex gap-1">
                      <button className="icon-btn-blue" title="Edit"><Edit2 size={16} /></button>
                      <button className="icon-btn-red" title="Delete" onClick={() => deleteRoute(r.id)}><Trash2 size={16} /></button>
                    </div>
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

export default RouteRegulator;
