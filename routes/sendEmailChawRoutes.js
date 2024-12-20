const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: "bilal.akkari845@gmail.com", // Replace with your email
        pass: "cloz ivoh pobj kmep", // Replace with your app password
    },
});

async function sendEmail(orderDetails) {
    const {
        comment,
        total,
        customeR_NAME,
        customeR_PHONE_NUMBER,
        items,
        deliverY_METHOD, // Delivery method
        addresS_DETAILS, // Address details
        postaL_CODE,     // Postal code
    } = orderDetails;

    // Generate the order items as a formatted string
    let orderItems = items.map(item => `${item.NAME} (Price: ${item.PRICE}, Quantity: ${item.QUANTITY})`).join('\n');

    // Adjust email content based on the delivery method
    let deliveryInfo = '';
    if (deliverY_METHOD === 'pickup') {
        deliveryInfo = 'The order is for pickup.';
    } else if (deliverY_METHOD === 'delivery') {
        deliveryInfo = `The order will be delivered to the customer at ${addresS_DETAILS}, Postal Code: ${postaL_CODE}.`;
    } else {
        deliveryInfo = 'Delivery method is not specified.';
    }

    // Create the email content
    const emailContent = `
        Order Details:

        Customer Name: ${customeR_NAME}
        Customer Phone Number: ${customeR_PHONE_NUMBER}
        Comment: ${comment}
        
        Delivery Information:
        ${deliveryInfo}

        Address Details: ${addresS_DETAILS}
        Postal Code: ${postaL_CODE}

        Items:
        ${orderItems}

        Total Price: ${total}
    `;

    const mailOptions = {
        from: process.env.GMAIL_USER,  // Sender email
        to: 'bilal.akkari1032@gmail.com',  // Recipient email (or the customer's email)
        subject: 'New Order Notification',
        text: emailContent, // Dynamic email content with order details
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}



// Route to send an email
router.post('/sendEmailChawkat', (req, res) => {
    console.log(req.body)

    sendEmail(req.body, (error, info) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Failed to send email', error });
        }
        res.status(200).json({ success: true, message: 'Email sent successfully', info });
    });
});

module.exports = router;
