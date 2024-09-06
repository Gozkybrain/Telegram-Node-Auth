const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bot = require('./bot');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2020;

// Use cors middleware to handle CORS
app.use(cors({
    origin: 'https://pharmacheck.netlify.app' // Allow only your Netlify app
}));

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

bot.startBot();
