import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { getUserFromRequest } from '@/lib/auth';

function generateOrderId() {
  return 'RE' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2,5).toUpperCase();
}

export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query = user.role === 'admin' ? {} : { userId: user.id };
    if (status && status !== 'all') query.orderStatus = status;

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { items, shippingAddress, paymentMethod = 'cod', couponCode, notes } = body;

    if (!items || !items.length) return NextResponse.json({ error: 'No items' }, { status: 400 });
    if (!shippingAddress?.firstName || !shippingAddress?.email) {
      return NextResponse.json({ error: 'Shipping address incomplete' }, { status: 400 });
    }

    const user = await getUserFromRequest(request);
    const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);
    const shippingFee = subtotal >= 2000 ? 0 : 150;
    const total = subtotal + shippingFee;

    const order = await Order.create({
      orderId: generateOrderId(),
      userId: user?.id || 'guest',
      customerName: shippingAddress.firstName + ' ' + shippingAddress.lastName,
      customerEmail: shippingAddress.email,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      total,
      couponCode: couponCode || '',
      notes: notes || '',
    });

    return NextResponse.json({ order, message: 'Order placed successfully!' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
