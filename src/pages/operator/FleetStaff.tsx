import { useState } from 'react';
import { Plus, Pencil, Trash2, Bus, UserCheck, Search, Link2 } from 'lucide-react';

interface BusEntry {
  id: string;
  plate: string;
  capacity: number;
  assignedDriver: string;
  status: 'active' | 'idle' | 'maintenance';
  year: string;
}

interface Driver {
  id: string;
  name: string;
  license: string;
  phone: string;
  status: 'on-duty' | 'off-duty' | 'on-leave';
  assignedBus: string;
}

const initialBuses: BusEntry[] = [
  { id: '1', plate: 'RAC 102B', capacity: 49, assignedDriver: 'Jean Bosco', status: 'active', year: '2021' },
  { id: '2', plate: 'RAC 205A', capacity: 49, assignedDriver: 'Eric Mugisha', status: 'active', year: '2020' },
  { id: '3', plate: 'RAC 310C', capacity: 32, assignedDriver: 'Unassigned', status: 'idle', year: '2019' },
  { id: '4', plate: 'RAC 418D', capacity: 49, assignedDriver: 'Patrick Nkusi', status: 'active', year: '2022' },
];

const initialDrivers: Driver[] = [
  { id: '1', name: 'Jean Bosco', license: 'DL-001234', phone: '+250 788 111 222', status: 'on-duty', assignedBus: 'RAC 102B' },
  { id: '2', name: 'Eric Mugisha', license: 'DL-005678', phone: '+250 788 333 444', status: 'on-duty', assignedBus: 'RAC 205A' },
  { id: '3', name: 'Alice Uwase', license: 'DL-009012', phone: '+250 788 555 666', status: 'off-duty', assignedBus: 'Unassigned' },
  { id: '4', name: 'Patrick Nkusi', license: 'DL-003456', phone: '+250 788 777 888', status: 'on-duty', assignedBus: 'RAC 418D' },
];

const emptyBus = { plate: '', capacity: 49, assignedDriver: 'Unassigned', status: 'idle' as const, year: '' };
const emptyDriver = { name: '', license: '', phone: '', status: 'off-duty' as const, assignedBus: 'Unassigned' };

