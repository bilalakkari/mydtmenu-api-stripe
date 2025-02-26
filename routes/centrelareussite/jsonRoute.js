const fs = require("fs");
const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/call-api", async (req, res) => {
    try {
        const apiUrl = "https://bilalakkari01-001-site3.ntempurl.com/api/DataNew";

        const { router, payload } = req.body; // Expecting `apiUrl` and `payload` from request body

        if (!apiUrl) {
            return res.status(400).json({ error: "API URL is required" });
        }

        // Make the POST request to the external API
        const response = await axios.post(apiUrl + router, payload);

        const dataExtract = await extract(response.data);

        // Send back the response from the external API
        res.json({
            message: "API call successful",
            externalData: dataExtract
        });

    } catch (error) {
        console.error("Error calling external API:", error.message);
        res.status(500).json({
            error: "Failed to call external API",
            details: error.response ? error.response.data : error.message
        });
    }
});

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
            });
        });

        // Push the structured invoice data into the array
        timeDependInvoice.push(invoiceObj);
    });

    // Display the results
    return timeDependInvoice;

}


module.exports = router;