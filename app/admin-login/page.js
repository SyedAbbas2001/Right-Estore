'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '@/store';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) {
      if (result.user.role !== 'admin') {
        setError('Access denied. Admin only.');
        return;
      }
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #A855F7 0, #A855F7 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

      <div className="w-full max-w-md relative">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">🧸</div>
          <h1 className="font-display text-3xl text-white">Right Estore Admin</h1>
          <p className="text-gray-500 font-semibold mt-1 text-sm">Authorized personnel only</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gray-900 rounded-3xl p-7 sm:p-8 shadow-2xl border border-gray-800">

          <div className="flex items-center gap-2 bg-gray-800/60 rounded-2xl px-4 py-3 mb-6">
            <FontAwesomeIcon icon={faShieldHalved} className="text-purple-400 w-4 h-4" />
            <span className="text-gray-400 text-sm font-semibold">Secure Admin Login</span>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/30 text-red-400 text-sm font-bold px-4 py-3 rounded-2xl mb-4">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-black text-gray-300 mb-2">Admin Email</label>
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@rightestore.pk"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 font-semibold text-sm" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-black text-gray-300 mb-2">Password</label>
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 font-semibold text-sm" required />
              </div>
            </div>
            <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black py-4 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
              {isLoading
                ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating...</>
                : <><FontAwesomeIcon icon={faShieldHalved} className="w-4 h-4" /> Login to Dashboard</>}
            </motion.button>
          </form>

          <div className="mt-6 p-4 bg-gray-800/50 rounded-2xl text-center">
            <p className="text-gray-500 text-xs font-semibold">
              First time? Run <span className="text-purple-400 font-black">POST /api/seed</span> to create admin account
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
