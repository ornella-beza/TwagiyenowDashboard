import { useState } from 'react';
import { CheckCircle, XCircle, FileText, AlertCircle } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  status: 'pending' | 'approved' | 'suspended';
  license: 'verified' | 'pending' | 'expired';
  insurance: 'verified' | 'pending' | 'expired';
  appliedDate: string;
  documents: string[];
}

const CompanyOnboarding: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: 1,
      name: 'RITCO',
      status: 'pending',
      license: 'verified',
      insurance: 'pending',
      appliedDate: '2024-01-15',
      documents: ['License.pdf', 'Insurance.pdf'],
    },
    {
      id: 2,
      name: 'Horizon Bus',
      status: 'approved',
      license: 'verified',
      insurance: 'verified',
      appliedDate: '2024-01-10',
      documents: ['License.pdf', 'Insurance.pdf'],
    },
    {
      id: 3,
      name: 'Kigali Express',
      status: 'suspended',
      license: 'verified',
      insurance: 'expired',
      appliedDate: '2024-01-05',
      documents: ['License.pdf', 'Insurance.pdf'],
    },
  ]);

  const updateStatus = (id: number, newStatus: 'pending' | 'approved' | 'suspended'): void => {
    setCompanies(companies.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Company Onboarding</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-6 py-4 text-left">Company Name</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">License</th>
              <th className="px-6 py-4 text-left">Insurance</th>
              <th className="px-6 py-4 text-left">Applied Date</th>
              <th className="px-6 py-4 text-left">Documents</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">{company.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(company.status)}`}>
                    {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {company.license === 'verified' ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <AlertCircle size={20} className="text-yellow-600" />
                    )}
                    <span className="text-sm">{company.license}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {company.insurance === 'verified' ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <AlertCircle size={20} className="text-red-600" />
                    )}
                    <span className="text-sm">{company.insurance}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{company.appliedDate}</td>
                <td className="px-6 py-4">
                  <button className="flex items-center gap-2 text-primary hover:underline">
                    <FileText size={18} />
                    View
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {company.status !== 'approved' && (
                      <button
                        onClick={() => updateStatus(company.id, 'approved')}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                      >
                        Approve
                      </button>
                    )}
                    {company.status !== 'suspended' && (
                      <button
                        onClick={() => updateStatus(company.id, 'suspended')}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
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
