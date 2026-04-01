'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrid2, faList, faFilter, faChevronDown, faXmark, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import ProductCard from '@/components/shop/ProductCard';
import ProductFilters from '@/components/shop/ProductFilters';
import { categories as staticCategories } from '@/data/products';

const sorts = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Best Rating' },
  { value: 'discount', label: 'Biggest Discount' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('category');
  const filterParam = searchParams.get('filter');
  const searchParam = searchParams.get('search') || searchParams.get('q');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [grid, setGrid] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selSizes, setSelSizes] = useState([]);
  const [selGenders, setSelGenders] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    fetchProducts();
  }, [catParam, filterParam, searchParam, sort]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort, limit: '100' });
      if (catParam) params.set('category', catParam);
      if (filterParam) params.set('filter', filterParam);
      if (searchParam) params.set('search', searchParam);

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let r = [...products];
    r = r.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selSizes.length) r = r.filter(p => p.sizes?.some(s => selSizes.includes(s)));
    if (selGenders.length) r = r.filter(p => selGenders.includes(p.gender));
    return r;
  }, [products, priceRange, selSizes, selGenders]);

  const paginated = filtered.slice(0, page * perPage);
  const hasMore = paginated.length < filtered.length;

  const pageTitle = catParam
    ? staticCategories.find(c => c.slug === catParam)?.name || 'Products'
    : filterParam === 'new' ? 'New Arrivals'
    : filterParam === 'sale' ? 'Sale Items'
    : searchParam ? `"${searchParam}"`
    : 'All Products';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 py-10 sm:py-14 px-4 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl text-white mb-2">{pageTitle}</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-white/80 font-semibold text-sm sm:text-base">
          {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters priceRange={priceRange} setPriceRange={setPriceRange}
              selectedSizes={selSizes} setSelectedSizes={setSelSizes}
              selectedGenders={selGenders} setSelectedGenders={setSelGenders}
              activeCategory={catParam} />
          </aside>

          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 bg-white rounded-2xl p-3 sm:p-4 shadow-soft">
              <div className="flex items-center gap-2">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setFiltersOpen(true)}
                  className="lg:hidden btn-outline flex items-center gap-2 text-xs sm:text-sm py-2">
                  <FontAwesomeIcon icon={faFilter} className="w-3.5 h-3.5" /> Filters
                </motion.button>
                <span className="text-gray-400 font-semibold text-xs hidden md:block">{filtered.length} items</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <select value={sort} onChange={e => setSort(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 pr-7 sm:pr-8 text-xs sm:text-sm font-bold text-gray-700 focus:outline-none focus:border-purple-400 cursor-pointer">
                    {sorts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <FontAwesomeIcon icon={faChevronDown} className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                </div>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setGrid(true)}
                    className={`p-2 ${grid ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                    <FontAwesomeIcon icon={faGrid2} className="w-4 h-4" />
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setGrid(false)}
                    className={`p-2 ${!grid ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                    <FontAwesomeIcon icon={faList} className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Category pills */}
            {!catParam && (
              <div className="flex gap-2 flex-wrap mb-5 overflow-x-auto scrollbar-hide pb-1">
                {staticCategories.map(cat => (
                  <a key={cat.id} href={`/products?category=${cat.slug}`}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-full border border-gray-200 text-xs font-bold text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-all shadow-soft whitespace-nowrap">
                    <span>{cat.emoji}</span>{cat.name}
                  </a>
                ))}
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <FontAwesomeIcon icon={faSpinner} className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                  <p className="font-display text-xl text-purple-600">Loading products...</p>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <div className="text-6xl mb-4"><FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-300 w-16 h-16" /></div>
                <h3 className="font-display text-2xl text-gray-700 mb-3">No products found</h3>
                <p className="text-gray-500 font-semibold mb-6 text-sm">Try adjusting filters or search</p>
                <a href="/products" className="btn-primary">Browse All Products</a>
              </motion.div>
            ) : (
              <>
                <div className={`grid gap-3 sm:gap-4 md:gap-5 ${grid ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                  {paginated.map((product, i) => (
                    <motion.div key={product._id || product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.05, 0.4) }}>
                      <ProductCard product={{ ...product, id: product._id || product.id }} priority={i < 4} />
                    </motion.div>
                  ))}
                </div>
                {hasMore && (
                  <div className="text-center mt-10">
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setPage(p => p + 1)} className="btn-secondary px-10">
                      Load More Products
                    </motion.button>
                    <p className="text-gray-400 text-xs font-semibold mt-3">Showing {paginated.length} of {filtered.length}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40" onClick={() => setFiltersOpen(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl max-h-[80vh] overflow-y-auto">
              <div className="p-5">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-display text-2xl">Filters</h3>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setFiltersOpen(false)}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                    <FontAwesomeIcon icon={faXmark} className="w-4 h-4 text-gray-500" />
                  </motion.button>
                </div>
                <ProductFilters priceRange={priceRange} setPriceRange={setPriceRange}
                  selectedSizes={selSizes} setSelectedSizes={setSelSizes}
                  selectedGenders={selGenders} setSelectedGenders={setSelGenders}
                  activeCategory={catParam} />
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setFiltersOpen(false)} className="btn-primary w-full mt-5 py-4 justify-center">
                  Apply Filters
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🧸</div>
          <p className="font-display text-2xl text-purple-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
