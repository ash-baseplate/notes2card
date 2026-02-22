import { db } from '@/configs/db';
import { USER_TABLE } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const result = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, email));

    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = { ...result[0], activePlan: null };

    // If user is a member with a Stripe customer ID, fetch their active plan
    if (userData.isMember && userData.customerId) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const subscriptions = await stripe.subscriptions.list({
          customer: userData.customerId,
          status: 'active',
          limit: 1,
        });

        if (subscriptions.data.length > 0) {
          const priceId = subscriptions.data[0].items.data[0]?.price?.id;
          if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY) {
            userData.activePlan = 'yearly';
          } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY) {
            userData.activePlan = 'monthly';
          }
        }
      } catch (stripeError) {
        console.error('Error fetching Stripe subscription:', stripeError);
      }
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user status:', error);
    return NextResponse.json({ error: 'Failed to fetch user status' }, { status: 500 });
  }
}
