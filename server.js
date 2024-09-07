const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Add path module
const { getUserData } = require('./controllers/userController');
const bot = require('./bot');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2020;

// Middleware
app.use(cors({
    origin: 'https://pharmacheck.netlify.app'
}));
app.use(express.json());

// Serve static files (for CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route to get user data
app.get('/api/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const userData = await getUserData(userId);

        if (userData) {
            res.json(userData);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Serve the HTML file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

bot.startBot();
