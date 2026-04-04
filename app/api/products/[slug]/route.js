import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { slug } = await params;
    const product = await Product.findOne({ slug, isActive: true }).lean();
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    // Serialize reviews — convert ObjectIds and dates to plain strings
    const serialized = {
      ...product,
      _id: product._id?.toString(),
      reviews: (product.reviews || []).map(r => ({
        _id: r._id?.toString() || '',
        userId: r.userId?.toString() || '',
        userName: r.userName || '',
        rating: Number(r.rating) || 0,
        title: r.title || '',
        comment: r.comment || '',
        verified: Boolean(r.verified),
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : '',
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : '',
      })),
    };

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Product GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();
    const { slug } = await params;
    const body = await request.json();

    if (body.price && body.originalPrice && body.originalPrice > body.price) {
      body.discount = Math.round(((body.originalPrice - body.price) / body.originalPrice) * 100);
    }

    const product = await Product.findOneAndUpdate({ slug }, body, { new: true, runValidators: true });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();
    const { slug } = await params;
    await Product.findOneAndUpdate({ slug }, { isActive: false });
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}