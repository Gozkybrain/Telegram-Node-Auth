const express = require('express');
const app = require('./app'); // Assuming your main app logic is in app.js

const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORTS || 2020;

// Define a basic route to check if the server is running
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
