import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ active: false, error: "Email required" }, { status: 400 });

    // Find customer by email
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0];
    if (!customer) return NextResponse.json({ active: false });

    // List subscriptions for the customer
    const subs = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 1 });
    const subscription = subs.data.find(sub => sub.status === "active" || sub.status === "trialing");
    if (subscription) {
      return NextResponse.json({ active: true, subscription });
    } else {
      return NextResponse.json({ active: false });
    }
  } catch (err: any) {
    return NextResponse.json({ active: false, error: err.message }, { status: 400 });
  }
}
