import { db } from '@/configs/db';
import { USER_TABLE, PAYMENT_TABLE } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let data;
  let eventType;

  const body = await req.text();

  // Check if webhook signing is configured.
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers.get('stripe-signature');

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured,
    // retrieve the event data directly from the request body.
    const jsonBody = JSON.parse(body);
    data = jsonBody.data;
    eventType = jsonBody.type;
  }

  console.log('📩 Webhook received:', eventType);

  switch (eventType) {
    case 'checkout.session.completed':
      // Payment is successful and the subscription is created.
      // Save the Stripe customer ID and mark as member.
      console.log('✅ checkout.session.completed for:', data.object.customer_details?.email);
      await db
        .update(USER_TABLE)
        .set({
          isMember: true,
          customerId: data.object.customer,
        })
        .where(eq(USER_TABLE.email, data.object.customer_details.email));

      break;
    case 'invoice.paid':
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      //Record to Payment_table table
      console.log('✅ invoice.paid for:', data.object.customer_email);
      await db.insert(PAYMENT_TABLE).values({
        customerId: data.object.customer_email,
        sessionId: data.object.subscription,
      });

      break;
    case 'invoice.payment_failed':
      // The payment failed or the customer doesn't have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      console.log('❌ invoice.payment_failed for:', data.object.customer_email);
      await db
        .update(USER_TABLE)
        .set({
          isMember: false,
          customerId: null,
        })
        .where(eq(USER_TABLE.email, data.object.customer_email));
      break;
    case 'customer.subscription.deleted':
      // Subscription cancelled — revoke membership
      console.log('🚫 customer.subscription.deleted for customer:', data.object.customer);
      await db
        .update(USER_TABLE)
        .set({
          isMember: false,
          customerId: null,
        })
        .where(eq(USER_TABLE.customerId, data.object.customer));
      break;
    default:
      console.log('⚠️ Unhandled event type:', eventType);
    // Unhandled event type
  }

  return NextResponse.json({ result: 'success' });
}
