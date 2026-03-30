'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { categories } from '@/data/products';

const allSizes = ['NB','0-3M','3-6M','6-9M','9-12M','2Y','3Y','4Y','5Y','6Y','7Y','8Y','10Y','12Y'];
const genders = ['Boys','Girls','Unisex'];

export default function ProductFilters({ priceRange, setPriceRange, selectedSizes, setSelectedSizes, selectedGenders, setSelectedGenders, activeCategory }) {
  const toggleSize = s => setSelectedSizes(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleGender = g => setSelectedGenders(p => p.includes(g) ? p.filter(x => x !== g) : [...p, g]);
  const hasFilters = selectedSizes.length > 0 || selectedGenders.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000;

  const Section = ({ title, children }) => (
    <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-soft">
      <h3 className="font-display text-lg text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="space-y-4">
      {hasFilters && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileTap={{ scale: 0.96 }}
          onClick={() => { setSelectedSizes([]); setSelectedGenders([]); setPriceRange([0, 10000]); }}
          className="w-full text-sm font-black text-pink-500 hover:text-pink-700 transition-colors flex items-center justify-center gap-1.5">
          <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" /> Clear All Filters
        </motion.button>
      )}

      <Section title="Categories">
        <div className="space-y-1">
          <Link href="/products"
            className={`flex items-center justify-between py-2 px-3 rounded-xl text-sm font-bold transition-colors ${!activeCategory ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'}`}>
            <span>⭐ All Products</span>
          </Link>
          {categories.map(cat => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`}
              className={`flex items-center justify-between py-2 px-3 rounded-xl text-sm font-bold transition-colors ${activeCategory === cat.slug ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'}`}>
              <span>{cat.emoji} {cat.name}</span>
              <span className="text-xs text-gray-400">{cat.count}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Price Range">
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-black text-gray-600">
            <span>Rs. {priceRange[0].toLocaleString()}</span>
            <span>Rs. {priceRange[1].toLocaleString()}</span>
          </div>
          <input type="range" min="0" max="10000" step="100" value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-purple-600 cursor-pointer" />
          <div className="grid grid-cols-2 gap-2">
            {[{label:'Under 1K',range:[0,1000]},{label:'1K–2K',range:[1000,2000]},{label:'2K–5K',range:[2000,5000]},{label:'Above 5K',range:[5000,10000]}].map(({ label, range }) => (
              <motion.button key={label} whileTap={{ scale: 0.95 }}
                onClick={() => setPriceRange(range)}
                className={`text-xs font-bold py-1.5 px-2 rounded-xl border transition-colors ${priceRange[0] === range[0] && priceRange[1] === range[1] ? 'border-purple-500 bg-purple-100 text-purple-700' : 'border-gray-200 text-gray-500 hover:border-purple-400'}`}>
                {label}
              </motion.button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Gender">
        <div className="flex flex-wrap gap-2">
          {genders.map(g => (
            <motion.button key={g} whileTap={{ scale: 0.9 }} onClick={() => toggleGender(g)}
              className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${selectedGenders.includes(g) ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600'}`}>
              {g === 'Boys' ? '👦' : g === 'Girls' ? '👧' : '🤝'} {g}
            </motion.button>
          ))}
        </div>
      </Section>

      <Section title="Sizes">
        <div className="flex flex-wrap gap-2">
          {allSizes.map(s => (
            <motion.button key={s} whileTap={{ scale: 0.88 }} onClick={() => toggleSize(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${selectedSizes.includes(s) ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-200 text-gray-600 hover:border-purple-400'}`}>
              {s}
            </motion.button>
          ))}
        </div>
      </Section>
    </div>
  );
}
