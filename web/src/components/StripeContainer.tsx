import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

const StripeContainer = (): React.ReactElement | null => {
  const PUBLIC_KEY = process.env.REACT_APP_STRIPE_TEST;

  if (!PUBLIC_KEY) {
    return null;
  }
  const stripeTestPromise = loadStripe(PUBLIC_KEY);

  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm />
    </Elements>
  );
};

export default StripeContainer;
