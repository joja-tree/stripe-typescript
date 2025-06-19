"use client";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

interface Props {
  onSubscriptionCreated: (email: string, paymentMethodId: string) => Promise<string | null>;
}

export default function SubscriptionForm({ onSubscriptionCreated }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!stripe || !elements) {
      setError("Stripe not loaded");
      setLoading(false);
      return;
    }

    // 1. Create payment method
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not found");
      setLoading(false);
      return;
    }
    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: { email },
    });
    if (pmError || !paymentMethod) {
      setError(pmError?.message || "Failed to create payment method");
      setLoading(false);
      return;
    }

    // 2. Call API to create subscription and get clientSecret
    const clientSecret = await onSubscriptionCreated(email, paymentMethod.id);
    if (!clientSecret) {
      setLoading(false);
      return;
    }

    // 3. Confirm card payment
    const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);
    if (confirmError) {
      setError(confirmError.message || "Payment confirmation failed");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      marginTop: 24
    }}>
      <label style={{ fontWeight: 500, fontSize: 16 }}>
        Email
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px 12px',
            marginTop: 6,
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 15
          }}
        />
      </label>
      <label style={{ fontWeight: 500, fontSize: 16 }}>
        Card Details
        <div style={{
          padding: '10px 12px',
          borderRadius: 6,
          border: '1px solid #ccc',
          marginTop: 6
        }}>
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </label>
      <button type="submit" disabled={loading} style={{
        marginTop: 8,
        background: '#635bff',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        padding: '12px 0',
        fontWeight: 600,
        fontSize: 16,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1
      }}>
        {loading ? "Processing..." : "Subscribe"}
      </button>
      {error && <div style={{ color: "#d32f2f", fontWeight: 500 }}>{error}</div>}
      {success && <div style={{ color: "#388e3c", fontWeight: 500 }}>Subscription successful!</div>}
    </form>
  );
}
