const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { storeUserData, getUserData } = require('./controllers/userController'); // Ensure getUserData is defined
// const { customMiddleware } = require('./middleware/customMiddleware');

dotenv.config();

const app = express();

// Use CORS to allow cross-origin requests
app.use(cors());

// Middleware to log CORS headers
app.use((req, res, next) => {
    console.log('CORS headers applied:', res.getHeaders());
    next();
});

// Use custom middleware
// app.use(customMiddleware);

// Route for storing user data (unchanged)
app.get('/redirect', async (req, res) => {
    const { username, userid } = req.query;

    if (!username || !userid) {
        return res.status(400).send('Missing username or userid');
    }

    try {
        await storeUserData(username, userid);
        const redirectUrl = `${frontendUrl}/display?username=${encodeURIComponent(username)}&userid=${encodeURIComponent(userid)}`;
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Error adding user: ', error);
        res.status(500).send('Error storing user data');
    }
});

// New route to fetch user data
app.get('/api/users/:userId', async (req, res) => {
    console.log(`Received request for ${req.method} ${req.url}`);
    const { userId } = req.params;

    try {
        const userData = await getUserData(userId); // Implement getUserData in your controller
        if (userData) {
            res.json(userData);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching user data: ', error);
        res.status(500).send('Error fetching user data');
    } finally {
        console.log('Response Headers:', res.getHeaders()); // Log headers just before sending the response
    }
});


module.exports = app;
