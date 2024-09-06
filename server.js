const express = require('express');
const dotenv = require('dotenv');
const bot = require('./bot'); // Import your bot logic

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

bot.startBot(); // Start the bot
