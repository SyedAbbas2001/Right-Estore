'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faBoxOpen, faLocationDot, faShieldHalved, faRightFromBracket,
  faPenToSquare, faCheck, faPlus, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';

const statusColors = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-amber-100 text-amber-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-red-100 text-red-700',
  Pending: 'bg-gray-100 text-gray-600',
};

const tabs = [
  { id: 'profile', label: 'Profile', icon: faUser },
  { id: 'orders', label: 'Orders', icon: faBoxOpen },
  { id: 'addresses', label: 'Addresses', icon: faLocationDot },
  { id: 'security', label: 'Security', icon: faShieldHalved },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, token, setUser, logout, clearAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [edit, setEdit] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    setProfile({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch { toast.error('Failed to load orders'); }
    finally { setOrdersLoading(false); }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: profile.name, phone: profile.phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUser(data.user, token);
      setEdit(false);
      toast.success('Profile updated! ✅');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const changePassword = async e => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) { toast.error("Passwords don't match"); return; }
    if (passwords.newPass.length < 8) { toast.error('Password must be 8+ characters'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Password updated! ✅');
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <FontAwesomeIcon icon={faSpinner} className="w-10 h-10 text-purple-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 text-5xl flex items-center justify-around pointer-events-none">
            {['✨','⭐','🌟'].map((e,i) => <span key={i}>{e}</span>)}
          </div>
          <div className="flex items-center gap-4 sm:gap-5 relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 flex items-center justify-center font-display text-3xl sm:text-4xl text-white ring-4 ring-white/30 flex-shrink-0">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl text-white">{user.name}</h1>
              <p className="text-white/80 font-semibold text-sm">{user.email}</p>
              <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-bold text-white mt-2 inline-block">
                {user.role === 'admin' ? '👑 Admin' : '⭐ Member'}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl shadow-soft p-3 space-y-1">
              {tabs.map(({ id, label, icon }) => (
                <motion.button key={id} onClick={() => setActiveTab(id)} whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === id ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-purple-600'}`}>
                  <FontAwesomeIcon icon={icon} className="w-4 h-4" /> {label}
                </motion.button>
              ))}
              <div className="border-t border-gray-100 pt-1 mt-1">
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-50 transition-colors">
                  <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

                {/* Profile */}
                {activeTab === 'profile' && (
                  <div className="bg-white rounded-3xl shadow-soft p-5 sm:p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-display text-xl sm:text-2xl text-gray-800">Personal Information</h2>
                      <motion.button whileTap={{ scale: 0.95 }}
                        onClick={() => edit ? saveProfile() : setEdit(true)}
                        disabled={saving}
                        className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-60 ${edit ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white'}`}>
                        <FontAwesomeIcon icon={saving ? faSpinner : edit ? faCheck : faPenToSquare}
                          className={`w-3 h-3 ${saving ? 'animate-spin' : ''}`} />
                        {saving ? 'Saving...' : edit ? 'Save' : 'Edit'}
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      {[
                        { label: 'Full Name', key: 'name', type: 'text' },
                        { label: 'Phone Number', key: 'phone', type: 'tel' },
                      ].map(({ label, key, type }) => (
                        <div key={key}>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-wide mb-2">{label}</label>
                          {edit
                            ? <input type={type} value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} className="input-field text-sm" />
                            : <p className="font-bold text-gray-800 py-3 px-4 bg-gray-50 rounded-2xl text-sm">{profile[key] || '—'}</p>}
                        </div>
                      ))}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-wide mb-2">Email Address</label>
                        <p className="font-bold text-gray-800 py-3 px-4 bg-gray-50 rounded-2xl text-sm">{user.email}</p>
                        <p className="text-xs text-gray-400 mt-1 font-semibold">Email cannot be changed</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders */}
                {activeTab === 'orders' && (
                  <div className="bg-white rounded-3xl shadow-soft p-5 sm:p-6">
                    <h2 className="font-display text-xl sm:text-2xl text-gray-800 mb-5">Order History</h2>
                    {ordersLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-purple-500 animate-spin" />
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="font-display text-xl text-gray-600 mb-3">No orders yet</h3>
                        <Link href="/products" className="btn-primary text-sm">Start Shopping ✨</Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order, i) => (
                          <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            className="border border-gray-100 rounded-2xl p-4 hover:border-purple-200 transition-colors">
                            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                              <div>
                                <p className="font-black text-gray-800 text-sm">#{order.orderId}</p>
                                <p className="text-xs text-gray-400 font-semibold">
                                  {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })} • {order.items?.length} items
                                </p>
                              </div>
                              <div className="text-right">
                                <span className={`badge text-xs ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>{order.orderStatus}</span>
                                <p className="font-display text-lg text-purple-600 mt-1">Rs. {order.total?.toLocaleString()}</p>
                              </div>
                            </div>
                            {/* Items preview */}
                            <div className="flex gap-2 flex-wrap mb-3">
                              {order.items?.slice(0, 3).map((item, j) => (
                                <div key={j} className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-2 py-1">
                                  {item.image && <img src={item.image} alt="" className="w-6 h-6 rounded-lg object-cover" />}
                                  <span className="text-xs font-semibold text-gray-600 truncate max-w-[100px]">{item.name}</span>
                                </div>
                              ))}
                              {order.items?.length > 3 && <span className="text-xs font-bold text-purple-500">+{order.items.length - 3} more</span>}
                            </div>
                            <div className="flex gap-2">
                              <button className="btn-outline text-xs py-1.5 px-3">View Details</button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Addresses */}
                {activeTab === 'addresses' && (
                  <div className="bg-white rounded-3xl shadow-soft p-5 sm:p-6">
                    <div className="flex justify-between items-center mb-5">
                      <h2 className="font-display text-xl sm:text-2xl text-gray-800">Saved Addresses</h2>
                    </div>
                    {user.addresses?.length === 0 || !user.addresses ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📍</div>
                        <p className="font-bold text-gray-500 mb-3">No saved addresses</p>
                        <p className="text-gray-400 text-sm font-semibold">Addresses are saved automatically when you place an order</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {user.addresses.map((a, i) => (
                          <div key={i} className={`border-2 rounded-2xl p-4 ${a.isDefault ? 'border-purple-400 bg-purple-50/50' : 'border-gray-200'}`}>
                            <div className="flex justify-between mb-2 flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-gray-800 text-sm">{a.label || 'Address'}</span>
                                {a.isDefault && <span className="badge bg-purple-600 text-[10px]">Default</span>}
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">{a.address}</p>
                            <p className="text-sm text-gray-400 font-semibold">{a.city}, {a.province}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Security */}
                {activeTab === 'security' && (
                  <div className="bg-white rounded-3xl shadow-soft p-5 sm:p-6">
                    <h2 className="font-display text-xl sm:text-2xl text-gray-800 mb-5">Change Password</h2>
                    <form onSubmit={changePassword} className="space-y-4 max-w-md">
                      {[
                        { label: 'Current Password', key: 'current', placeholder: '••••••••' },
                        { label: 'New Password', key: 'newPass', placeholder: 'Min 8 characters' },
                        { label: 'Confirm New Password', key: 'confirm', placeholder: 'Re-enter new password' },
                      ].map(({ label, key, placeholder }) => (
                        <div key={key}>
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-2">{label}</label>
                          <input type="password" value={passwords[key]}
                            onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                            placeholder={placeholder} className="input-field" required />
                        </div>
                      ))}
                      <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className="btn-primary px-6 disabled:opacity-70 flex items-center gap-2">
                        {saving ? <><FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />Updating...</> : 'Update Password'}
                      </motion.button>
                    </form>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
