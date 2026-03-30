import { useState } from 'react';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';

interface Route {
  id: number;
  name: string;
  distance: number;
  priceCap: number;
  currentAvgPrice: number;
  status: 'active' | 'warning';
}

interface FormData {
  name: string;
  distance: string;
  priceCap: string;
}

const RouteRegulator: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([
    {
      id: 1,
      name: 'Kigali-Musanze',
      distance: 85,
      priceCap: 15000,
      currentAvgPrice: 14500,
      status: 'active',
    },
    {
      id: 2,
      name: 'Kigali-Muhanga',
      distance: 45,
      priceCap: 8000,
      currentAvgPrice: 7800,
      status: 'active',
    },
    {
      id: 3,
      name: 'Kigali-Gitarama',
      distance: 30,
      priceCap: 5000,
      currentAvgPrice: 5200,
      status: 'warning',
    },
    {
      id: 4,
      name: 'Kigali-Butare',
      distance: 120,
      priceCap: 20000,
      currentAvgPrice: 19800,
      status: 'active',
    },
  ]);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({ name: '', distance: '', priceCap: '' });

  const addRoute = (): void => {
    if (formData.name && formData.distance && formData.priceCap) {
      setRoutes([
        ...routes,
        {
          id: routes.length + 1,
          name: formData.name,
          distance: parseInt(formData.distance),
          priceCap: parseInt(formData.priceCap),
          currentAvgPrice: parseInt(formData.priceCap) * 0.95,
          status: 'active',
        },
      ]);
      setFormData({ name: '', distance: '', priceCap: '' });
      setShowForm(false);
    }
  };

  const deleteRoute = (id: number): void => {
    setRoutes(routes.filter(r => r.id !== id));
  };

  const getStatusColor = (status: string): string => {
    return status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
  };

  const overchargedRoutes = routes.filter(r => r.currentAvgPrice > r.priceCap);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Route Regulator</h1>

      {/* Add Route Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Define Official Routes</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Plus size={20} />
            Add Route
          </button>
        </div>

        {showForm && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Route Name (e.g., Kigali-Musanze)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              placeholder="Distance (km)"
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              placeholder="Price Cap (RWF)"
              value={formData.priceCap}
              onChange={(e) => setFormData({ ...formData, priceCap: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={addRoute}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Save Route
            </button>
          </div>
        )}
      </div>

      {/* Overcharge Alert */}
      {overchargedRoutes.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-red-800 mb-2">⚠️ Price Cap Violations Detected</h3>
              <p className="text-red-700 mb-3">The following routes have average prices exceeding the price cap:</p>
              <ul className="space-y-2">
                {overchargedRoutes.map(route => (
                  <li key={route.id} className="text-red-700">
                    <strong>{route.name}:</strong> ₨ {route.currentAvgPrice.toLocaleString()} (Cap: ₨ {route.priceCap.toLocaleString()})
                  </li>
                ))}
              </ul>
              <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Issue Warning to Companies
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routes Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-6 py-4 text-left">Route Name</th>
              <th className="px-6 py-4 text-left">Distance (km)</th>
              <th className="px-6 py-4 text-left">Price Cap</th>
              <th className="px-6 py-4 text-left">Current Avg Price</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => {
              const isOvercharged = route.currentAvgPrice > route.priceCap;
              return (
                <tr key={route.id} className={`border-b hover:bg-gray-50 ${isOvercharged ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4 font-semibold text-gray-800">{route.name}</td>
                  <td className="px-6 py-4 text-gray-700">{route.distance}</td>
                  <td className="px-6 py-4 font-semibold text-primary">₨ {route.priceCap.toLocaleString()}</td>
                  <td className={`px-6 py-4 font-semibold ${isOvercharged ? 'text-red-600' : 'text-green-600'}`}>
                    ₨ {route.currentAvgPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(route.status)}`}>
                      {route.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteRoute(route.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
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
