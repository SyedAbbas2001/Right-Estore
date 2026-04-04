'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart as faHeartSolid,
  faStar,
  faShoppingCart,
  faEye,
  faBolt
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { useCartStore, useWishlistStore } from '@/store';

export default function ProductCard({ product, priority = false }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore(s => s.addItem);
  const { addItem: toggleWish, isWishlisted } = useWishlistStore();
  const wished = isWishlisted(product.id);

  // ✅ Safe review handling
  const safeReviews = (product.reviews || []).filter(
    r => r && typeof r === 'object' && !Array.isArray(r)
  );

  const avgRating = safeReviews.length
    ? safeReviews.reduce((a, r) => a + (Number(r.rating) || 0), 0) / safeReviews.length
    : Number(product.rating) || 0;

  const handleCart = e => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, product.sizes?.[0] || null, product.colors?.[0] || null);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWish = e => {
    e.preventDefault();
    e.stopPropagation();
    toggleWish(product);
  };

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="product-card bg-white rounded-3xl shadow-md hover:shadow-2xl hover:shadow-purple-100 overflow-hidden transition-shadow duration-300"
      >

        {/* Image */}
        <div
          className="relative aspect-square overflow-hidden bg-gray-50"
          onMouseEnter={() => product.images?.length > 1 && setImgIdx(1)}
          onMouseLeave={() => setImgIdx(0)}
        >
          <img
            src={product.images?.[imgIdx] || product.images?.[0] || '/fallback-600x600.png'}
            alt={product.name || 'Product'}
            loading={priority ? 'eager' : 'lazy'}
            className="product-img w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300" />

          {/* Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <motion.button
              onClick={handleWish}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className={`w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition-colors ${
                wished ? 'bg-pink-500 text-white' : 'bg-white text-gray-400 hover:text-pink-500'
              }`}
            >
              <FontAwesomeIcon icon={wished ? faHeartSolid : faHeartOutline} className="w-3.5 h-3.5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15 }}
              className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors opacity-100"
            >
              <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && (
              <span className={`badge ${product.badgeColor} text-[10px] shadow-md`}>
                {product.badge}
              </span>
            )}
            {product.discount > 0 && (
              <span className="badge bg-red-500 text-[10px] shadow-md">
                -{product.discount}%
              </span>
            )}
            {product.isNew && !product.badge && (
              <span className="badge bg-emerald-500 text-[10px] shadow-md">
                NEW ✨
              </span>
            )}
          </div>

          {/* Add to cart */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <motion.button
              onClick={handleCart}
              whileTap={{ scale: 0.97 }}
              className={`w-full py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                added
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-purple-600 hover:to-pink-500'
              }`}
            >
              <FontAwesomeIcon icon={added ? faBolt : faShoppingCart} className="w-4 h-4" />
              {added ? 'Added!' : 'Add to Cart'}
            </motion.button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs font-black text-purple-500 uppercase tracking-widest mb-1 capitalize">
            {product.category}
          </p>

          <h3 className="font-bold text-gray-800 text-xs sm:text-sm leading-snug mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>

          {/* ⭐ Stars + Reviews */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon
                  key={i}
                  icon={faStar}
                  className={`w-2.5 h-2.5 ${
                    i < Math.floor(avgRating)
                      ? 'text-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400 font-semibold">
              ({safeReviews.length})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display text-base sm:text-lg text-purple-600">
              Rs. {product.price?.toLocaleString()}
            </span>

            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through font-semibold">
                Rs. {product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.sizes.slice(0, 3).map((s, idx) => (
                <span
                  key={`${s}-${idx}`}
                  className="text-[9px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md"
                >
                  {s}
                </span>
              ))}
              {product.sizes.length > 3 && (
                <span className="text-[9px] font-black text-purple-400">
                  +{product.sizes.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}