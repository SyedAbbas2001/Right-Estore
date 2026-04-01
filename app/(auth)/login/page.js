'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useAuthStore } from '@/store';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      router.push(result.user.role === 'admin' ? '/admin' : '/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {['🌟', '🎀', '✨', '⭐', '🎈'].map((e, i) => (
        <motion.div key={i} animate={{ y: [0, -20, 0], rotate: [0, 10, -5, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.7 }}
          className="absolute text-4xl opacity-20 pointer-events-none select-none"
          style={{ top: `${10 + i * 18}%`, left: i % 2 === 0 ? `${5 + i * 3}%` : undefined, right: i % 2 !== 0 ? `${5 + i * 4}%` : undefined }}>
          {e}
        </motion.div>
      ))}

      <div className="w-full max-w-md relative">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-2xl shadow-lg">🧸</div>
            <span className="font-display text-3xl text-gray-800">Right <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Estore</span></span>
          </Link>
          <p className="text-gray-500 font-semibold mt-2 text-sm">Welcome back! Shop for little ones 🌟</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-2xl shadow-purple-100 p-7 sm:p-8">
          <h1 className="font-display text-3xl text-gray-800 mb-6 text-center">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="sara@example.com" className="input-field pl-11" required />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-black text-gray-600 uppercase tracking-wide">Password</label>
                <Link href="#" className="text-xs font-bold text-purple-500 hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••" className="input-field pl-11 pr-11" required />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <FontAwesomeIcon icon={show ? faEyeSlash : faEye} className="w-4 h-4" />
                </button>
              </div>
            </div>

            <motion.button type="submit" disabled={isLoading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-4 justify-center text-base disabled:opacity-70 mt-2">
              {isLoading
                ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Logging in...</>
                : <><FontAwesomeIcon icon={faRightToBracket} className="w-4 h-4 mr-2" />Login</>}
            </motion.button>
          </form>

          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs font-semibold">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:border-red-300 hover:text-red-500 transition-all">
              <FontAwesomeIcon icon={faGoogle} className="w-4 h-4" /> Google
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:border-blue-300 hover:text-blue-500 transition-all">
              <FontAwesomeIcon icon={faFacebook} className="w-4 h-4" /> Facebook
            </motion.button>
          </div>

          <p className="text-center text-gray-500 font-semibold mt-5 text-sm">
            No account?{' '}
            <Link href="/signup" className="text-purple-600 font-black hover:underline">Sign Up Free →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
