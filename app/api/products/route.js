import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/products — public listing with filters
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const filter = searchParams.get('filter');
    const search = searchParams.get('search') || searchParams.get('q');
    const sort = searchParams.get('sort') || 'createdAt';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const query = { isActive: true };
    if (category) query.category = category;
    if (filter === 'new') query.isNew = true;
    if (filter === 'sale') query.discount = { $gt: 0 };
    if (filter === 'featured') query.isFeatured = true;
    if (search) query.$text = { $search: search };

    const sortObj = {};
    if (sort === 'price-asc') sortObj.price = 1;
    else if (sort === 'price-desc') sortObj.price = -1;
    else if (sort === 'rating') sortObj['reviews.rating'] = -1;
    else sortObj.createdAt = -1;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ products, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/products — admin only
export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();
    const body = await request.json();

    // Auto-generate slug
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      // Ensure unique slug
      const exists = await Product.findOne({ slug: body.slug });
      if (exists) body.slug = body.slug + '-' + Date.now();
    }

    // Calculate discount
    if (body.price && body.originalPrice && body.originalPrice > body.price) {
      body.discount = Math.round(((body.originalPrice - body.price) / body.originalPrice) * 100);
    }

    const product = await Product.create(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) return NextResponse.json({ error: 'Product with this slug already exists' }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
