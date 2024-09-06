const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { getUserData } = require('./controllers/userController'); // Import getUserData from userController
const bot = require('./bot');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2020;

// Middleware
app.use(cors({
    origin: 'https://pharmacheck.netlify.app' // Allow only your Netlify app
}));

app.use(express.json()); // For parsing application/json

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

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

bot.startBot();
