'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPlus, faMinus, faTrash, faBagShopping, faArrowRight, faTruck } from '@fortawesome/free-solid-svg-icons';
import { useCartStore } from '@/store';

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const total = items.reduce((a, i) => a + i.price * i.quantity, 0);
  const count = items.reduce((a, i) => a + i.quantity, 0);
  const shipping = total >= 2000 ? 0 : 150;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm z-40" onClick={closeCart} />
        )}
      </AnimatePresence>

      <motion.div initial={false}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faBagShopping} className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-display text-xl text-gray-800">My Cart</h2>
              <p className="text-xs text-gray-400 font-semibold">{count} item{count !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={closeCart}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4 text-gray-500" />
          </motion.button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {items.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full text-center py-16">
                <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
                  className="text-7xl mb-5">🛒</motion.div>
                <h3 className="font-display text-2xl text-gray-700 mb-2">Cart is empty!</h3>
                <p className="text-gray-400 font-semibold mb-6 text-sm">Add some magical items to get started</p>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  onClick={closeCart} className="btn-primary">
                  Start Shopping ✨
                </motion.button>
              </motion.div>
            ) : (
              items.map(item => (
                <motion.div key={item.cartId}
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
                  transition={{ type: 'spring', stiffness: 250 }}
                  className="flex gap-3 bg-gray-50 rounded-2xl p-3">
                  <div className="w-18 h-18 min-w-[72px] h-18 rounded-xl overflow-hidden bg-white">
                    <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-gray-800 truncate">{item.name}</h4>
                    {item.size && <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Size: {item.size}</p>}
                    <p className="text-purple-600 font-black text-sm mt-1">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-2 py-1">
                        <motion.button whileTap={{ scale: 0.85 }}
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-700">
                          <FontAwesomeIcon icon={faMinus} className="w-2.5 h-2.5" />
                        </motion.button>
                        <span className="w-5 text-center font-black text-sm">{item.quantity}</span>
                        <motion.button whileTap={{ scale: 0.85 }}
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-purple-500 hover:text-purple-700">
                          <FontAwesomeIcon icon={faPlus} className="w-2.5 h-2.5" />
                        </motion.button>
                      </div>
                      <motion.button whileTap={{ scale: 0.85 }}
                        onClick={() => removeItem(item.cartId)}
                        className="p-1.5 rounded-lg text-red-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="p-4 border-t border-gray-100 space-y-3">
            {total < 2000 && (
              <div className="bg-amber-50 rounded-2xl p-3">
                <p className="text-xs font-bold text-amber-700 flex items-center gap-1">
                  <FontAwesomeIcon icon={faTruck} className="w-3 h-3" />
                  Add Rs. {(2000 - total).toLocaleString()} more for FREE shipping!
                </p>
                <div className="mt-2 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-amber-400 rounded-full"
                    initial={{ width: 0 }} animate={{ width: `${Math.min((total / 2000) * 100, 100)}%` }}
                    transition={{ duration: 0.6 }} />
                </div>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold text-gray-600">
              <span>Subtotal</span><span>Rs. {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-gray-600">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-green-600 font-black' : ''}>{shipping === 0 ? 'FREE 🎉' : `Rs. ${shipping}`}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-gray-800 border-t border-gray-100 pt-3">
              <span>Total</span>
              <span className="font-display text-2xl text-purple-600">Rs. {(total + shipping).toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/cart" onClick={closeCart} className="btn-outline text-center text-sm py-3">
                View Cart
              </Link>
              <Link href="/checkout" onClick={closeCart}>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="btn-primary w-full text-sm py-3 justify-center">
                  Checkout <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
