import { NextResponse } from 'next/server';
import { reviews } from '@/data/products';

const allReviews = [...reviews];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  const result = productId
    ? allReviews.filter(r => r.productId === productId)
    : allReviews;

  const avgRating = result.length
    ? result.reduce((acc, r) => acc + r.rating, 0) / result.length
    : 0;

  return NextResponse.json({
    reviews: result,
    count: result.length,
    avgRating: Math.round(avgRating * 10) / 10,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, userId, userName, rating, title, comment } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const review = {
      id: `r${Date.now()}`,
      productId,
      userId: userId || 'anonymous',
      userName: userName || 'Anonymous',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=C084FC&color=fff`,
      rating,
      title: title || '',
      comment,
      date: new Date().toLocaleDateString('en-PK'),
      helpful: 0,
      verified: false,
    };

    allReviews.push(review);

    return NextResponse.json({ review, message: 'Review submitted!' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
