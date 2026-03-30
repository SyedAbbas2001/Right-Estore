'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTableColumns, faBoxOpen, faBagShopping, faTag, faChartBar,
  faGear, faRightFromBracket, faBars, faXmark, faBell,
  faArrowTrendUp, faArrowTrendDown, faExternalLink, faMoneyBillTrendUp, faUsers
} from '@fortawesome/free-solid-svg-icons';

const nav = [
  { label: 'Dashboard', href: '/admin', icon: faTableColumns },
  { label: 'Products', href: '/admin/products', icon: faBoxOpen },
  { label: 'Orders', href: '/admin/orders', icon: faBagShopping },
  { label: 'Categories', href: '/admin/categories', icon: faTag },
  { label: 'Analytics', href: '/admin/analytics', icon: faChartBar },
  { label: 'Settings', href: '/admin/settings', icon: faGear },
];

const stats = [
  { label: 'Total Revenue', value: 'Rs. 2,45,890', change: '+18%', up: true, color: 'from-pink-500 to-rose-500', icon: faMoneyBillTrendUp },
  { label: 'Orders Today', value: '47', change: '+12%', up: true, color: 'from-purple-500 to-violet-600', icon: faBoxOpen },
  { label: 'Total Products', value: '234', change: '+5', up: true, color: 'from-blue-400 to-cyan-500', icon: faShoppingBag },
  { label: 'New Customers', value: '89', change: '+23%', up: true, color: 'from-emerald-400 to-teal-500', icon: faUsers },
];

const recentOrders = [
  { id: 'KS001234', customer: 'Sara Ahmed', items: 3, total: 5698, status: 'Processing', date: 'Today, 10:30am' },
  { id: 'KS001233', customer: 'Omar Khan', items: 1, total: 2799, status: 'Shipped', date: 'Today, 9:15am' },
  { id: 'KS001232', customer: 'Fatima Ali', items: 5, total: 8490, status: 'Delivered', date: 'Yesterday' },
  { id: 'KS001231', customer: 'Bilal Raza', items: 2, total: 3298, status: 'Pending', date: 'Yesterday' },
  { id: 'KS001230', customer: 'Amina Siddiqui', items: 4, total: 6797, status: 'Delivered', date: '2 days ago' },
];

const topProducts = [
  { name: 'Rainbow Unicorn Dress', sold: 124, stock: 25 },
  { name: 'Plush Bunny Best Friend', sold: 98, stock: 100 },
  { name: 'Wooden Rainbow Stacking Toy', sold: 87, stock: 28 },
  { name: 'Cloud Soft Onesie Set', sold: 76, stock: 60 },
];

const statusColors = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-amber-100 text-amber-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Pending: 'bg-gray-100 text-gray-600',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>
        <div className="p-5 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faTableColumns} className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display text-xl text-white">KiddyShop</span>
              <p className="text-gray-500 text-xs font-semibold">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map(({ label, href, icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                pathname === href
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-purple-400 border border-purple-500/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}>
              <FontAwesomeIcon icon={icon} className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-black">A</div>
            <div>
              <p className="text-white font-bold text-sm">Admin User</p>
              <p className="text-gray-500 text-xs">admin@kiddyshop.pk</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors font-bold">
            <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" /> Logout
          </Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100">
              <FontAwesomeIcon icon={sidebarOpen ? faXmark : faBars} className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="font-display text-xl sm:text-2xl text-gray-800">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-gray-100">
              <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
            </button>
            <Link href="/products" target="_blank"
              className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2 flex items-center gap-1.5">
              View Store <FontAwesomeIcon icon={faExternalLink} className="w-3 h-3" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl sm:text-2xl mb-3`}>
                  <FontAwesomeIcon icon={stat.icon} className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <p className="text-gray-500 text-xs font-bold mb-1">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="font-display text-xl sm:text-2xl text-gray-800">{stat.value}</p>
                  <span className={`text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-full flex items-center gap-1 ${stat.up ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                    <FontAwesomeIcon icon={stat.up ? faArrowTrendUp : faArrowTrendDown} className="w-2.5 h-2.5" />
                    {stat.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
            {/* Orders table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="xl:col-span-2 bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-display text-lg sm:text-xl text-gray-800">Recent Orders</h2>
                <Link href="/admin/orders" className="text-sm font-bold text-purple-500 hover:underline">View All →</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead className="bg-gray-50 text-xs font-black text-gray-400 uppercase tracking-wide">
                    <tr>
                      <th className="text-left px-5 py-3">Order</th>
                      <th className="text-left px-5 py-3">Customer</th>
                      <th className="text-left px-5 py-3">Total</th>
                      <th className="text-left px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentOrders.map((order, i) => (
                      <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.06 }}
                        className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-bold text-gray-800">#{order.id}</p>
                          <p className="text-xs text-gray-400">{order.date}</p>
                        </td>
                        <td className="px-5 py-3 font-semibold text-gray-700">{order.customer}</td>
                        <td className="px-5 py-3 font-black text-purple-600">Rs. {order.total.toLocaleString()}</td>
                        <td className="px-5 py-3">
                          <span className={`badge text-[10px] ${statusColors[order.status]}`}>{order.status}</span>
                        </td>
                      </motion.tr>
                    ))}
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
                {topProducts.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-xs sm:text-sm truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 font-semibold">{p.sold} sold • {p.stock} in stock</p>
                      <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(p.sold / 130) * 100}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-pink-400 to-purple-600 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="bg-white rounded-2xl shadow-soft p-5">
            <h2 className="font-display text-lg sm:text-xl text-gray-800 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { label: '+ Add Product', href: '/admin/products', style: 'btn-primary text-sm' },
                { label: '📋 Manage Orders', href: '/admin/orders', style: 'btn-secondary text-sm' },
                { label: '🏷️ Categories', href: '/admin/categories', style: 'btn-outline text-sm' },
                { label: '📊 Analytics', href: '/admin/analytics', style: 'btn-outline text-sm' },
              ].map(({ label, href, style }) => (
                <Link key={href} href={href} className={style}>{label}</Link>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
