import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Please login to review' }, { status: 401 });

    await connectDB();
    const { slug, rating, title, comment } = await request.json();

    if (!slug || !rating || !comment) {
      return NextResponse.json({ error: 'Slug, rating and comment required' }, { status: 400 });
    }

    const product = await Product.findOne({ slug });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    // Check if already reviewed
    const alreadyReviewed = product.reviews.find(r => r.userId?.toString() === user.id);
    if (alreadyReviewed) {
      return NextResponse.json({ error: 'You already reviewed this product' }, { status: 409 });
    }

    product.reviews.push({ userId: user.id, userName: user.name, rating, title, comment, verified: true });
    await product.save();

    return NextResponse.json({ message: 'Review submitted!', reviews: product.reviews }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
