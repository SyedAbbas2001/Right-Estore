'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCartShopping, faHeartCrack, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useWishlistStore, useCartStore } from '@/store';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore(s => s.addItem);

  const handleAddToCart = item => {
    addToCart(item, 1, item.sizes?.[0] || null, item.colors?.[0] || null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-gray-800">My Wishlist</h1>
            <p className="text-gray-500 font-semibold text-sm mt-1">
              {items.length} saved item{items.length !== 1 ? 's' : ''}
            </p>
          </div>
          {items.length > 0 && (
            <button onClick={clearWishlist} className="text-sm font-bold text-red-400 hover:text-red-600 transition-colors">
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-6">
              <FontAwesomeIcon icon={faHeartCrack} className="text-pink-300" />
            </motion.div>
            <h2 className="font-display text-3xl text-gray-700 mb-3">Wishlist is empty</h2>
            <p className="text-gray-500 font-semibold mb-8 text-sm sm:text-base">Save items you love and come back to them later!</p>
            <Link href="/products">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="btn-primary text-lg px-10 py-4">
                Discover Products ✨
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div key={item.id} layout
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-lg hover:shadow-pink-100 transition-shadow group">
                    <Link href={`/products/${item.slug}`} className="block aspect-square overflow-hidden bg-gray-50">
                      <img src={item.images?.[0]} alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </Link>
                    <div className="p-3 sm:p-4">
                      <p className="text-[10px] font-black text-purple-500 uppercase mb-1 capitalize">{item.category}</p>
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="font-bold text-gray-800 hover:text-purple-600 transition-colors text-xs sm:text-sm mb-2 line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1 mb-3">
                        <span className="font-display text-base sm:text-lg text-purple-600">Rs. {item.price.toLocaleString()}</span>
                        {item.discount > 0 && (
                          <span className="badge bg-red-500 text-[9px] ml-auto">-{item.discount}%</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <motion.button onClick={() => handleAddToCart(item)}
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1">
                          <FontAwesomeIcon icon={faCartShopping} className="w-3 h-3" />
                          <span className="hidden sm:inline">Add to Cart</span>
                          <span className="sm:hidden">Add</span>
                        </motion.button>
                        <motion.button onClick={() => removeItem(item.id)}
                          whileTap={{ scale: 0.85 }}
                          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-red-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="mt-10 text-center">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                onClick={() => items.forEach(handleAddToCart)}
                className="btn-secondary text-base px-10 py-4 flex items-center gap-2 mx-auto">
                <FontAwesomeIcon icon={faCartShopping} className="w-4 h-4" />
                Add All to Cart
              </motion.button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
