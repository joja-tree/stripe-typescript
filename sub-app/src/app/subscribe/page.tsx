"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import SubscriptionForm from "../../components/SubscriptionForm";
import SubscriptionContent from "../../components/SubscriptionContent";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SubscriptionPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  // Handles subscription creation and sets clientSecret for Stripe Elements
  const handleCreateSubscription = async (email: string, paymentMethodId: string) => {
    setClientSecret(null);
    setSubscriptionId(null);
    try {
      const res = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          paymentMethodId,
          priceId: "price_1RbiUy4SgPzZolqtVcAZA29V" // TODO: Replace with your real Stripe price ID
        })
      });
      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setSubscriptionId(data.subscriptionId);
        return data.clientSecret;
      } else {
        throw new Error(data.error || "Failed to create subscription");
      }
    } catch (err: any) {
      alert(err.message);
      return null;
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h1>Subscribe to a Plan</h1>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <SubscriptionForm onSubscriptionCreated={handleCreateSubscription} />
        </Elements>
      ) : (
        <Elements stripe={stripePromise}>
          <SubscriptionForm onSubscriptionCreated={handleCreateSubscription} />
        </Elements>
      )}
      {subscriptionId && (
        <div style={{ marginTop: 16, color: "green" }}>
          Subscription created! ID: {subscriptionId}
        </div>
      )}
      <hr style={{ margin: '40px 0' }} />
      <SubscriptionContent />
    </div>
  );
}
