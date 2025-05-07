const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectDB = require('./config/db'); // adjust the path if needed

const app = express();
const PORT = process.env.PORT || 5000;



(async () => {
    const db = await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();
