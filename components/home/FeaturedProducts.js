'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/shop/ProductCard';
import { products, categories } from '@/data/products';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function FeaturedProducts() {
  const [active, setActive] = useState('all');

  const filtered = active === 'all'
    ? products.filter(p => p.isFeatured).slice(0, 8)
    : products.filter(p => p.category === active && p.isFeatured).slice(0, 8);

  const tabs = [
    { id: 'all', label: 'All' },
    ...categories.map(c => ({ id: c.slug, label: c.name })),
  ];

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-white to-purple-50/40">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-2 mb-4">
            <span>⭐</span>
            <span className="text-amber-600 font-black text-sm">Featured Products</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-gray-800 mb-3">Kids Love These!</h2>
          <p className="text-gray-500 font-semibold text-sm sm:text-base">Hand-picked favorites for your little ones</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8 sm:mb-10">
          {tabs.map(tab => (
            <motion.button key={tab.id} onClick={() => setActive(tab.id)}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-1.5 px-3 sm:px-5 py-2 rounded-full font-black text-xs sm:text-sm transition-all duration-200 ${
                active === tab.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600'
              }`}>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {filtered.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 200 }}>
                <ProductCard product={product} priority={i < 4} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center mt-10 sm:mt-12">
          <Link href="/products">
            <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
              className="btn-primary text-base sm:text-lg px-8 sm:px-10 py-4">
              View All Products <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
