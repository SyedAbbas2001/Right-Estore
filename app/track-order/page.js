'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck, faBox, faTruck, faHouseChimney,
  faCircleXmark, faSpinner, faMagnifyingGlass,
  faPhone, faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '@/store';

const statusSteps = [
  { key: 'Pending',    label: 'Order Placed',    icon: faCircleCheck, sub: 'We received your order' },
  { key: 'Processing', label: 'Preparing',        icon: faBox,         sub: 'Being packed for you' },
  { key: 'Shipped',    label: 'On the Way',       icon: faTruck,       sub: 'Out for delivery' },
  { key: 'Delivered',  label: 'Delivered',        icon: faHouseChimney,sub: 'Enjoy your purchase!' },
];

const statusIndex = { Pending: 0, Processing: 1, Shipped: 2, Delivered: 3, Cancelled: -1 };

const statusColors = {
  Pending:    'bg-gray-100 text-gray-600',
  Processing: 'bg-amber-100 text-amber-700',
  Shipped:    'bg-blue-100 text-blue-700',
  Delivered:  'bg-green-100 text-green-700',
  Cancelled:  'bg-red-100 text-red-700',
};

function TrackContent() {
  const searchParams = useSearchParams();
  const { token, user } = useAuthStore();

  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (searchParams.get('orderId') && token !== undefined) {
      fetchOrder(searchParams.get('orderId'));
    }
  }, [token]);

  const fetchOrder = async (id) => {
    const searchId = (id || orderId).trim();
    if (!searchId) { setError('Please enter an order ID'); return; }
    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);
    try {
      const res = await fetch('/api/orders/' + searchId, {
        headers: token ? { Authorization: 'Bearer ' + token } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order not found');
      setOrder(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = e => { e.preventDefault(); fetchOrder(); };

  const currentStep = order ? (statusIndex[order.orderStatus] ?? 0) : 0;
  const isCancelled = order?.orderStatus === 'Cancelled';

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 py-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-5xl mb-3">📦</div>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-2">Track Your Order</h1>
          <p className="text-white/80 font-semibold">Real-time order status updates</p>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-soft p-5 sm:p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" value={orderId} onChange={e => setOrderId(e.target.value.toUpperCase())}
                placeholder="Enter Order ID (e.g. RE1A2B3C)"
                className="input-field pl-11 font-mono font-bold tracking-wider" />
            </div>
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="btn-primary px-5 sm:px-8 py-3 disabled:opacity-70 whitespace-nowrap flex items-center gap-2">
              {loading ? <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" /> : 'Track'}
            </motion.button>
          </form>
          {user && (
            <p className="text-center mt-3 text-sm text-gray-400 font-semibold">
              Or <Link href="/account" className="text-purple-600 font-black hover:underline">view all my orders →</Link>
            </p>
          )}
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 text-center">
            <FontAwesomeIcon icon={faCircleXmark} className="w-10 h-10 text-red-400 mb-2" />
            <p className="font-bold text-red-600 text-lg">{error}</p>
            <p className="text-red-400 text-sm font-semibold mt-1">Please check your order ID and try again</p>
          </motion.div>
        )}

        {/* Order Result */}
        {order && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            {/* Status Card */}
            <div className="bg-white rounded-3xl shadow-soft p-5 sm:p-6">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase mb-1">Order ID</p>
                  <p className="font-display text-2xl text-purple-600">#{order.orderId}</p>
                  <p className="text-sm text-gray-400 font-semibold mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <span className={`badge text-sm px-4 py-2 ${statusColors[order.orderStatus]}`}>
                  {order.orderStatus}
                </span>
              </div>

              {isCancelled ? (
                <div className="text-center py-6">
                  <FontAwesomeIcon icon={faCircleXmark} className="w-16 h-16 text-red-400 mb-3" />
                  <h3 className="font-display text-2xl text-red-600">Order Cancelled</h3>
                </div>
              ) : (
                <div>
                  {/* Mobile stepper */}
                  <div className="space-y-3 sm:hidden">
                    {statusSteps.map((step, i) => {
                      const done = i <= currentStep;
                      return (
                        <div key={step.key} className={`flex items-center gap-4 p-3 rounded-2xl ${done ? 'bg-purple-50' : 'bg-gray-50'}`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                            <FontAwesomeIcon icon={step.icon} className="w-4 h-4" />
                          </div>
                          <div>
                            <p className={`font-black text-sm ${done ? 'text-purple-700' : 'text-gray-400'}`}>{step.label}</p>
                            <p className={`text-xs font-semibold ${done ? 'text-gray-500' : 'text-gray-300'}`}>{step.sub}</p>
                          </div>
                          {i === currentStep && (
                            <div className="ml-auto w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop stepper */}
                  <div className="hidden sm:block relative">
                    <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 rounded-full">
                      <motion.div className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: currentStep === 0 ? '0%' : `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }} />
                    </div>
                    <div className="grid grid-cols-4 gap-2 relative z-10">
                      {statusSteps.map((step, i) => {
                        const done = i <= currentStep;
                        const active = i === currentStep;
                        return (
                          <motion.div key={step.key} initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                            className="flex flex-col items-center text-center">
                            <motion.div animate={active ? { scale: [1, 1.2, 1] } : {}}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                done ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-candy' : 'bg-gray-200 text-gray-400'
                              }`}>
                              <FontAwesomeIcon icon={step.icon} className="w-4 h-4" />
                            </motion.div>
                            <p className={`font-black text-xs ${done ? 'text-purple-700' : 'text-gray-400'}`}>{step.label}</p>
                            <p className={`text-[10px] font-semibold mt-0.5 ${done ? 'text-gray-500' : 'text-gray-300'}`}>{step.sub}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="bg-white rounded-3xl shadow-soft p-5 sm:p-6">
              <h3 className="font-display text-xl text-gray-800 mb-4">Items Ordered ({order.items?.length})</h3>
              <div className="space-y-3">
                {order.items?.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-gray-100">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{item.name}</p>
                      <div className="flex gap-1.5 mt-0.5 flex-wrap">
                        {item.size && <span className="text-[10px] text-gray-500 font-bold bg-gray-200 px-1.5 py-0.5 rounded-full">Size: {item.size}</span>}
                        {item.color && <span className="text-[10px] text-gray-500 font-bold bg-gray-200 px-1.5 py-0.5 rounded-full">{item.color}</span>}
                        <span className="text-[10px] text-gray-500 font-bold bg-gray-200 px-1.5 py-0.5 rounded-full">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <p className="font-black text-purple-600 text-sm flex-shrink-0">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm font-semibold text-gray-500">
                  <span>Subtotal</span><span>Rs. {order.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-gray-500">
                  <span>Shipping</span>
                  <span className={order.shippingFee === 0 ? 'text-green-600 font-black' : ''}>
                    {order.shippingFee === 0 ? 'FREE 🎉' : `Rs. ${order.shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between font-black text-gray-800 border-t border-gray-100 pt-2">
                  <span>Total</span>
                  <span className="font-display text-xl text-purple-600">Rs. {order.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-3xl shadow-soft p-5 sm:p-6">
              <h3 className="font-display text-xl text-gray-800 mb-4">Delivery Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase mb-1">Delivery To</p>
                    <p className="font-bold text-gray-800 text-sm">{order.customerName}</p>
                    <p className="text-gray-500 font-semibold text-sm">{order.shippingAddress?.address}</p>
                    <p className="text-gray-500 font-semibold text-sm">{order.shippingAddress?.city}{order.shippingAddress?.province ? ', ' + order.shippingAddress.province : ''}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase mb-1">Contact</p>
                    <p className="font-bold text-gray-800 text-sm">{order.shippingAddress?.phone}</p>
                    <p className="text-gray-500 font-semibold text-sm">{order.customerEmail}</p>
                    <span className="text-xs text-amber-700 font-black bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-1">
                      💵 Cash on Delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              <Link href="/products" className="btn-primary flex-1 text-center py-3.5 justify-center">
                🛍️ Continue Shopping
              </Link>
              {user && (
                <Link href="/account" className="btn-outline flex-1 text-center py-3.5">
                  All My Orders →
                </Link>
              )}
            </div>
          </motion.div>
        )}

        {/* No result */}
        {searched && !loading && !order && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-2xl text-gray-700">No order found</h3>
            <p className="text-gray-400 font-semibold mt-2">Check your order ID and try again</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}