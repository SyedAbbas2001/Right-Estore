'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft, faBoxOpen, faTruck, faCircleCheck,
  faClock, faSpinner, faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';

const statusConfig = {
  Delivered: { color: 'text-green-600 bg-green-100', icon: faCircleCheck },
  Processing: { color: 'text-amber-600 bg-amber-100', icon: faClock },
  Shipped:    { color: 'text-blue-600 bg-blue-100',   icon: faTruck },
  Pending:    { color: 'text-gray-600 bg-gray-100',   icon: faClock },
  Cancelled:  { color: 'text-red-600 bg-red-100',     icon: faBoxOpen },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login?redirect=/orders'); return; }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/account" className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
            <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="font-display text-3xl text-gray-800">Order History</h1>
            {!loading && (
              <p className="text-gray-500 font-semibold text-sm">
                {orders.length} order{orders.length !== 1 ? 's' : ''} placed
              </p>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <FontAwesomeIcon icon={faSpinner} className="w-12 h-12 text-purple-500 animate-spin mb-4" />
              <p className="font-display text-xl text-purple-600">Loading your orders...</p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-20">
            <div className="text-7xl mb-4">📦</div>
            <h2 className="font-display text-2xl text-gray-700 mb-3">No orders yet</h2>
            <p className="text-gray-500 font-semibold mb-6">
              Start shopping to see your orders here
            </p>
            <Link href="/products" className="btn-primary">Shop Now ✨</Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order, i) => {
              const config = statusConfig[order.orderStatus] || statusConfig.Pending;
              const orderDate = new Date(order.createdAt).toLocaleDateString('en-PK', {
                day: 'numeric', month: 'short', year: 'numeric'
              });

              return (
                <motion.div key={order._id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-3xl shadow-soft overflow-hidden">

                  {/* Order Header */}
                  <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-black text-gray-800">#{order.orderId}</p>
                        <span className={`inline-flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full ${config.color}`}>
                          <FontAwesomeIcon icon={config.icon} className="w-3 h-3" />
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 font-semibold">{orderDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl text-purple-600">
                        Rs. {order.total?.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 font-semibold">
                        {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-5 space-y-3">
                    {order.items?.map((item, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                          {item.image
                            ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-sm truncate">{item.name}</p>
                          <div className="flex gap-2 flex-wrap mt-0.5">
                            {item.size && <span className="text-[10px] text-gray-400 font-semibold bg-gray-100 px-1.5 py-0.5 rounded-full">Size: {item.size}</span>}
                            {item.color && <span className="text-[10px] text-gray-400 font-semibold bg-gray-100 px-1.5 py-0.5 rounded-full">{item.color}</span>}
                            <span className="text-xs text-gray-400 font-semibold">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <p className="font-bold text-gray-700 text-sm flex-shrink-0">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="px-5 pb-5 flex gap-3 flex-wrap">
                    {/* Track Order button - always visible */}
                    <Link href={`/track-order?orderId=${order.orderId}`} className="flex-1">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className="btn-primary w-full text-sm py-2.5 justify-center flex items-center gap-2">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="w-3.5 h-3.5" />
                        Track Order
                      </motion.button>
                    </Link>

                    {/* View Details */}
                    <Link href={`/track-order?orderId=${order.orderId}`} className="flex-1">
                      <button className="btn-outline w-full text-sm py-2.5 flex items-center justify-center gap-2">
                        <FontAwesomeIcon icon={faBoxOpen} className="w-3.5 h-3.5" />
                        View Details
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}