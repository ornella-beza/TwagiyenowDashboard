import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, XCircle, Plus, Trash2 } from 'lucide-react';
import api from '../api';

const statusBadge: Record<string, string> = {
  approved:  'badge-green',
  pending:   'badge-yellow',
  suspended: 'badge-red',
};

const emptyForm = { name: '', email: '', phone: '' };

const CompanyOnboarding: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/admin/companies');
      setCompanies(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/companies/${id}/status`, { status });
      fetchCompanies();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
  };

  const addCompany = async () => {
    if (!form.name || !form.email) return;
    try {
      await api.post('/admin/companies', form);
      setForm(emptyForm);
      setShowForm(false);
      fetchCompanies();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed to add company'); }
  };

  const deleteCompany = async (id: string) => {
    if (!confirm('Delete this company?')) return;
    try {
      await api.delete(`/admin/companies/${id}`);
      fetchCompanies();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div className="page-container flex items-center justify-center h-64"><p className="text-muted">Loading...</p></div>;

  const approved  = companies.filter(c => c.status === 'approved').length;
  const pending   = companies.filter(c => c.status === 'pending').length;
  const suspended = companies.filter(c => c.status === 'suspended').length;

  return (
    <div className="page-container">

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Approved', value: approved,  color: '#1E8449', bg: '#E8F5E9' },
          { label: 'Pending',  value: pending,   color: '#E67E22', bg: '#FEF3E2' },
          { label: 'Suspended',value: suspended, color: '#C0392B', bg: '#FDECEA' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <p className="text-xs text-muted font-medium uppercase tracking-wide">{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="content-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-heading mb-0">Bus Companies ({companies.length})</h2>
          <button onClick={() => setShowForm(v => !v)} className="btn-primary">
            <Plus size={16} /> Add Company
          </button>
        </div>

        {showForm && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-divider rounded-lg border border-divider mb-4">
            <input className="input-field" placeholder="Company Name" value={form.name}  onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="input-field" placeholder="Email"        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input className="input-field" placeholder="Phone"        value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <button onClick={addCompany} className="btn-primary justify-center">Save</button>
          </div>
        )}
      </div>

      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th-cell">Company Name</th>
              <th className="th-cell">Email</th>
              <th className="th-cell">Phone</th>
              <th className="th-cell">Status</th>
              <th className="th-cell">License</th>
              <th className="th-cell">Insurance</th>
              <th className="th-cell">Applied</th>
              <th className="th-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 && (
              <tr><td colSpan={8} className="td-cell text-center text-muted py-8">No companies yet. Add one above.</td></tr>
            )}
            {companies.map((c: any) => (
              <tr key={c.id} className="tr-row">
                <td className="td-cell font-semibold text-black">{c.name}</td>
                <td className="td-cell text-muted text-xs">{c.email}</td>
                <td className="td-cell text-muted text-xs">{c.phone || '—'}</td>
                <td className="td-cell"><span className={statusBadge[c.status] || 'badge-gray'}>{c.status}</span></td>
                <td className="td-cell">
                  <div className="flex items-center gap-1">
                    {c.license === 'verified' ? <CheckCircle size={14} className="text-primary" /> : <AlertCircle size={14} className="text-secondary" />}
                    <span className="text-xs">{c.license}</span>
                  </div>
                </td>
                <td className="td-cell">
                  <div className="flex items-center gap-1">
                    {c.insurance === 'verified' ? <CheckCircle size={14} className="text-primary" /> : c.insurance === 'expired' ? <XCircle size={14} className="text-error" /> : <AlertCircle size={14} className="text-secondary" />}
                    <span className="text-xs">{c.insurance}</span>
                  </div>
                </td>
                <td className="td-cell text-muted text-xs">{c.applied_date?.slice(0, 10)}</td>
                <td className="td-cell">
                  <div className="flex gap-2 flex-wrap">
                    {c.status !== 'approved'  && <button onClick={() => updateStatus(c.id, 'approved')}  className="btn-approve">Approve</button>}
                    {c.status !== 'suspended' && <button onClick={() => updateStatus(c.id, 'suspended')} className="btn-reject">Suspend</button>}
                    <button onClick={() => deleteCompany(c.id)} className="icon-btn-red"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyOnboarding;
