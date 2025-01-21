const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Email sending function
const sendPortalEmail = async (email) => {
    try {
        // Set up your email transport options
        const transporter = nodemailer.createTransport({
            host: "mail.privateemail.com", // Namecheap's Private Email SMTP server
            port: 587, // STARTTLS port
            secure: false, // Use false for STARTTLS, true for SSL/TLS
            auth: {
                user: "info@mydtmenu.com", // Your Namecheap Private Email address
                pass: "LALIBAKKARI18@a", // Your email account password or app-specific password
            },
        });

        // Construct the email content
        const mailOptions = {
            from: '"MyDTMenu" <info@mydtmenu.com>', // Sender address
            to: email, // Receiver's email
            subject: 'Welcome to MyDTMenu!',
            text: `Hi there!

Welcome to MyDTMenu! We're excited to have you onboard. Explore our platform to start customizing your menu and providing a seamless experience to your customers.

If you have any questions, feel free to reach out to us at support@mydtmenu.com.

Best regards,  
The MyDTMenu Team`,
            html: `<p>Hi there!</p>
                   <p>Welcome to <strong>MyDTMenu</strong>! We're excited to have you onboard. Explore our platform to start customizing your menu and providing a seamless experience to your customers.</p>
                   <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@mydtmenu.com">support@mydtmenu.com</a>.</p>
                   <p>Best regards,<br>The MyDTMenu Team</p>`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Portal email sent!');
    } catch (error) {
        console.error('Failed to send portal email:', error);
        throw new Error('Could not send the email. Please check your SMTP settings.');
    }
};

// Route to send an email after signup
router.post('/send-email-after-signup', async (req, res) => {
    const { email } = req.body; // Get the email from the request body

    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    try {
        // Call the email sending function
        await sendPortalEmail(email);

        // Respond with success
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Failed to send email:', error);
        res.status(500).json({ error: 'Failed to send the email. Please try again later.' });
    }
});

module.exports = router;