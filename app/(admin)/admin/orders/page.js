'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMagnifyingGlass, faEye, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';

const statusColors = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-amber-100 text-amber-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Pending: 'bg-gray-100 text-gray-600',
  Cancelled: 'bg-red-100 text-red-700',
};
const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const filtered = orders.filter(o => {
    const matchSearch = o.customerName?.toLowerCase().includes(search.toLowerCase()) || o.orderId?.includes(search);
    const matchFilter = filter === 'all' || o.orderStatus?.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = async (orderId, orderStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      setOrders(p => p.map(o => o.orderId === orderId ? { ...o, orderStatus } : o));
      if (selected?.orderId === orderId) setSelected(p => ({ ...p, orderStatus }));
      toast.success(`Status → ${orderStatus}`);
    } catch { toast.error('Update failed'); }
    finally { setUpdating(false); }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-3">
        <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
        </Link>
        <h1 className="font-display text-2xl text-gray-800">Orders</h1>
        <span className="bg-purple-100 text-purple-600 font-black text-xs px-2 py-1 rounded-full">{orders.length}</span>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search by customer or order ID..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 text-sm font-semibold" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', ...statuses.map(s => s.toLowerCase())].map(f => (
              <motion.button key={f} whileTap={{ scale: 0.95 }} onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-black capitalize transition-all ${filter === f ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                {f}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Table */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-soft overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead className="bg-gray-50 text-xs font-black text-gray-400 uppercase tracking-wide">
                    <tr>
                      <th className="text-left px-5 py-3">Order</th>
                      <th className="text-left px-5 py-3">Customer</th>
                      <th className="text-left px-5 py-3">Total</th>
                      <th className="text-left px-5 py-3">Status</th>
                      <th className="text-left px-5 py-3">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((order, i) => (
                      <motion.tr key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        onClick={() => setSelected(order)}
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${selected?._id === order._id ? 'bg-purple-50' : ''}`}>
                        <td className="px-5 py-3">
                          <p className="font-bold text-gray-800 text-sm">#{order.orderId}</p>
                          <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-PK')}</p>
                        </td>
                        <td className="px-5 py-3">
                          <p className="font-semibold text-gray-700 text-sm">{order.customerName}</p>
                          <p className="text-xs text-gray-400">{order.items?.length} items</p>
                        </td>
                        <td className="px-5 py-3 font-black text-purple-600 text-sm">Rs. {order.total?.toLocaleString()}</td>
                        <td className="px-5 py-3">
                          <span className={`badge text-[10px] ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span>
                        </td>
                        <td className="px-5 py-3">
                          <button className="p-2 rounded-lg text-purple-500 hover:bg-purple-50">
                            <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">📦</div>
                    <p className="font-bold text-gray-500">{orders.length === 0 ? 'No orders yet' : 'No orders match filter'}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div>
            {selected ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-soft p-5">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="font-display text-xl text-gray-800">#{selected.orderId}</h3>
                    <p className="text-gray-400 text-sm font-semibold">
                      {new Date(selected.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`badge ${statusColors[selected.orderStatus]}`}>{selected.orderStatus}</span>
                </div>

                <div className="space-y-3 mb-5 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 font-black uppercase">Customer</p>
                    <p className="font-bold text-gray-800">{selected.customerName}</p>
                    <p className="text-gray-500 font-semibold">{selected.customerEmail}</p>
                    <p className="text-gray-500 font-semibold">{selected.shippingAddress?.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-black uppercase">Address</p>
                    <p className="font-semibold text-gray-700">
                      {selected.shippingAddress?.address}, {selected.shippingAddress?.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-black uppercase">Items ({selected.items?.length})</p>
                    {selected.items?.map((item, i) => (
                      <p key={i} className="text-gray-600 font-semibold text-xs">• {item.name} × {item.quantity}</p>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-purple-600">Rs. {selected.total?.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-black uppercase mb-2">Update Status</p>
                  <div className="space-y-2">
                    {statuses.map(s => (
                      <motion.button key={s} whileTap={{ scale: 0.97 }} disabled={updating}
                        onClick={() => updateStatus(selected.orderId, s)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between disabled:opacity-60 ${selected.orderStatus === s ? 'bg-purple-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-700'}`}>
                        {s}
                        {selected.orderStatus === s && <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5" />}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
                <div className="text-4xl mb-3">👆</div>
                <p className="font-bold text-gray-400">Click an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
