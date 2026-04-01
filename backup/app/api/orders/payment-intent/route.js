import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { amount, currency = 'pkr', metadata = {} } = await request.json();

    if (!amount || amount < 50) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Only initialize Stripe if secret key is set
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey.startsWith('sk_test_your')) {
      // Demo mode: return a fake client secret
      return NextResponse.json({
        clientSecret: 'demo_pi_fake_secret_for_testing',
        demo: true,
        message: 'Demo mode: configure STRIPE_SECRET_KEY in .env for real payments',
      });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses smallest currency unit
      currency,
      automatic_payment_methods: { enabled: true },
      metadata,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
