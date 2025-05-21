const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const cors = require("cors")
const connectDB = require('./config/db'); // adjust the path if needed

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

const morgan = require('morgan');

// Custom token for current time
morgan.token('time', () => new Date().toISOString());

// Morgan format string
const format = ':time :status :method :url';

app.use(morgan(format));

app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.use('/images', express.static(path.join(__dirname, 'images')));


(async () => {
    const db = await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();
