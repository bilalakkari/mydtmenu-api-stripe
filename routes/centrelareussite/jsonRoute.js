const fs = require("fs");
const express = require("express");
const axios = require("axios");
const router = express.Router();

// Ensure httpsAgent is defined if needed
const https = require("https");
const agent = new https.Agent({ rejectUnauthorized: false }); // Adjust this based on your security needs

router.post("/call-api", async (req, res) => {
    try {
        const apiUrl = "https://localhost:7003/api/DataNew";
        const { router: apiRoute, payload, month, year } = req.body; // Destructure correctly

        // Validate input
        if (!apiRoute) {
            return res.status(400).json({ error: "API route is required" });
        }
        if (!payload) {
            return res.status(400).json({ error: "Payload is required" });
        }

        const fullUrl = `${apiUrl}${apiRoute}?month=${month}&year=${year}`;
        console.log(`Calling external API: ${fullUrl}`);

        // Make the POST request to the external API
        const response = await axios.post(fullUrl, payload, { httpsAgent: agent });

        if (!response.data) {
            return res.status(404).json({ error: "No data found for this month and year" });
        }

        console.log("External API response:", response.data);

        // Extract data if necessary
        const dataExtract = await extract(response.data);

        // Return successful response
        res.json({
            message: "API call successful",
            externalData: dataExtract
        });

    } catch (error) {
        console.error("Error calling external API:", error.message);

        // Handle specific error cases
        if (error.response) {
            if (error.response.status === 404 || error.response.data === "No data found for this month and year") {
                return res.status(404).json({ error: "No data found for this month and year" });
            }
            return res.status(error.response.status).json({
                error: "External API error",
                details: error.response.data
            });
        }

        // Return 500 for any other errors
        res.status(500).json({
            error: "Failed to call external API",
            details: error.message
        });
    }
});

module.exports = router;


router.post("/json", (req, res) => {
    try {
        // Check if req.body.p is a string or an object
        let jsonData = req.body.p;

        let j = extract(jsonData);

        res.json({ message: "Success", data: j });

    } catch (error) {
        console.error("Error parsing JSON:", error);
        res.status(400).json({ message: "Invalid JSON format", error: error.message });
    }
});

async function extract(users) {
    // Array to store structured invoice data
    const timeDependInvoice = [];

    // Iterate through the invoices
    users.forEach(user => {
        const invoiceObj = {
            InvoiceId: user.InvoiceId,
            Description: user.Description,
            TotalTeacher: user.TotalTeacher,
            TotalParent: user.TotalParent,
            EntryDate: user.EntryDate,
            Student: user.Student,
            dates: {}
        };

        user.InvoiceDetails.forEach(detail => {

            const timeKey = `${detail.hours}h ${detail.minutes}m`;

            if (!invoiceObj.dates[timeKey]) {
                invoiceObj.dates[timeKey] = {
                    time: "",
                    count: 0,
                    InvoiceDetails: []
                };
            }

            invoiceObj.dates[timeKey].time = timeKey;
            invoiceObj.dates[timeKey].count += detail.quantity;
            invoiceObj.dates[timeKey].InvoiceDetails.push({
                invoice_details_id: detail.invoice_details_id,
                description: detail.description,
                date: detail.date,
            });
        });

        // Push the structured invoice data into the array
        timeDependInvoice.push(invoiceObj);
    });

    // Display the results
    return timeDependInvoice;

}


module.exports = router;