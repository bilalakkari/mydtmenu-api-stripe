const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { createPaymentIntent } = require('../services/stripeService');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/payment-intent', async (req, res) => {
    const { amount } = req.body;
    try {
        const clientSecret = await createPaymentIntent(amount);
        res.send({ clientSecret });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


router.post('/subscribe', async (req, res) => {
    const { token, email, planId } = req.body;

    try {
        // Step 1: Check if the customer already exists by email
        let customer = await stripe.customers.list({
            email: email,
            limit: 1,  // We only need the first result
        });

        if (customer.data.length > 0) {
            // Customer already exists, use the existing customer
            customer = customer.data[0];
        } else {
            // Step 2: If the customer doesn't exist, create a new one
            customer = await stripe.customers.create({
                email: email,
                source: token,
            });
        }

        // Step 3: Retrieve the plan's price ID (use your database or hardcode it)
        let priceId = '';
        if (planId === '1') {
            priceId = 'price_1QanIrGEbUPRSeVEXhUhZF36';
        }

        // Step 4: Create a subscription if not already subscribed
        const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            // status: 'active',
        });

        if (subscriptions.data.length > 0) {
            // Customer is already subscribed to a plan
            return res.status(400).json({ error: 'Customer is already subscribed' });
        }

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            trial_period_days: 1,
            expand: ['latest_invoice.payment_intent'],
        });



        // Return subscription details to the client
        res.json({
            message: 'Subscription successful',
            subscription: subscription,
        });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: error.message });
    }
});

const sendPortalEmail = async (email, portalUrl) => {
    // Set up your email transport options
    const transporter = nodemailer.createTransport({
        // host: "smtp.gmail.com",
        // port: 465,
        // secure: true,
        // auth: {
        //     user: "bilal.akkari845@gmail.com",  // Your email address
        //     pass: "clozivohpobjkmep",  // Your app password
        // },
        host: "mail.privateemail.com", // Namecheap's Private Email SMTP server
        port: 587, // Recommended port for secure connections with STARTTLS
        secure: true, // Use `false` if you're using STARTTLS; otherwise, `true` for SSL/TLS
        auth: {
            user: "info@mydtmenu.com", // Replace with your Namecheap Private Email address
            pass: "LALIBAKKARI18@a", // Replace with your email account password or app-specific password
        },
    });

    // Construct the email content
    const mailOptions = {
        from: "info@mydtmenu.com",  // Sender address
        to: email,  // Receiver's email
        subject: 'Update Your Subscription or Payment Info',
        text: `Click the link below to manage your subscription and payment details:
        
        ${portalUrl}

        If you did not request this, please ignore this email.`,
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log('Portal email sent!');
    } catch (error) {
        console.error('Failed to send portal email:', error);
    }
};

router.post('/send-update-email', async (req, res) => {
    const { email, customerId } = req.body;  // Get email and customerId from the request

    try {
        // Create a Stripe customer portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: 'http://localhost:4200/dashboard',  // Redirect after portal interaction
        });

        // Send email to the user with the portal link
        await sendPortalEmail(email, session.url);

        res.json({ message: 'Portal email sent successfully!' });
    } catch (error) {
        console.error('Failed to create session or send email:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;