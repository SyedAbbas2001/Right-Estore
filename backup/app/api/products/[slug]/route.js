import { NextResponse } from 'next/server';
import { getProductBySlug } from '@/data/products';

export async function GET(request, { params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}
