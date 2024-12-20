const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createPaymentIntent(amount) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'cad',
    });
    return paymentIntent.client_secret;
}

module.exports = { createPaymentIntent };
