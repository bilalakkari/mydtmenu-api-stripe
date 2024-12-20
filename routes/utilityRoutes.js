const express = require('express');
const { encrypt, decrypt } = require('../cryptoUtils');
const router = express.Router();

router.post('/encrypt_data', (req, res) => {
    const { plainText } = req.body;
    if (!plainText) {
        return res.status(400).json({ error: 'plainText is required' });
    }

    try {
        const encryptedText = encrypt(plainText);
        res.json({ encryptedText });
    } catch (error) {
        res.status(500).json({ error: 'Encryption failed', details: error.message });
    }
});

router.post('/decrypt_data', (req, res) => {
    const { encryptedText } = req.body;
    if (!encryptedText) {
        return res.status(400).json({ error: 'encryptedText is required' });
    }

    try {
        const decryptedText = decrypt(encryptedText);
        res.json({ decryptedText });
    } catch (error) {
        res.status(500).json({ error: 'Decryption failed', details: error.message });
    }
});

module.exports = router;
