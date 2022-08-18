const express = require('express');
const app = express();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.post('/payment', cors(), async (req, res) => {
  let { amount, id } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'AUD',
      description: 'WorkflowU monthly subscription',
      payment_method: id,
      confirm: true,
    });

    console.log('Payment', payment);
    res.json({
      success: true,
      message: 'Payment successful',
    });
  } catch (error) {
    console.log('Error', error);
    res.json({
      success: false,
      message: 'Payment failed',
    });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
