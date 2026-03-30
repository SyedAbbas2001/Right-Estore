'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/shop/ProductCard';
import { products } from '@/data/products';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';

  const results = q.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description?.toLowerCase().includes(q.toLowerCase()) ||
        p.tags?.some(t => t.toLowerCase().includes(q.toLowerCase())) ||
        p.category.toLowerCase().includes(q.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-gray-800 mb-2">
            {q ? `Search: "${q}"` : 'Search Products'}
          </h1>
          {q && (
            <p className="text-gray-500 font-semibold">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {!q && (
          <div className="text-center py-20">
            <div className="text-7xl mb-4">🔍</div>
            <h2 className="font-display text-2xl text-gray-700 mb-3">What are you looking for?</h2>
            <p className="text-gray-500 font-semibold mb-6">Try searching for clothes, toys, baby essentials...</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {['unicorn dress', 'wooden toys', 'onesie', 'backpack', 'bunny'].map(term => (
                <a
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:border-candy-purple hover:text-candy-purple transition-colors shadow-soft"
                >
                  {term}
                </a>
              ))}
            </div>
          </div>
        )}

        {q && results.length === 0 && (
          <div className="text-center py-20">
            <div className="text-7xl mb-4">😔</div>
            <h2 className="font-display text-2xl text-gray-700 mb-3">No results found</h2>
            <p className="text-gray-500 font-semibold mb-6">
              We couldn't find anything matching "<strong>{q}</strong>"
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/products" className="btn-primary">Browse All Products</Link>
              <a href="/search" className="btn-outline">Clear Search</a>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {results.map((product, i) => (
              <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <ProductCard product={product} priority={i < 4} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-bounce">🔍</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
