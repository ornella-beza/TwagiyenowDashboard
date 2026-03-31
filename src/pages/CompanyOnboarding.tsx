import React, { useState } from 'react';
import { CheckCircle, AlertCircle, FileText, XCircle } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  status: 'pending' | 'approved' | 'suspended';
  license: 'verified' | 'pending' | 'expired';
  insurance: 'verified' | 'pending' | 'expired';
  appliedDate: string;
}

const initialCompanies: Company[] = [
  { id: 1, name: 'RITCO',         status: 'pending',   license: 'verified', insurance: 'pending',  appliedDate: '2024-01-15' },
  { id: 2, name: 'Horizon Bus',   status: 'approved',  license: 'verified', insurance: 'verified', appliedDate: '2024-01-10' },
  { id: 3, name: 'Kigali Express',status: 'suspended', license: 'verified', insurance: 'expired',  appliedDate: '2024-01-05' },
  { id: 4, name: 'Rwanda Star',   status: 'pending',   license: 'pending',  insurance: 'pending',  appliedDate: '2024-01-20' },
];

const statusBadge: Record<string, string> = {
  approved:  'badge-green',
  pending:   'badge-yellow',
  suspended: 'badge-red',
};

const docBadge: Record<string, string> = {
  verified: 'badge-green',
  pending:  'badge-yellow',
  expired:  'badge-red',
};

const CompanyOnboarding: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);

  const updateStatus = (id: number, newStatus: 'pending' | 'approved' | 'suspended') => {
    setCompanies((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
  };

  const approved  = companies.filter((c) => c.status === 'approved').length;
  const pending   = companies.filter((c) => c.status === 'pending').length;
  const suspended = companies.filter((c) => c.status === 'suspended').length;

  return (
    <div className="page-container">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Approved Companies', value: approved,  color: '#1E8449', bg: '#E8F5E9' },
          { label: 'Pending Review',     value: pending,   color: '#E67E22', bg: '#FEF3E2' },
          { label: 'Suspended',          value: suspended, color: '#C0392B', bg: '#FDECEA' },
        ].map((s, i) => (
          <div key={i} className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.bg }}>
              <span className="text-xl font-bold" style={{ color: s.color }}>{s.value}</span>
            </div>
            <div>
              <p className="text-xs text-muted font-medium uppercase tracking-wide">{s.label}</p>
              <p className="text-2xl font-bold text-black mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th-cell">Company Name</th>
              <th className="th-cell">Status</th>
              <th className="th-cell">License</th>
              <th className="th-cell">Insurance</th>
              <th className="th-cell">Applied Date</th>
              <th className="th-cell">Documents</th>
              <th className="th-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="tr-row">
                <td className="td-cell font-semibold text-black">{company.name}</td>
                <td className="td-cell">
                  <span className={statusBadge[company.status]}>
                    {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                  </span>
                </td>
                <td className="td-cell">
                  <div className="flex items-center gap-1.5">
                    {company.license === 'verified'
                      ? <CheckCircle size={15} className="text-primary" />
                      : <AlertCircle size={15} className="text-secondary" />
                    }
                    <span className={docBadge[company.license]}>{company.license}</span>
                  </div>
                </td>
                <td className="td-cell">
                  <div className="flex items-center gap-1.5">
                    {company.insurance === 'verified'
                      ? <CheckCircle size={15} className="text-primary" />
                      : company.insurance === 'expired'
                        ? <XCircle size={15} className="text-error" />
                        : <AlertCircle size={15} className="text-secondary" />
                    }
                    <span className={docBadge[company.insurance]}>{company.insurance}</span>
                  </div>
                </td>
                <td className="td-cell text-muted">{company.appliedDate}</td>
                <td className="td-cell">
                  <button className="flex items-center gap-1.5 text-primary text-sm font-medium hover:underline">
                    <FileText size={15} />
                    View Docs
                  </button>
                </td>
                <td className="td-cell">
                  <div className="flex gap-2">
                    {company.status !== 'approved' && (
                      <button onClick={() => updateStatus(company.id, 'approved')} className="btn-approve">
                        Approve
                      </button>
                    )}
                    {company.status !== 'suspended' && (
                      <button onClick={() => updateStatus(company.id, 'suspended')} className="btn-reject">
                        Suspend
                      </button>
                    )}
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
