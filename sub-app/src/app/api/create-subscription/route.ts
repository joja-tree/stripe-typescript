import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const { email, paymentMethodId, priceId } = await req.json();

    // 1. Create customer (or retrieve existing by email)
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customer = customers.data[0];
    if (!customer) {
      customer = await stripe.customers.create({ email, payment_method: paymentMethodId, invoice_settings: { default_payment_method: paymentMethodId } });
    } else {
      await stripe.customers.update(customer.id, { payment_method: paymentMethodId, invoice_settings: { default_payment_method: paymentMethodId } });
    }

    // 2. Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_settings: { payment_method_types: ["card"], save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    // 3. Get client secret for payment confirmation
    const paymentIntent = (subscription.latest_invoice as any)?.payment_intent;
    return NextResponse.json({ clientSecret: paymentIntent?.client_secret, subscriptionId: subscription.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
