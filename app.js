require('dotenv').config(); // Load environment variables

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use the environment variable
const bodyParser = require('body-parser');
const cors = require('cors');

const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

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

let users = {};

app.post('/api/checkpostal_code', async (req, res) => {
    const { postal_code } = req.body;
    console.log(req.body);

    try {
        // Assuming readDataFromFile is an asynchronous function
        await new Promise((resolve, reject) => {
            readDataFromFile((error, data) => {
                if (error) {
                    return reject(error);  // Handle error if file read fails
                }
                resolve(data);  // Resolve with the data once it's read
            });
        });

        // Remove spaces and clean postal code
        const cleaned_postal_code = postal_code.split(" ").join(""); // Remove spaces

        // Reformat postal code (Add space between 3rd and 4th character)
        const formatted_postal_code = cleaned_postal_code.slice(0, 3) + " " + cleaned_postal_code.slice(3);

        console.log(`Postal code after reformatting: ${formatted_postal_code}`);

        // Assuming 'equal' is a function that checks the validity of the postal code
        if (formatted_postal_code.length === 7 && equal(formatted_postal_code)) {
            console.log("Postal code matches!");
            res.json({ message: "Hi, and welcome, you are in the delivery area :)" });
        } else {
            console.log("Sorry, but you are not in the delivery area :(");
            res.json({ message: "Sorry, but you are not in the delivery area :(" });
        }
    } catch (error) {
        console.log("Error: ", error.message);
        res.status(500).send("Internal Server Error");
    }
});


function equal(postal_code) {
    // console.log(users); // Print users
    return users.includes(postal_code); // Check if postal_code exists in users array
}

function readDataFromFile(callback) {
    fs.readFile("postal_codes.json", (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }

        try {
            // Converting to JSON
            users = JSON.parse(data);
            callback(); // Call the callback after the data is loaded
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
        }
    });
}


const port = process.env.PORT || 3000; // Use PORT from .env or fallback to 3000
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
