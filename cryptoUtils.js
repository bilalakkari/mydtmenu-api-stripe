const crypto = require('crypto');
require('dotenv').config(); // Load environment variables

// Load SECRET_KEY and IV from environment variables
const SECRET_KEY = Buffer.from(process.env.SECRET_KEY, 'hex');
const IV = Buffer.from(process.env.IV, 'hex');

/**
 * Encrypts a plain text.
 * @param {string} plainText - The text to encrypt.
 * @returns {string} - The encrypted text in base64 format.
 */
function encrypt(plainText) {
    const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, IV);
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return `${IV.toString('base64')}:${encrypted}`; // Combine IV and encrypted text
}

/**
 * Decrypts an encrypted text.
 * @param {string} encryptedText - The text to decrypt (IV:encrypted format).
 * @returns {string} - The decrypted plain text.
 */
function decrypt(encryptedText) {
    const [iv, encrypted] = encryptedText.split(':').map(part => Buffer.from(part, 'base64'));
    const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encrypt, decrypt };
