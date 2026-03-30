'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTshirt, faBaby, faPuzzlePiece, faPenFancy, faGrid } from '@fortawesome/free-solid-svg-icons';
import { categories } from '@/data/products';

const categoryIcons = {
  garments: faTshirt,
  newborn: faBaby,
  toys: faPuzzlePiece,
  stationery: faPenFancy,
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }
};

export default function CategoriesSection() {
  return (
    <section className="py-14 sm:py-20 px-4 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
          <FontAwesomeIcon icon={faGrid} className="text-purple-600 w-4 h-4" />
          <span className="text-purple-600 font-black text-sm">Shop by Category</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-gray-800 mb-3">What are you looking for?</h2>
        <p className="text-gray-500 font-semibold text-base sm:text-lg">Explore our magical collections for every little one</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
        {categories.map(cat => (
          <motion.div key={cat.id} variants={item}>
            <Link href={`/products?category=${cat.slug}`} className="group block">
              <motion.div whileHover={{ y: -8, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative overflow-hidden rounded-3xl aspect-square shadow-lg hover:shadow-2xl hover:shadow-purple-200/50 transition-shadow duration-300">
                <img src={cat.image} alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-115" />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-80 group-hover:opacity-90 transition-opacity duration-300`} />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-3 sm:p-4">
                  <motion.div whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                    transition={{ duration: 0.4 }}
                    className="text-4xl sm:text-5xl mb-2 sm:mb-3">
                    <FontAwesomeIcon icon={categoryIcons[cat.id] || faPuzzlePiece} className="w-8 h-8" />
                  </motion.div>
                  <h3 className="font-display text-lg sm:text-xl md:text-2xl text-white text-center">{cat.name}</h3>
                  <p className="text-white/75 text-[10px] sm:text-xs font-semibold mt-1 hidden sm:block">{cat.count}+ Products</p>
                  <motion.div whileHover={{ x: 4 }}
                    className="mt-2 sm:mt-3 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-[10px] sm:text-xs font-bold">
                    Shop Now <FontAwesomeIcon icon={faArrowRight} className="w-2.5 h-2.5" />
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
