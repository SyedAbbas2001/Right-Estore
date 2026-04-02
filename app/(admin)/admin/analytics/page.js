'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faArrowTrendUp, faArrowTrendDown,
  faSpinner, faRotateRight
} from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '@/store';

export default function AdminAnalyticsPage() {
  const { token } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== Build monthly chart data from real orders =====
  const getMonthlyData = () => {
    if (!data?.recentOrders?.length) return [];
    const map = {};
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    data.recentOrders.forEach(order => {
      const d = new Date(order.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map[key]) map[key] = { month: monthNames[d.getMonth()], sales: 0, orders: 0, year: d.getFullYear() };
      map[key].sales += order.total || 0;
      map[key].orders += 1;
    });

    return Object.values(map)
      .sort((a, b) => a.year - b.year || monthNames.indexOf(a.month) - monthNames.indexOf(b.month))
      .slice(-6);
  };

  // ===== Build category data from top products =====
  const getCategoryData = () => {
    if (!data?.topProducts?.length) return [];
    const total = data.topProducts.reduce((a, p) => a + p.revenue, 0);
    const colors = [
      'from-pink-500 to-rose-400',
      'from-amber-400 to-yellow-300',
      'from-blue-400 to-cyan-400',
      'from-purple-500 to-violet-400',
    ];
    return data.topProducts.slice(0, 4).map((p, i) => ({
      name: p._id,
      sold: p.sold,
      revenue: p.revenue,
      percent: total > 0 ? Math.round((p.revenue / total) * 100) : 0,
      color: colors[i] || 'from-gray-400 to-gray-300',
    }));
  };

  const monthlyData = getMonthlyData();
  const maxSales = monthlyData.length ? Math.max(...monthlyData.map(d => d.sales)) : 1;
  const categoryData = getCategoryData();

  // ===== Status breakdown =====
  const getStatusCounts = () => {
    if (!data?.recentOrders) return {};
    const counts = {};
    data.recentOrders.forEach(o => {
      counts[o.orderStatus] = (counts[o.orderStatus] || 0) + 1;
    });
    return counts;
  };
  const statusCounts = getStatusCounts();

  const statusColors = {
    Pending:    'bg-gray-100 text-gray-600',
    Processing: 'bg-amber-100 text-amber-700',
    Shipped:    'bg-blue-100 text-blue-700',
    Delivered:  'bg-green-100 text-green-700',
    Cancelled:  'bg-red-100 text-red-700',
  };

  const kpis = data ? [
    {
      label: 'Total Revenue',
      value: `Rs. ${data.totalRevenue?.toLocaleString() || 0}`,
      sub: 'All time (non-cancelled)',
      up: true,
    },
    {
      label: 'Avg Order Value',
      value: data.totalOrders > 0
        ? `Rs. ${Math.round(data.totalRevenue / data.totalOrders).toLocaleString()}`
        : 'Rs. 0',
      sub: 'Per order average',
      up: true,
    },
    {
      label: 'Total Orders',
      value: data.totalOrders || 0,
      sub: 'All orders placed',
      up: true,
    },
    {
      label: 'Delivered Rate',
      value: data.totalOrders > 0
        ? `${Math.round(((statusCounts.Delivered || 0) / data.totalOrders) * 100)}%`
        : '0%',
      sub: `${statusCounts.Delivered || 0} delivered`,
      up: true,
    },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-2xl text-gray-800">Analytics</h1>
          {data && (
            <span className="text-gray-400 text-sm font-semibold">
              Based on {data.totalOrders} orders
            </span>
          )}
        </div>
        <button onClick={fetchAnalytics} disabled={loading}
          className="flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-800 disabled:opacity-50 transition-colors">
          <FontAwesomeIcon icon={faRotateRight} className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <p className="font-display text-xl text-purple-600">Loading analytics...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="font-bold text-red-600 mb-3">{error}</p>
            <button onClick={fetchAnalytics} className="btn-primary text-sm">Try Again</button>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && data && (
        <div className="p-4 sm:p-6 space-y-6">

          {/* KPI Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
            {kpis.map((kpi, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{kpi.label}</p>
                <p className="font-display text-xl sm:text-2xl text-gray-800 mb-1">{kpi.value}</p>
                <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                  <FontAwesomeIcon icon={faArrowTrendUp} className="w-3 h-3" />
                  {kpi.sub}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">

            {/* Revenue Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="xl:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-soft">
              <h2 className="font-display text-xl text-gray-800 mb-6">
                Revenue Chart
                <span className="text-sm font-semibold text-gray-400 ml-2 font-body">(Last 6 months)</span>
              </h2>

              {monthlyData.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="font-semibold">No order data yet</p>
                    <p className="text-sm">Place some orders to see the chart</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-end gap-2 sm:gap-3 h-48">
                  {monthlyData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <p className="text-[10px] sm:text-xs font-bold text-gray-500 text-center">
                        {d.sales >= 1000
                          ? `${(d.sales / 1000).toFixed(0)}K`
                          : d.sales}
                      </p>
                      <div className="w-full flex items-end justify-center" style={{ height: '130px' }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max((d.sales / maxSales) * 100, 5)}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                          className="w-full rounded-t-xl bg-gradient-to-t from-purple-600 to-pink-500 relative group cursor-pointer hover:opacity-90 transition-opacity"
                          style={{ minHeight: '6px' }}>
                          {/* Tooltip */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {d.orders} orders
                          </div>
                        </motion.div>
                      </div>
                      <p className="text-[10px] sm:text-xs font-bold text-gray-500">{d.month}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Top Products */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-soft">
              <h2 className="font-display text-xl text-gray-800 mb-6">Top Products</h2>

              {categoryData.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">📦</div>
                  <p className="font-semibold text-sm">No sales data yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {categoryData.map((cat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold text-gray-700 truncate max-w-[160px]">{cat.name}</span>
                        <span className="text-xs font-bold text-gray-500 flex-shrink-0 ml-2">{cat.sold} sold</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.percent}%` }}
                          transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                          className={`h-full bg-gradient-to-r ${cat.color} rounded-full`} />
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1">
                        Rs. {cat.revenue?.toLocaleString()} ({cat.percent}%)
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Revenue total */}
              <div className="mt-6 p-4 bg-purple-50 rounded-2xl text-center border border-purple-100">
                <p className="font-display text-2xl sm:text-3xl text-purple-600">
                  Rs. {data.totalRevenue?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-400 font-bold mt-1">Total Revenue</p>
              </div>
            </motion.div>
          </div>

          {/* Order Status Breakdown + Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">

            {/* Status breakdown */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="sm:col-span-2 bg-white rounded-2xl p-5 shadow-soft">
              <h3 className="font-display text-lg text-gray-800 mb-4">Order Status Breakdown</h3>
              {Object.keys(statusCounts).length === 0 ? (
                <p className="text-gray-400 text-sm font-semibold text-center py-4">No orders yet</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <div key={status} className={`rounded-2xl p-3 text-center ${statusColors[status] || 'bg-gray-100 text-gray-600'}`}>
                      <p className="font-display text-2xl">{count}</p>
                      <p className="text-xs font-bold mt-1">{status}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Summary cards */}
            {[
              { emoji: '📦', label: 'Total Orders', value: data.totalOrders || 0, sub: 'All time', color: 'bg-purple-50' },
              { emoji: '👥', label: 'Customers', value: data.totalUsers || 0, sub: 'Registered users', color: 'bg-green-50' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.05 }}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft">
                <h3 className="font-display text-lg text-gray-800 mb-3">{s.label}</h3>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center text-2xl`}>
                    {s.emoji}
                  </div>
                  <div>
                    <p className="font-display text-2xl sm:text-3xl text-purple-600">{s.value}</p>
                    <p className="text-xs text-gray-400 font-semibold">{s.sub}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent orders table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-display text-xl text-gray-800">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm font-bold text-purple-500 hover:underline">
                View All →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[450px]">
                <thead className="bg-gray-50 text-xs font-black text-gray-400 uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-5 py-3">Order ID</th>
                    <th className="text-left px-5 py-3">Customer</th>
                    <th className="text-left px-5 py-3">Date</th>
                    <th className="text-left px-5 py-3">Total</th>
                    <th className="text-left px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.recentOrders?.slice(0, 8).map((order, i) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-bold text-purple-600 text-xs">#{order.orderId}</td>
                      <td className="px-5 py-3 font-semibold text-gray-700 text-sm">{order.customerName}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs font-semibold">
                        {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3 font-black text-gray-800">Rs. {order.total?.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`badge text-[10px] ${
                          order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.orderStatus === 'Processing' ? 'bg-amber-100 text-amber-700' :
                          order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!data.recentOrders?.length && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-gray-400 font-bold">
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      )}
    </div>
  );
}


