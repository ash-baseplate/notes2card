import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // This is the url to which the customer will be redirected when they're done
    // managing their billing with the portal.
    const returnUrl = process.env.HOST_URL
      ? `${process.env.HOST_URL}/dashboard/upgrade`
      : 'https://google.com';
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return NextResponse.json(portalSession);
  } catch (error) {
    console.error('Manage payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
