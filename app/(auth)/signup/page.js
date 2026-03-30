'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faPhone, faEye, faEyeSlash, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!agree) { toast.error('Please agree to terms'); return; }
    if (form.password !== form.confirm) { toast.error("Passwords don't match!"); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Account created! Welcome to Right Estore 🎉');
    router.push('/');
    setLoading(false);
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : form.password.length < 14 ? 3 : 4;
  const strengthColors = ['bg-gray-200', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-green-400'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {['🌸', '🎀', '💜', '⭐', '🌟'].map((e, i) => (
        <motion.div key={i} animate={{ y: [0, -18, 0], rotate: [0, 8, -4, 0] }}
          transition={{ duration: 4.5 + i, repeat: Infinity, delay: i * 0.6 }}
          className="absolute text-3xl sm:text-4xl opacity-20 pointer-events-none select-none"
          style={{ top: `${12 + i * 17}%`, left: i % 2 === 0 ? `${3 + i * 2}%` : undefined, right: i % 2 !== 0 ? `${3 + i * 3}%` : undefined }}>
          {e}
        </motion.div>
      ))}

      <div className="w-full max-w-md relative">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-2xl shadow-lg">🧸</div>
            <span className="font-display text-3xl text-gray-800">Kiddy<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Shop</span></span>
          </Link>
          <p className="text-gray-500 font-semibold mt-2 text-sm">Join thousands of happy parents! 💕</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-2xl shadow-pink-100 p-7 sm:p-8">
          <h1 className="font-display text-3xl text-gray-800 mb-6 text-center">Create Account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Full Name', icon: faUser, type: 'text', placeholder: 'Sara Ahmed' },
              { key: 'email', label: 'Email Address', icon: faEnvelope, type: 'email', placeholder: 'sara@example.com' },
              { key: 'phone', label: 'Phone Number', icon: faPhone, type: 'tel', placeholder: '+92 300 1234567' },
            ].map(({ key, label, icon, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-wide">{label}</label>
                <div className="relative">
                  <FontAwesomeIcon icon={icon} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder} className="input-field pl-11" required />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Minimum 8 characters" className="input-field pl-11 pr-11" required />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <FontAwesomeIcon icon={show ? faEyeSlash : faEye} className="w-4 h-4" />
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < strength ? strengthColors[strength] : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className={`text-xs font-bold mt-1 ${['', 'text-red-400', 'text-amber-400', 'text-blue-500', 'text-green-500'][strength]}`}>
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-wide">Confirm Password</label>
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  placeholder="Re-enter password"
                  className={`input-field pl-11 ${form.confirm && form.password !== form.confirm ? 'border-red-300' : ''}`} required />
              </div>
              {form.confirm && form.password !== form.confirm && (
                <p className="text-xs text-red-500 font-bold mt-1">Passwords don't match</p>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="w-4 h-4 accent-purple-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-semibold text-gray-600">
                I agree to the <Link href="/terms" className="text-purple-600 font-black hover:underline">Terms</Link> and <Link href="/privacy" className="text-purple-600 font-black hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-4 justify-center text-base disabled:opacity-70">
              {loading
                ? 'Creating Account...'
                : <><FontAwesomeIcon icon={faUserPlus} className="w-4 h-4 mr-2" />Create My Account 🌟</>}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 font-semibold mt-5 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-600 font-black hover:underline">Login →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
