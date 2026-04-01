'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTableColumns, faBoxOpen, faBagShopping, faTag, faChartBar,
  faGear, faRightFromBracket, faBars, faXmark, faBell,
  faArrowTrendUp, faExternalLink, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';

const nav = [
  { label: 'Dashboard', href: '/admin', icon: faTableColumns },
  { label: 'Products', href: '/admin/products', icon: faBoxOpen },
  { label: 'Orders', href: '/admin/orders', icon: faBagShopping },
  { label: 'Categories', href: '/admin/categories', icon: faTag },
  { label: 'Analytics', href: '/admin/analytics', icon: faChartBar },
];

const statusColors = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-amber-100 text-amber-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Pending: 'bg-gray-100 text-gray-600',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const { token, user, logout } = useAuthStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { router.push('/admin-login'); return; }
    fetchAnalytics();
  }, [token]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setAnalytics(data);
    } catch { }
    finally { setLoading(false); }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin-login');
  };

  const statCards = analytics ? [
    { label: 'Total Revenue', value: `Rs. ${analytics.totalRevenue?.toLocaleString() || 0}`, emoji: '💰', color: 'from-pink-500 to-rose-500' },
    { label: 'Total Orders', value: analytics.totalOrders || 0, emoji: '📦', color: 'from-purple-500 to-violet-600' },
    { label: 'Products', value: analytics.totalProducts || 0, emoji: '🛍️', color: 'from-blue-400 to-cyan-500' },
    { label: 'Customers', value: analytics.totalUsers || 0, emoji: '👥', color: 'from-emerald-400 to-teal-500' },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>
        <div className="p-5 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xl">🧸</div>
            <div>
              <span className="font-display text-xl text-white">Right Estore</span>
              <p className="text-gray-500 text-xs font-semibold">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map(({ label, href, icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
              <FontAwesomeIcon icon={icon} className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-black">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">{user?.name || 'Admin'}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors font-bold">
            <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100">
              <FontAwesomeIcon icon={sidebarOpen ? faXmark : faBars} className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="font-display text-xl sm:text-2xl text-gray-800">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/products" target="_blank" className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2 flex items-center gap-1.5">
              View Store <FontAwesomeIcon icon={faExternalLink} className="w-3 h-3" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <FontAwesomeIcon icon={faSpinner} className="w-10 h-10 text-purple-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
                {statCards.map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl sm:text-2xl mb-3`}>
                      {stat.emoji}
                    </div>
                    <p className="text-gray-500 text-xs font-bold mb-1">{stat.label}</p>
                    <p className="font-display text-xl sm:text-2xl text-gray-800">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent orders */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="xl:col-span-2 bg-white rounded-2xl shadow-soft overflow-hidden">
                  <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="font-display text-lg sm:text-xl text-gray-800">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-sm font-bold text-purple-500 hover:underline">View All →</Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[400px]">
                      <thead className="bg-gray-50 text-xs font-black text-gray-400 uppercase tracking-wide">
                        <tr>
                          <th className="text-left px-5 py-3">Order</th>
                          <th className="text-left px-5 py-3">Customer</th>
                          <th className="text-left px-5 py-3">Total</th>
                          <th className="text-left px-5 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {(analytics?.recentOrders || []).slice(0, 6).map((order, i) => (
                          <tr key={order._id} className="hover:bg-gray-50">
                            <td className="px-5 py-3">
                              <p className="font-bold text-gray-800 text-xs">#{order.orderId}</p>
                              <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-PK')}</p>
                            </td>
                            <td className="px-5 py-3 font-semibold text-gray-700 text-sm">{order.customerName}</td>
                            <td className="px-5 py-3 font-black text-purple-600 text-sm">Rs. {order.total?.toLocaleString()}</td>
                            <td className="px-5 py-3">
                              <span className={`badge text-[10px] ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span>
                            </td>
                          </tr>
                        ))}
                        {(!analytics?.recentOrders?.length) && (
                          <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400 font-bold">No orders yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Top products */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                  className="bg-white rounded-2xl shadow-soft">
                  <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="font-display text-lg sm:text-xl text-gray-800">Top Products</h2>
                    <Link href="/admin/products" className="text-sm font-bold text-purple-500 hover:underline">All →</Link>
                  </div>
                  <div className="p-5 space-y-4">
                    {(analytics?.topProducts || []).map((p, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-xs truncate">{p._id}</p>
                          <p className="text-xs text-gray-400 font-semibold">{p.sold} sold</p>
                          <div className="mt-1 h-1.5 bg-gray-100 rounded-full">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((p.sold / 50) * 100, 100)}%` }}
                              transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                              className="h-full bg-gradient-to-r from-pink-400 to-purple-600 rounded-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                    {!analytics?.topProducts?.length && (
                      <p className="text-center text-gray-400 font-bold text-sm py-4">No data yet</p>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Quick actions */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                className="bg-white rounded-2xl shadow-soft p-5">
                <h2 className="font-display text-lg sm:text-xl text-gray-800 mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                  <Link href="/admin/products" className="btn-primary text-sm">+ Add Product</Link>
                  <Link href="/admin/orders" className="btn-secondary text-sm">📋 Manage Orders</Link>
                  <Link href="/admin/categories" className="btn-outline text-sm">🏷️ Categories</Link>
                  <Link href="/admin/analytics" className="btn-outline text-sm">📊 Analytics</Link>
                </div>
              </motion.div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
