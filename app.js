require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const paymentRoutes = require('./routes/paymentRoutes');
const postalRoutes = require('./routes/postalRoutes');
const utilityRoutes = require('./routes/utilityRoutes');
const sendEmailChawRoutes = require('./routes/sendEmailChawRoutes')
const sendEmail = require('./routes/sendEmail');

// centrelareussite routes
const jsonRoute = require('./routes/centrelareussite/jsonRoute');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use('/api', paymentRoutes);
app.use('/api', postalRoutes);
app.use('/api', utilityRoutes);
app.use('/api', sendEmailChawRoutes);
app.use('/api', sendEmail);

// centrelareussite api
app.use("/api/jsonRoute", jsonRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
