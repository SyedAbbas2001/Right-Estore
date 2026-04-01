import { NextResponse } from 'next/server';
import { products } from '@/data/products';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const filter = searchParams.get('filter');
  const sort = searchParams.get('sort') || 'featured';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  let result = [...products];

  if (category) result = result.filter(p => p.category === category);
  if (filter === 'new') result = result.filter(p => p.isNew);
  if (filter === 'sale') result = result.filter(p => p.discount > 0);
  if (filter === 'featured') result = result.filter(p => p.isFeatured);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.tags?.some(t => t.includes(q))
    );
  }

  switch (sort) {
    case 'price-asc': result.sort((a, b) => a.price - b.price); break;
    case 'price-desc': result.sort((a, b) => b.price - a.price); break;
    case 'rating': result.sort((a, b) => b.rating - a.rating); break;
    case 'newest': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
  }

  const total = result.length;
  const paginated = result.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    products: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
