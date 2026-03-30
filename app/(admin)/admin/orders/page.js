'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiSearch, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

const mockOrders = [
  { id: 'KS001234', customer: 'Sara Ahmed', email: 'sara@example.com', phone: '+92 321 1234567', items: 3, total: 5698, status: 'Processing', date: '2024-11-20', payment: 'COD', address: 'House 12, DHA Phase 6, Karachi' },
  { id: 'KS001233', customer: 'Omar Khan', email: 'omar@example.com', phone: '+92 300 7654321', items: 1, total: 2799, status: 'Shipped', date: '2024-11-19', payment: 'Card', address: '45 Gulshan-e-Iqbal, Karachi' },
  { id: 'KS001232', customer: 'Fatima Ali', email: 'fatima@example.com', phone: '+92 333 9876543', items: 5, total: 8490, status: 'Delivered', date: '2024-11-18', payment: 'COD', address: 'Block 7, PECHS, Karachi' },
  { id: 'KS001231', customer: 'Bilal Raza', email: 'bilal@example.com', phone: '+92 312 5551234', items: 2, total: 3298, status: 'Pending', date: '2024-11-17', payment: 'Card', address: 'Johar Town, Lahore' },
  { id: 'KS001230', customer: 'Amina Siddiqui', email: 'amina@example.com', phone: '+92 345 6789012', items: 4, total: 6797, status: 'Delivered', date: '2024-11-15', payment: 'COD', address: 'F-7, Islamabad' },
  { id: 'KS001229', customer: 'Hassan Malik', email: 'hassan@example.com', phone: '+92 321 3456789', items: 2, total: 3598, status: 'Cancelled', date: '2024-11-14', payment: 'Card', address: 'Model Town, Lahore' },
];

const statusColors = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-amber-100 text-amber-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Pending: 'bg-gray-100 text-gray-600',
  Cancelled: 'bg-red-100 text-red-700',
};

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = orders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    const matchFilter = filter === 'all' || o.status.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (selectedOrder?.id === id) setSelectedOrder(prev => ({ ...prev, status }));
    toast.success(`Order status updated to ${status}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display text-2xl text-gray-800">Orders</h1>
        <span className="bg-pastel-purple text-candy-purple font-bold text-xs px-2 py-1 rounded-full">{orders.length}</span>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by customer or order ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-candy-purple text-sm font-semibold"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', ...statuses.map(s => s.toLowerCase())].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  filter === f ? 'bg-candy-purple text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Orders Table */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-soft overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3">Order</th>
                  <th className="text-left px-5 py-3">Customer</th>
                  <th className="text-left px-5 py-3">Total</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(order => (
                  <tr
                    key={order.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedOrder?.id === order.id ? 'bg-pastel-purple/30' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-5 py-3">
                      <p className="font-bold text-gray-800 text-sm">#{order.id}</p>
                      <p className="text-xs text-gray-400">{order.date}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-700 text-sm">{order.customer}</p>
                      <p className="text-xs text-gray-400">{order.items} items</p>
                    </td>
                    <td className="px-5 py-3 font-bold text-candy-purple text-sm">
                      Rs. {order.total.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`badge text-xs ${statusColors[order.status]}`}>{order.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                        className="p-2 rounded-lg text-candy-purple hover:bg-pastel-purple transition-colors"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📦</div>
                <p className="font-bold text-gray-500">No orders found</p>
              </div>
            )}
          </div>

          {/* Order Detail */}
          <div>
            {selectedOrder ? (
              <div className="bg-white rounded-2xl shadow-soft p-5">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="font-display text-xl text-gray-800">#{selectedOrder.id}</h3>
                    <p className="text-gray-400 text-sm font-semibold">{selectedOrder.date}</p>
                  </div>
                  <span className={`badge ${statusColors[selectedOrder.status]}`}>{selectedOrder.status}</span>
                </div>

                <div className="space-y-3 mb-5">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Customer</p>
                    <p className="font-bold text-gray-800">{selectedOrder.customer}</p>
                    <p className="text-sm text-gray-500 font-semibold">{selectedOrder.email}</p>
                    <p className="text-sm text-gray-500 font-semibold">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Delivery Address</p>
                    <p className="font-semibold text-gray-700 text-sm">{selectedOrder.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Payment</p>
                    <p className="font-bold text-gray-700">{selectedOrder.payment}</p>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between font-bold text-gray-800">
                      <span>Total ({selectedOrder.items} items)</span>
                      <span className="text-candy-purple">Rs. {selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Update Status */}
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-2">Update Status</p>
                  <div className="space-y-2">
                    {statuses.map(status => (
                      <button
                        key={status}
                        onClick={() => updateStatus(selectedOrder.id, status)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          selectedOrder.status === status
                            ? 'bg-candy-purple text-white'
                            : 'bg-gray-50 text-gray-600 hover:bg-pastel-purple hover:text-candy-purple'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
                <div className="text-4xl mb-3">👆</div>
                <p className="font-bold text-gray-500">Click an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
