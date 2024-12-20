const express = require('express');
const { createPaymentIntent } = require('../services/stripeService');
const router = express.Router();

router.post('/payment-intent', async (req, res) => {
    const { amount } = req.body;
    try {
        const clientSecret = await createPaymentIntent(amount);
        res.send({ clientSecret });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
