import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = (): React.ReactElement => {
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cardElement = elements?.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    const stripePaymentMethod = await stripe?.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (!stripePaymentMethod?.error) {
      try {
        const paymentMethodLoad = stripePaymentMethod?.paymentMethod;
        const response = await axios.post('http://localhost:4000/payment', {
          amount: 1000,
          id: paymentMethodLoad?.id,
        });

        if (response.data.success) {
          console.log('Payment successful');
          setSuccess(true);
        }
      } catch (error) {
        console.log('Error', error);
      }
    } else {
      console.log(stripePaymentMethod.error.message);
    }
  };

  return (
    <>
      {!success ? (
        <form onSubmit={handleSubmit}>
          <fieldset className="FormGroup">
            <div className="FormRow">
              <CardElement
                options={{
                  iconStyle: 'solid',
                  style: {
                    base: {
                      iconColor: '#7FCC80',
                      color: '#343D46',
                      fontWeight: 500,
                      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                      fontSize: '16px',
                      fontSmoothing: 'antialiased',
                      ':-webkit-autofill': { color: '#fce883' },
                      '::placeholder': { color: '#525C66' },
                    },
                    invalid: {
                      iconColor: 'red',
                      color: 'red',
                    },
                  },
                }}
              />
            </div>
          </fieldset>
          <button>Process payment</button>
        </form>
      ) : (
        <div>
          <h2 style={{ textAlign: 'center' }}>
            Thank you for your payment. Your account is now upgraded.
          </h2>
        </div>
      )}
    </>
  );
};

export default PaymentForm;
