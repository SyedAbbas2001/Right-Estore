'use client';
import Link from 'next/link';
import { FiPackage, FiChevronRight, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faShoppingCart, faRotateRight } from '@fortawesome/free-solid-svg-icons';

const orders = [
  {
    id: 'KS123456', date: '2024-11-20', status: 'Delivered', total: 5698, items: [
      { name: 'Rainbow Unicorn Dress', qty: 1, price: 2499, image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=80&h=80&fit=crop' },
      { name: 'Cozy Star Hoodie', qty: 1, price: 1799, image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=80&h=80&fit=crop' },
      { name: 'Plush Bunny Best Friend', qty: 1, price: 1299, image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=80&h=80&fit=crop' },
    ],
  },
  {
    id: 'KS123455', date: '2024-11-10', status: 'Processing', total: 2799, items: [
      { name: 'Wooden Rainbow Stacking Toy', qty: 1, price: 2799, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop' },
    ],
  },
  {
    id: 'KS123454', date: '2024-10-28', status: 'Delivered', total: 4297, items: [
      { name: 'Cloud Soft Onesie Set', qty: 1, price: 2199, image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=80&h=80&fit=crop' },
      { name: 'Magical Unicorn Art Set', qty: 1, price: 1899, image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=80&h=80&fit=crop' },
    ],
  },
];

const statusConfig = {
  Delivered: { color: 'text-green-600 bg-green-100', icon: FiCheckCircle, label: 'Delivered' },
  Processing: { color: 'text-amber-600 bg-amber-100', icon: FiClock, label: 'Processing' },
  Shipped: { color: 'text-blue-600 bg-blue-100', icon: FiTruck, label: 'Shipped' },
};

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/account" className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
            <FiChevronRight className="w-5 h-5 rotate-180 text-gray-500" />
          </Link>
          <div>
            <h1 className="font-display text-3xl text-gray-800">Order History</h1>
            <p className="text-gray-500 font-semibold text-sm">{orders.length} orders placed</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-4"><FontAwesomeIcon icon={faBox} className="w-16 h-16 mx-auto text-purple-500" /></div>
            <h2 className="font-display text-2xl text-gray-700 mb-3">No orders yet</h2>
            <p className="text-gray-500 font-semibold mb-6">Start shopping to see your orders here</p>
            <Link href="/products" className="btn-primary"><FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4 mr-2" />Shop Now <FontAwesomeIcon icon={faStar} className="w-4 h-4 ml-1" /></Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map(order => {
              const config = statusConfig[order.status] || statusConfig.Processing;
              const Icon = config.icon;
              return (
                <div key={order.id} className="bg-white rounded-3xl shadow-soft overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-800">#{order.id}</p>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${config.color}`}>
                          <Icon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 font-semibold">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl text-candy-purple">Rs. {order.total.toLocaleString()}</p>
                      <p className="text-xs text-gray-400 font-semibold">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-5 space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-400 font-semibold">Qty: {item.qty}</p>
                        </div>
                        <p className="font-bold text-gray-700 text-sm">Rs. {item.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="px-5 pb-5 flex gap-3">
                    <button className="btn-outline text-sm py-2 flex-1">View Details</button>
                    {order.status === 'Delivered' && (
                      <button className="btn-primary text-sm py-2 flex-1">Reorder 🔄</button>
                    )}
                    {order.status === 'Processing' && (
                      <button className="text-sm font-bold text-red-400 hover:text-red-600 transition-colors">Cancel Order</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
