import React, { useState } from 'react';
import api from '../api';

interface Props { onLogin: () => void; }

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('admin@twagiyenow.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.user.role !== 'admin') {
        setError('Access denied. Admin only.');
        return;
      }
      localStorage.setItem('admin_token', res.data.token);
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white font-black text-lg">T</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-black">TwagiyeNow</h1>
            <p className="text-xs text-muted">Admin Dashboard</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wide">Email</label>
            <input className="input-field mt-1 w-full" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wide">Password</label>
            <input className="input-field mt-1 w-full" value={password} onChange={e => setPassword(e.target.value)} type="password" required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
