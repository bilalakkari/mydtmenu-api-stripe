const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_DAMLAJ);

// Create a Payment Intent (for processing one-time payments)
async function createPaymentIntent(amount) {
    console.log(amount);

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'cad',
    });
    return paymentIntent.client_secret;
}

module.exports = {
    createPaymentIntent
};
