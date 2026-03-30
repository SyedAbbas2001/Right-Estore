'use client';
import { useState, use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart, faCartShopping, faStar, faStarHalfStroke,
  faTruck, faRotateLeft, faShieldHalved, faShareNodes,
  faChevronRight, faMinus, faPlus, faFire, faBolt
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { getProductBySlug, getRelatedProducts, reviews } from '@/data/products';
import { useCartStore, useWishlistStore } from '@/store';
import ProductCard from '@/components/shop/ProductCard';

export default function ProductDetailPage({ params }) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);
  const productReviews = reviews.filter(r => r.productId === product.id);

  const [selImage, setSelImage] = useState(0);
  const [selSize, setSelSize] = useState(null);
  const [selColor, setSelColor] = useState(product.colors?.[0] || null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore(s => s.addItem);
  const { addItem: toggleWish, isWishlisted } = useWishlistStore();
  const wished = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selSize) {
      import('react-hot-toast').then(({ default: toast }) => toast.error('Please select a size'));
      return;
    }
    addItem(product, qty, selSize, selColor);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  };

  const savings = product.originalPrice ? product.originalPrice - product.price : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-400 flex-wrap">
          <Link href="/" className="hover:text-purple-500 transition-colors">Home</Link>
          <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5" />
          <Link href="/products" className="hover:text-purple-500 transition-colors">Products</Link>
          <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5" />
          <Link href={`/products?category=${product.category}`} className="hover:text-purple-500 transition-colors capitalize">{product.category}</Link>
          <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5" />
          <span className="text-gray-700 truncate max-w-[140px] sm:max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">

          {/* ===== Images ===== */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-soft group">
              <AnimatePresence mode="wait">
                <motion.img key={selImage} src={product.images?.[selImage]} alt={product.name}
                  initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover" />
              </AnimatePresence>

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && <span className={`badge ${product.badgeColor} shadow-lg`}>{product.badge}</span>}
                {product.discount > 0 && <span className="badge bg-red-500 shadow-lg">-{product.discount}% OFF</span>}
              </div>

              <motion.button onClick={() => toggleWish(product)} whileTap={{ scale: 0.85 }}
                className={`absolute top-4 right-4 w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-colors ${wished ? 'bg-pink-500 text-white' : 'bg-white text-gray-400 hover:text-pink-500'}`}>
                <FontAwesomeIcon icon={wished ? faHeart : faHeartOutline} className="w-5 h-5" />
              </motion.button>
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {product.images.map((img, i) => (
                  <motion.button key={i} onClick={() => setSelImage(i)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 w-18 h-18 w-[72px] h-[72px] rounded-2xl overflow-hidden border-2 transition-all ${selImage === i ? 'border-purple-500 shadow-candy' : 'border-transparent hover:border-gray-300'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ===== Info ===== */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-5">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-black text-purple-600 uppercase tracking-widest bg-purple-100 px-3 py-1 rounded-full capitalize">{product.category}</span>
              <span className="text-xs font-bold text-gray-400 uppercase">{product.brand}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl text-gray-800 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="font-bold text-gray-700 text-sm">{product.rating}</span>
              <span className="text-gray-400 text-sm font-semibold">({product.reviews} reviews)</span>
              <span className={`text-sm font-black ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                {product.stock > 10 ? '✅ In Stock' : product.stock > 0 ? `⚠️ Only ${product.stock} left` : '❌ Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 flex-wrap">
              <span className="font-display text-4xl text-purple-600">Rs. {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through font-semibold">Rs. {product.originalPrice.toLocaleString()}</span>
                  <span className="bg-red-100 text-red-600 font-black text-sm px-2 py-1 rounded-xl flex items-center gap-1">
                    <FontAwesomeIcon icon={faFire} className="w-3 h-3" />
                    Save Rs. {savings.toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <p className="text-sm font-black text-gray-700 mb-2">Color: <span className="text-purple-600">{selColor}</span></p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map(c => (
                    <motion.button key={c} onClick={() => setSelColor(c)} whileTap={{ scale: 0.9 }}
                      className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${selColor === c ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-purple-300'}`}>
                      {c}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-black text-gray-700">Size: {selSize && <span className="text-purple-600 ml-1">{selSize}</span>}</p>
                  <button className="text-xs font-bold text-purple-500 hover:underline">Size Guide →</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <motion.button key={s} onClick={() => setSelSize(s)} whileTap={{ scale: 0.9 }}
                      className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black border-2 transition-all ${selSize === s ? 'border-purple-500 bg-purple-500 text-white shadow-candy' : 'border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-600'}`}>
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Age group */}
            {product.ageGroup && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-gray-500">Age Group:</span>
                <span className="bg-amber-100 text-amber-700 font-black text-xs px-3 py-1 rounded-full">{product.ageGroup}</span>
              </div>
            )}

            {/* Qty + Cart */}
            <div className="flex gap-3 pt-1">
              <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3">
                <motion.button whileTap={{ scale: 0.8 }} onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-800">
                  <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
                </motion.button>
                <span className="font-black text-gray-800 w-6 text-center">{qty}</span>
                <motion.button whileTap={{ scale: 0.8 }} onClick={() => setQty(q => q + 1)}
                  className="w-7 h-7 rounded-xl bg-purple-500 text-white flex items-center justify-center hover:bg-purple-600">
                  <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                </motion.button>
              </div>

              <motion.button onClick={handleAddToCart} disabled={product.stock === 0}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className={`flex-1 flex items-center justify-center gap-2 font-black py-3 px-4 rounded-2xl text-white transition-all disabled:opacity-50 ${justAdded ? 'bg-emerald-500' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 shadow-lg shadow-purple-200'}`}>
                <FontAwesomeIcon icon={justAdded ? faBolt : faCartShopping} className="w-4 h-4" />
                <span className="text-sm sm:text-base">{product.stock === 0 ? 'Out of Stock' : justAdded ? 'Added!' : 'Add to Cart'}</span>
              </motion.button>

              <motion.button onClick={() => toggleWish(product)} whileTap={{ scale: 0.85 }}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${wished ? 'border-pink-500 bg-pink-500 text-white' : 'border-gray-200 text-gray-400 hover:border-pink-400 hover:text-pink-500'}`}>
                <FontAwesomeIcon icon={wished ? faHeart : faHeartOutline} className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Trust row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
              {[
                { icon: faTruck, label: 'Free Shipping', sub: 'Over Rs. 2000', color: 'text-blue-500 bg-blue-50' },
                { icon: faRotateLeft, label: 'Easy Returns', sub: '15 days', color: 'text-green-500 bg-green-50' },
                { icon: faShieldHalved, label: 'Secure', sub: 'Safe checkout', color: 'text-purple-500 bg-purple-50' },
              ].map(({ icon, label, sub, color }) => (
                <div key={label} className={`${color} rounded-2xl p-2 sm:p-3 text-center`}>
                  <FontAwesomeIcon icon={icon} className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" />
                  <p className="text-[10px] sm:text-xs font-black">{label}</p>
                  <p className="text-[9px] sm:text-[10px] opacity-70">{sub}</p>
                </div>
              ))}
            </div>

            <motion.button whileHover={{ x: 3 }} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-purple-500 transition-colors">
              <FontAwesomeIcon icon={faShareNodes} className="w-4 h-4" />
              Share this product
            </motion.button>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-12 sm:mt-16">
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
            {['description', 'features', 'reviews'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-3 font-black text-sm capitalize whitespace-nowrap transition-all relative ${activeTab === tab ? 'text-purple-600' : 'text-gray-400 hover:text-gray-700'}`}>
                {tab} {tab === 'reviews' && `(${productReviews.length})`}
                {activeTab === tab && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600" />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {activeTab === 'description' && (
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft">
                  <p className="text-gray-700 font-semibold leading-relaxed text-sm sm:text-base">{product.description}</p>
                </div>
              )}
              {activeTab === 'features' && (
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft">
                  <ul className="space-y-3">
                    {product.features?.map((f, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                        className="flex items-center gap-3 font-semibold text-gray-700 text-sm sm:text-base">
                        <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs flex-shrink-0 font-black">✓</span>
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {productReviews.length === 0 ? (
                    <div className="bg-white rounded-3xl p-8 text-center shadow-soft">
                      <div className="text-5xl mb-3">⭐</div>
                      <p className="font-bold text-gray-500">No reviews yet. Be the first!</p>
                    </div>
                  ) : productReviews.map((r, i) => (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft">
                      <div className="flex items-start gap-4">
                        <img src={r.avatar} alt={r.userName} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-gray-800 text-sm">{r.userName}</span>
                              {r.verified && <span className="text-[10px] bg-green-100 text-green-700 font-black px-2 py-0.5 rounded-full">✓ Verified</span>}
                            </div>
                            <span className="text-xs text-gray-400 font-semibold">{r.date}</span>
                          </div>
                          <div className="flex gap-0.5 mb-2">
                            {[...Array(5)].map((_, j) => (
                              <FontAwesomeIcon key={j} icon={faStar} className={`w-3.5 h-3.5 ${j < r.rating ? 'text-amber-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                          <h4 className="font-black text-gray-800 text-sm mb-1">{r.title}</h4>
                          <p className="text-gray-600 font-semibold text-sm">{r.comment}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16">
            <h2 className="font-display text-3xl sm:text-4xl text-center text-gray-800 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
