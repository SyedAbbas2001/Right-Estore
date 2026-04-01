import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import { products } from '@/data/products';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faSparkles } from '@fortawesome/free-solid-svg-icons';

export default function NewArrivals() {
  const newProducts = products.filter(p => p.isNew).slice(0, 4);
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
          <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <div className="text-center mt-6 sm:hidden">
        <Link href="/products?filter=new" className="btn-outline text-sm">See All New Arrivals</Link>
      </div>
    </section>
  );
}
