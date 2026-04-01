import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function NewArrivals({ initialProducts = [] }) {
  // Only include products where isNew is true
  const newProducts = initialProducts.filter(p => p.isNew);
  console.log("New arrivals:", newProducts);

  if (newProducts.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-4 py-2 mb-3">
            <span>🆕</span>
            <span className="text-emerald-700 font-black text-sm">Just Arrived</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-gray-800">New Arrivals</h2>
        </div>
        <Link href="/products?filter=new" className="btn-outline text-sm hidden sm:flex items-center gap-1">
          See All <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
        {newProducts.map((product, i) => (
          <div key={product._id || product.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <ProductCard product={{ ...product, id: product._id || product.id }} />
          </div>
        ))}
      </div>
      <div className="text-center mt-6 sm:hidden">
        <Link href="/products?filter=new" className="btn-outline text-sm">See All New Arrivals</Link>
      </div>
    </section>
  );
}