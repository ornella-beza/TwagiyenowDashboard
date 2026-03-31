import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Car, Phone } from 'lucide-react';

interface PrivateCar {
  id: number;
  name: string;
  plateNumber: string;
  driver: string;
  capacity: number;
  status: 'available' | 'booked' | 'maintenance';
  phone: string;
}

const initialCars: PrivateCar[] = [
  { id: 1, name: 'Toyota Prius',   plateNumber: 'RW-100-ABC', driver: 'John Doe',    capacity: 4, status: 'available', phone: '+250 788 123 456' },
  { id: 2, name: 'Honda Civic',    plateNumber: 'RW-101-XYZ', driver: 'Jane Smith',  capacity: 5, status: 'booked',    phone: '+250 788 654 321' },
  { id: 3, name: 'Toyota Corolla', plateNumber: 'RW-102-GHJ', driver: 'Eric Muneza', capacity: 5, status: 'available', phone: '+250 788 111 222' },
];

const statusBadge: Record<string, string> = {
  available:   'badge-green',
  booked:      'badge-yellow',
  maintenance: 'badge-gray',
};

const emptyForm = { name: '', plateNumber: '', driver: '', capacity: '', phone: '' };

export default function PrivateCarsManagement() {
  const [cars, setCars]         = useState<PrivateCar[]>(initialCars);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(emptyForm);

  const addCar = () => {
    if (!form.name || !form.plateNumber || !form.driver || !form.capacity) return;
    setCars((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: form.name,
        plateNumber: form.plateNumber,
        driver: form.driver,
        capacity: parseInt(form.capacity),
        status: 'available',
        phone: form.phone,
      },
    ]);
    setForm(emptyForm);
    setShowForm(false);
  };

  const deleteCar = (id: number) => setCars((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="page-container">

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Total Cars',  value: cars.length,                                         color: '#1E8449' },
          { label: 'Available',   value: cars.filter((c) => c.status === 'available').length, color: '#F5A623' },
          { label: 'Booked Now',  value: cars.filter((c) => c.status === 'booked').length,    color: '#E67E22' },
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
          <h2 className="section-heading mb-0">All Private Cars</h2>
          <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
            <Plus size={16} /> Add Car
          </button>
        </div>

        {showForm && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-6 gap-3 p-4 bg-divider rounded-lg border border-divider">
            <input className="input-field" placeholder="Car Name"     value={form.name}        onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input-field" placeholder="Plate Number" value={form.plateNumber} onChange={(e) => setForm({ ...form, plateNumber: e.target.value })} />
            <input className="input-field" placeholder="Driver Name"  value={form.driver}      onChange={(e) => setForm({ ...form, driver: e.target.value })} />
            <input className="input-field" placeholder="Capacity"     type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            <input className="input-field" placeholder="Phone"        type="tel"    value={form.phone}    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <button onClick={addCar} className="btn-primary justify-center">Save</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th-cell">Car</th>
              <th className="th-cell">Plate Number</th>
              <th className="th-cell">Driver</th>
              <th className="th-cell">Capacity</th>
              <th className="th-cell">Phone</th>
              <th className="th-cell">Status</th>
              <th className="th-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id} className="tr-row">
                <td className="td-cell">
                  <div className="flex items-center gap-2 font-semibold text-black">
                    <Car size={15} className="text-primary flex-shrink-0" />
                    {car.name}
                  </div>
                </td>
                <td className="td-cell font-mono text-xs text-muted">{car.plateNumber}</td>
                <td className="td-cell text-black">{car.driver}</td>
                <td className="td-cell text-black">{car.capacity} seats</td>
                <td className="td-cell">
                  <div className="flex items-center gap-1.5 text-muted text-xs">
                    <Phone size={13} className="flex-shrink-0" />
                    {car.phone}
                  </div>
                </td>
                <td className="td-cell">
                  <span className={statusBadge[car.status]}>
                    {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                  </span>
                </td>
                <td className="td-cell">
                  <div className="flex gap-1">
                    <button className="icon-btn-blue" title="Edit"><Edit2 size={16} /></button>
                    <button className="icon-btn-red"  title="Delete" onClick={() => deleteCar(car.id)}><Trash2 size={16} /></button>
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
