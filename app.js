require('dotenv').config(); // Load environment variables

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use the environment variable
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/payment-intent', async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'cad',
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

const port = process.env.PORT || 3000; // Use PORT from .env or fallback to 3000
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
