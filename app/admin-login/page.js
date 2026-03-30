'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Demo: admin@kiddyshop.pk / admin123
    if (form.email === 'admin@kiddyshop.pk' && form.password === 'admin123') {
      toast.success('Welcome, Admin! 🎉');
      router.push('/admin');
    } else {
      toast.error('Invalid admin credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #C084FC 0, #C084FC 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-candy-pink to-candy-purple flex items-center justify-center mx-auto mb-4 shadow-candy">
            <FontAwesomeIcon icon={faBagShopping} className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl text-white">KiddyShop Admin</h1>
          <p className="text-gray-500 font-semibold mt-1">Restricted access — Authorized personnel only</p>
        </div>

        <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
          <div className="flex items-center gap-2 bg-gray-700/50 rounded-2xl px-4 py-3 mb-6">
            <FiShield className="text-candy-purple w-4 h-4" />
            <span className="text-gray-400 text-sm font-semibold">Secure Admin Login</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Admin Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@kiddyshop.pk"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-candy-purple font-semibold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-candy-purple font-semibold"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-candy-pink to-candy-purple text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading
                ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating...</>
                : <><FiShield className="w-4 h-4" /> Login to Dashboard</>}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-700/50 rounded-2xl">
            <p className="text-gray-400 text-xs font-semibold text-center">
              Demo credentials: <span className="text-candy-purple">admin@kiddyshop.pk</span> / <span className="text-candy-purple">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
