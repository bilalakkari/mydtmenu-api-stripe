const express = require('express');
const { checkPostalCode } = require('../services/postalService');
const router = express.Router();

router.post('/checkpostal_code', async (req, res) => {
    try {
        const message = await checkPostalCode(req.body.postal_code);
        res.json({ message });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
