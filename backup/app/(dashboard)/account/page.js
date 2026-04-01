'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faBoxOpen, faLocationDot, faShieldHalved, faRightFromBracket,
  faPenToSquare, faCheck, faPlus, faTrash
} from '@fortawesome/free-solid-svg-icons';

const orders = [
  { id: 'KS123456', date: '2024-11-20', status: 'Delivered', total: 5698, items: 3 },
  { id: 'KS123455', date: '2024-11-10', status: 'Processing', total: 2799, items: 1 },
  { id: 'KS123454', date: '2024-10-28', status: 'Delivered', total: 4297, items: 2 },
];

const statusColors = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-amber-100 text-amber-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const tabs = [
  { id: 'profile', label: 'Profile', icon: faUser },
  { id: 'orders', label: 'Orders', icon: faBoxOpen },
  { id: 'addresses', label: 'Addresses', icon: faLocationDot },
  { id: 'security', label: 'Security', icon: faShieldHalved },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [edit, setEdit] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Sara Ahmed', email: 'sara@example.com', phone: '+92 321 1234567', dob: '1990-05-15',
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {['✨','⭐','🌟'].map((e,i) => (
              <div key={i} className="absolute text-5xl" style={{top:`${20+i*30}%`, right:`${5+i*15}%`}}>{e}</div>
            ))}
          </div>
          <div className="flex items-center gap-4 sm:gap-5 relative">
            <motion.div whileHover={{ scale: 1.05 }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 flex items-center justify-center font-display text-3xl sm:text-4xl text-white ring-4 ring-white/30 flex-shrink-0">
              {profile.name.charAt(0)}
            </motion.div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl text-white">{profile.name}</h1>
              <p className="text-white/80 font-semibold text-sm">{profile.email}</p>
              <div className="flex items-center gap-2 sm:gap-3 mt-2 flex-wrap">
                <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-bold text-white">⭐ Premium Member</span>
                <span className="text-white/60 text-xs font-semibold">Since Nov 2024</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl shadow-soft p-3 space-y-1">
              {tabs.map(({ id, label, icon }) => (
                <motion.button key={id} onClick={() => setActiveTab(id)} whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === id
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-purple-600'
                  }`}>
                  <FontAwesomeIcon icon={icon} className="w-4 h-4" />
                  {label}
                </motion.button>
              ))}
              <div className="border-t border-gray-100 pt-1 mt-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-50 transition-colors">
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

                {activeTab === 'profile' && (
                  <div className="bg-white rounded-3xl shadow-soft p-5 sm:p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-display text-xl sm:text-2xl text-gray-800">Personal Information</h2>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setEdit(!edit)}
                        className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all ${edit ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white'}`}>
                        <FontAwesomeIcon icon={edit ? faCheck : faPenToSquare} className="w-3 h-3" />
                        {edit ? 'Save' : 'Edit'}
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      {[
                        { label: 'Full Name', key: 'name' },
                        { label: 'Email Address', key: 'email', type: 'email' },
                        { label: 'Phone Number', key: 'phone', type: 'tel' },
                        { label: 'Date of Birth', key: 'dob', type: 'date' },
                      ].map(({ label, key, type = 'text' }) => (
                        <div key={key}>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-wide mb-2">{label}</label>
                          {edit
                            ? <input type={type} value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} className="input-field text-sm" />
                            : <p className="font-bold text-gray-800 py-3 px-4 bg-gray-50 rounded-2xl text-sm">{profile[key]}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="bg-white rounded-3xl shadow-soft p-5 sm:p-6">
                    <h2 className="font-display text-xl sm:text-2xl text-gray-800 mb-5">Order History</h2>
                    <div className="space-y-4">
                      {orders.map((order, i) => (
                        <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                          className="border border-gray-100 rounded-2xl p-4 hover:border-purple-200 transition-colors">
                          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                            <div>
                              <p className="font-black text-gray-800 text-sm">#{order.id}</p>
                              <p className="text-xs text-gray-400 font-semibold">{order.date} • {order.items} items</p>
                            </div>
                            <div className="text-right">
                              <span className={`badge text-xs ${statusColors[order.status]}`}>{order.status}</span>
                              <p className="font-display text-lg text-purple-600 mt-1">Rs. {order.total.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="btn-outline text-xs py-1.5 px-3">View Details</button>
                            {order.status === 'Delivered' && <button className="text-xs font-bold text-purple-500 hover:underline">Reorder</button>}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div className="bg-white rounded-3xl shadow-soft p-5 sm:p-6">
                    <div className="flex justify-between items-center mb-5">
                      <h2 className="font-display text-xl sm:text-2xl text-gray-800">Saved Addresses</h2>
                      <button className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faPlus} className="w-3 h-3" /> Add New
                      </button>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: 'Home', address: 'House 12, Street 5, DHA Phase 6', city: 'Karachi, Sindh', default: true },
                        { label: 'Office', address: 'Plot 34, Block B, Clifton', city: 'Karachi, Sindh', default: false },
                      ].map((a, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                          className={`border-2 rounded-2xl p-4 ${a.default ? 'border-purple-400 bg-purple-50/50' : 'border-gray-200'}`}>
                          <div className="flex justify-between mb-2 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-gray-800 text-sm">{a.label}</span>
                              {a.default && <span className="badge bg-purple-600 text-[10px]">Default</span>}
                            </div>
                            <div className="flex gap-2">
                              <button className="text-xs font-bold text-purple-500 hover:underline">Edit</button>
                              <button className="text-xs font-bold text-red-400 hover:underline">Delete</button>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-gray-700">{a.address}</p>
                          <p className="text-sm text-gray-400 font-semibold">{a.city}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="bg-white rounded-3xl shadow-soft p-5 sm:p-6">
                    <h2 className="font-display text-xl sm:text-2xl text-gray-800 mb-5">Security Settings</h2>
                    <div className="space-y-4 max-w-md">
                      {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                        <div key={label}>
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-2">{label}</label>
                          <input type="password" placeholder="••••••••" className="input-field" />
                        </div>
                      ))}
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="btn-primary px-6">Update Password</motion.button>
                    </div>
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
