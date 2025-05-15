const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Email sending function
const sendPortalEmail = async (data) => {
    try {
        // // Set up your email transport options
        // const transporter = nodemailer.createTransport({
        //     host: "mail.privateemail.com", // Namecheap's Private Email SMTP server
        //     port: 587, // STARTTLS port
        //     secure: false, // Use false for STARTTLS, true for SSL/TLS
        //     auth: {
        //         user: "info@mydtmenu.com", // Your Namecheap Private Email address
        //         pass: "LALIBAKKARI18@a", // Your email account password or app-specific password
        //     },
        // });

        // Set up your email transport options
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // Namecheap's Private Email SMTP server
            port: 465, // STARTTLS port
            secure: true, // Use false for STARTTLS, true for SSL/TLS
            auth: {
                user: "bilal.akkari101@gmail.com", // Your Namecheap Private Email address
                pass: "fycl yzrc mlcb qjic", // Your email account password or app-specific password
            },
        });

        // Construct the email content
        const mailOptions = {
            from: '"Centre LaReussite', // Sender address
            to: "bilal.akkari845@gmail.com", // Receiver's email
            subject: 'You got a new Message',
            text: `
                Name : ${data.name}
                Email : ${data.email}
                Message : ${data.message}
            `,
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
router.post('/msg', async (req, res) => {
    const { data } = req.body; // Get the email from the request body

    if (!data) {
        return res.status(400).json({ error: 'data is required.' });
    }

    try {
        // Call the email sending function
        await sendPortalEmail(data);

        // Respond with success
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Failed to send email:', error);
        res.status(500).json({ error: 'Failed to send the email. Please try again later.' });
    }
});


module.exports = router;