const busStatusCfg = {
  active: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  idle: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-400' },
  maintenance: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

const driverStatusCfg = {
  'on-duty': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'off-duty': { bg: 'bg-gray-100', text: 'text-gray-500' },
  'on-leave': { bg: 'bg-amber-100', text: 'text-amber-700' },
};

const FleetStaff: React.FC = () => {
  const [buses, setBuses] = useState<BusEntry[]>(initialBuses);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [busForm, setBusForm] = useState(emptyBus);
  const [driverForm, setDriverForm] = useState(emptyDriver);
  const [editBusId, setEditBusId] = useState<string | null>(null);
  const [editDriverId, setEditDriverId] = useState<string | null>(null);
  const [showBusForm, setShowBusForm] = useState(false);
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [busSearch, setBusSearch] = useState('');
  const [driverSearch, setDriverSearch] = useState('');

  const saveBus = () => {
    if (!busForm.plate) return;
    if (editBusId) {
      setBuses(buses.map(b => b.id === editBusId ? { ...busForm, id: editBusId } : b));
    } else {
      setBuses([...buses, { ...busForm, id: Date.now().toString() }]);
    }
    setBusForm(emptyBus);
    setEditBusId(null);
    setShowBusForm(false);
  };

  const editBus = (bus: BusEntry) => {
    setBusForm({ plate: bus.plate, capacity: bus.capacity, assignedDriver: bus.assignedDriver, status: bus.status, year: bus.year });
    setEditBusId(bus.id);
    setShowBusForm(true);
  };

  const deleteBus = (id: string) => setBuses(buses.filter(b => b.id !== id));

  const saveDriver = () => {
    if (!driverForm.name) return;
    if (editDriverId) {
      setDrivers(drivers.map(d => d.id === editDriverId ? { ...driverForm, id: editDriverId } : d));
    } else {
      setDrivers([...drivers, { ...driverForm, id: Date.now().toString() }]);
    }
    setDriverForm(emptyDriver);
    setEditDriverId(null);
    setShowDriverForm(false);
  };

  const editDriver = (driver: Driver) => {
    setDriverForm({ name: driver.name, license: driver.license, phone: driver.phone, status: driver.status, assignedBus: driver.assignedBus });
    setEditDriverId(driver.id);
    setShowDriverForm(true);
  };

  const deleteDriver = (id: string) => setDrivers(drivers.filter(d => d.id !== id));

  const filteredBuses = buses.filter(b =>
    b.plate.toLowerCase().includes(busSearch.toLowerCase()) ||
    b.assignedDriver.toLowerCase().includes(busSearch.toLowerCase())
  );

  const filteredDrivers = drivers.filter(d =>
    d.name.toLowerCase().includes(driverSearch.toLowerCase()) ||
    d.license.toLowerCase().includes(driverSearch.toLowerCase())
  );

  const statCards = [
    { label: 'Total Buses', value: buses.length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active', value: buses.filter(b => b.status === 'active').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Idle', value: buses.filter(b => b.status === 'idle').length, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Drivers', value: drivers.length, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Fleet & Staff Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage buses, drivers, and assignments</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className={`${s.bg} rounded-2xl p-4 border border-white shadow-sm`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-600 mt-0.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Buses Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Bus size={18} className="text-[#1E8449]" /> Bus Fleet
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg font-medium">{buses.length} total</span>
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs w-44 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="Search buses..."
                value={busSearch}
                onChange={e => setBusSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => { setBusForm(emptyBus); setEditBusId(null); setShowBusForm(true); }}
              className="flex items-center gap-1.5 bg-[#1E8449] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-green-700 transition shadow-sm"
            >
              <Plus size={14} /> Add Bus
            </button>
          </div>
        </div>

        {showBusForm && (
          <div className="mb-5 p-5 bg-gray-50 rounded-2xl border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-4">{editBusId ? 'Edit Bus' : 'New Bus'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Plate Number</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="e.g. RAC 102B"
                  value={busForm.plate}
                  onChange={e => setBusForm({ ...busForm, plate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Seat Capacity</label>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value={busForm.capacity}
                  onChange={e => setBusForm({ ...busForm, capacity: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Year</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="e.g. 2022"
                  value={busForm.year}
                  onChange={e => setBusForm({ ...busForm, year: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Assigned Driver</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value={busForm.assignedDriver}
                  onChange={e => setBusForm({ ...busForm, assignedDriver: e.target.value })}
                >
                  <option value="Unassigned">Unassigned</option>
                  {drivers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Status</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value={busForm.status}
                  onChange={e => setBusForm({ ...busForm, status: e.target.value as BusEntry['status'] })}
                >
                  <option value="active">Active</option>
                  <option value="idle">Idle</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={saveBus} className="bg-[#1E8449] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition">
                {editBusId ? 'Update Bus' : 'Save Bus'}
              </button>
              <button onClick={() => setShowBusForm(false)} className="bg-gray-100 text-gray-600 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Plate</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Capacity</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Year</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Assigned Driver</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Status</th>
                <th className="pb-3 font-semibold uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBuses.map(bus => {
                const cfg = busStatusCfg[bus.status];
                return (
                  <tr key={bus.id} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 pr-4">
                      <span className="font-bold text-gray-900 text-xs bg-gray-100 px-2.5 py-1 rounded-lg font-mono">{bus.plate}</span>
                    </td>
                    <td className="py-3.5 pr-4 text-gray-600 text-xs">{bus.capacity} seats</td>
                    <td className="py-3.5 pr-4 text-gray-500 text-xs">{bus.year || '—'}</td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-1.5">
                        {bus.assignedDriver !== 'Unassigned' && <Link2 size={12} className="text-emerald-500" />}
                        <span className={`text-xs font-semibold ${bus.assignedDriver === 'Unassigned' ? 'text-gray-400' : 'text-gray-700'}`}>
                          {bus.assignedDriver}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex gap-1">
                        <button onClick={() => editBus(bus)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => deleteBus(bus.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition">
                          <Trash2 size={14} />
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

      {/* Drivers Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <UserCheck size={18} className="text-[#1E8449]" /> Driver Roster
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg font-medium">{drivers.length} total</span>
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs w-44 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="Search drivers..."
                value={driverSearch}
                onChange={e => setDriverSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => { setDriverForm(emptyDriver); setEditDriverId(null); setShowDriverForm(true); }}
              className="flex items-center gap-1.5 bg-[#1E8449] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-green-700 transition shadow-sm"
            >
              <Plus size={14} /> Add Driver
            </button>
          </div>
        </div>

        {showDriverForm && (
          <div className="mb-5 p-5 bg-gray-50 rounded-2xl border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-4">{editDriverId ? 'Edit Driver' : 'New Driver'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Full Name</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Full Name"
                  value={driverForm.name}
                  onChange={e => setDriverForm({ ...driverForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">License Number</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="e.g. DL-001234"
                  value={driverForm.license}
                  onChange={e => setDriverForm({ ...driverForm, license: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Phone Number</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="+250 788 ..."
                  value={driverForm.phone}
                  onChange={e => setDriverForm({ ...driverForm, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Assign Bus</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value={driverForm.assignedBus}
                  onChange={e => setDriverForm({ ...driverForm, assignedBus: e.target.value })}
                >
                  <option value="Unassigned">Unassigned</option>
                  {buses.map(b => <option key={b.id} value={b.plate}>{b.plate}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Status</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value={driverForm.status}
                  onChange={e => setDriverForm({ ...driverForm, status: e.target.value as Driver['status'] })}
                >
                  <option value="on-duty">On Duty</option>
                  <option value="off-duty">Off Duty</option>
                  <option value="on-leave">On Leave</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={saveDriver} className="bg-[#1E8449] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition">
                {editDriverId ? 'Update Driver' : 'Save Driver'}
              </button>
              <button onClick={() => setShowDriverForm(false)} className="bg-gray-100 text-gray-600 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Name</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">License</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Phone</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Assigned Bus</th>
                <th className="pb-3 pr-4 font-semibold uppercase tracking-wide">Status</th>
                <th className="pb-3 font-semibold uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDrivers.map(driver => {
                const cfg = driverStatusCfg[driver.status];
                return (
                  <tr key={driver.id} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#1E8449] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {driver.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-800 text-xs">{driver.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{driver.license}</span>
                    </td>
                    <td className="py-3.5 pr-4 text-gray-600 text-xs">{driver.phone}</td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-1.5">
                        {driver.assignedBus !== 'Unassigned' && <Bus size={12} className="text-emerald-500" />}
                        <span className={`text-xs font-semibold ${driver.assignedBus === 'Unassigned' ? 'text-gray-400' : 'text-gray-700'}`}>
                          {driver.assignedBus}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${cfg.bg} ${cfg.text}`}>
                        {driver.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex gap-1">
                        <button onClick={() => editDriver(driver)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => deleteDriver(driver.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition">
                          <Trash2 size={14} />
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
    </div>
  );
};

export default FleetStaff;
