import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In-memory store for demo (replace with MongoDB in production)
const orders = [];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const userOrders = userId ? orders.filter(o => o.userId === userId) : orders;

  return NextResponse.json({ orders: userOrders });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, shippingAddress, paymentMethod, userId } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal >= 2000 ? 0 : 150;
    const total = subtotal + shipping;

    const order = {
      id: `KS${uuidv4().slice(0, 6).toUpperCase()}`,
      userId: userId || 'guest',
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      total,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(order);

    return NextResponse.json({ order, message: 'Order placed successfully!' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
