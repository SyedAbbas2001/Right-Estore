'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faMinus, faArrowLeft, faBagShopping, faTag, faTruck, faSparkles, faStar } from '@fortawesome/free-solid-svg-icons';
import { useCartStore } from '@/store';
import ProductCard from '@/components/shop/ProductCard';
import { products } from '@/data/products';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const total = items.reduce((a, i) => a + i.price * i.quantity, 0);
  const count = items.reduce((a, i) => a + i.quantity, 0);
  const shipping = total >= 2000 ? 0 : 150;
  const grand = total + shipping;
  const suggested = products.filter(p => !items.some(i => i.id === p.id)).slice(0, 4);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl mb-6"><FontAwesomeIcon icon={faBagShopping} className="w-16 h-16 text-purple-500" /></motion.div>
          <h2 className="font-display text-4xl text-gray-800 mb-3">Cart is empty!</h2>
          <p className="text-gray-500 font-semibold mb-8 text-sm sm:text-base">Add some magical items to get started</p>
          <Link href="/products">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="btn-primary text-lg px-10 py-4">
              <FontAwesomeIcon icon={faSparkles} className="w-4 h-4 mr-2" />Start Shopping
            </motion.button>
          </Link>
        </div>
        {suggested.length > 0 && (
          <div className="mt-16 w-full max-w-5xl">
            <h3 className="font-display text-2xl text-center text-gray-700 mb-6">You Might Like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {suggested.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-gray-800">My Cart</h1>
            <p className="text-gray-400 font-semibold text-sm mt-1">{count} item{count !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/products" className="btn-outline flex items-center gap-2 text-xs sm:text-sm py-2 px-3 sm:px-4">
              <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Continue Shopping</span>
              <span className="sm:hidden">Shop</span>
            </Link>
            <button onClick={clearCart} className="text-xs sm:text-sm font-bold text-red-400 hover:text-red-600 transition-colors">
              Clear Cart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <AnimatePresence>
              {items.map(item => (
                <motion.div key={item.cartId} layout
                  initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                  transition={{ type: 'spring', stiffness: 250 }}
                  className="bg-white rounded-3xl p-4 sm:p-5 shadow-soft">
                  <div className="flex gap-3 sm:gap-4">
                    <Link href={`/products/${item.slug}`}>
                      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                        <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black text-purple-500 uppercase mb-1 capitalize">{item.category}</p>
                          <Link href={`/products/${item.slug}`}>
                            <h3 className="font-bold text-gray-800 hover:text-purple-600 transition-colors text-sm leading-snug truncate">{item.name}</h3>
                          </Link>
                          {(item.size || item.color) && (
                            <p className="text-xs text-gray-400 font-semibold mt-1">
                              {item.size && `Size: ${item.size}`}{item.size && item.color && ' • '}{item.color && `${item.color}`}
                            </p>
                          )}
                        </div>
                        <motion.button whileTap={{ scale: 0.85 }} onClick={() => removeItem(item.cartId)}
                          className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0">
                          <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>

                      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                          <motion.button whileTap={{ scale: 0.8 }} disabled={item.quantity <= 1}
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-500 hover:text-gray-800 disabled:opacity-30">
                            <FontAwesomeIcon icon={faMinus} className="w-2.5 h-2.5" />
                          </motion.button>
                          <span className="w-7 text-center font-black text-sm text-gray-800">{item.quantity}</span>
                          <motion.button whileTap={{ scale: 0.8 }}
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-purple-500 text-white flex items-center justify-center hover:bg-purple-600">
                            <FontAwesomeIcon icon={faPlus} className="w-2.5 h-2.5" />
                          </motion.button>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-lg sm:text-xl text-purple-600">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                          <p className="text-[10px] text-gray-400 font-semibold">Rs. {item.price.toLocaleString()} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-4 sm:p-5 shadow-soft">
              <h3 className="font-display text-lg text-gray-800 mb-4">Have a Coupon?</h3>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FontAwesomeIcon icon={faTag} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="text" placeholder="Enter code" className="input-field pl-9 text-sm py-2.5" />
                </div>
                <button className="btn-primary text-sm px-4 py-2.5">Apply</button>
              </div>
            </motion.div>

            {/* Summary box */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl p-4 sm:p-5 shadow-soft sticky top-24">
              <h3 className="font-display text-xl text-gray-800 mb-5">Order Summary</h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm font-semibold text-gray-600">
                  <span>Subtotal ({count} items)</span><span>Rs. {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-black' : ''}>{shipping === 0 ? 'FREE 🎉' : `Rs. ${shipping}`}</span>
                </div>

                {shipping > 0 && (
                  <div className="bg-amber-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-amber-700 flex items-center gap-1 mb-2">
                      <FontAwesomeIcon icon={faTruck} className="w-3 h-3" />
                      Add Rs. {(2000 - total).toLocaleString()} more for FREE shipping!
                    </p>
                    <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-amber-400 rounded-full"
                        initial={{ width: 0 }} animate={{ width: `${Math.min((total / 2000) * 100, 100)}%` }}
                        transition={{ duration: 0.8 }} />
                    </div>
                  </div>
                )}

                <div className="flex justify-between text-base sm:text-lg font-black text-gray-800 border-t border-gray-100 pt-3">
                  <span>Total</span>
                  <span className="font-display text-2xl text-purple-600">Rs. {grand.toLocaleString()}</span>
                </div>
              </div>

              <Link href="/checkout">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full py-4 justify-center text-base">
                  <FontAwesomeIcon icon={faBagShopping} className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </motion.button>
              </Link>
              <p className="text-center text-xs text-gray-400 font-semibold mt-3">🔒 Secure & Encrypted</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
