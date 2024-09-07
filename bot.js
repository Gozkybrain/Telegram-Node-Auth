const http = require('http');
const TelegramBot = require('node-telegram-bot-api');
const { storeUserData } = require('./controllers/userController');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT_BOT || 2021;
const token = process.env.TELEGRAM_BOT_TOKEN;
const botUrl = process.env.BOT_URL;
const serverUrl = process.env.SERVER;

let bot;

const startBot = () => {
    try {
        // Initialize the bot if it's not already initialized
        if (!bot) {
            bot = new TelegramBot(token, { polling: true });
        }

        // Remove all listeners to prevent duplications if the bot restarts
        bot.removeTextListener(/\/start/);
        bot.removeTextListener(/\/connect/);

        // Listener for /start command
        bot.onText(/\/start/, async (msg) => {
            const { username, id: userId } = msg.from;
            
            console.log(`Received /start command from ${username} (${userId})`);

            try {
                await storeUserData(username, userId);
                console.log('User data stored successfully');
            } catch (error) {
                console.error('Error storing user data:', error);
            }

            const webAppUrl = `${botUrl}/user/${username}/${userId}`;
            const serverCheckUrl = `${serverUrl}`; // Add a server check URL

            const options = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Open Dashboard', web_app: { url: webAppUrl } }],
                        [{ text: 'Server Status', url: serverCheckUrl }] // Second button
                    ]
                }
            };

            try {
                await bot.sendMessage(userId, `Hello ${username}, you were successfully authenticated and are ready to go. Proceed to your dashboard to continue; if you experience delay, please check the server status for update.`, options);
                console.log(`Sent message with two options to user ${username}`);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        // Listener for /connect command
        bot.onText(/\/connect/, async (msg) => {
            const { username, id: userId } = msg.from;
            
            console.log(`Received /connect command from ${username} (${userId})`);

            try {
                await storeUserData(username, userId);
                console.log('User data stored successfully');
            } catch (error) {
                console.error('Error storing user data:', error);
            }

            const webAppUrl = `${botUrl}/user/${username}/${userId}`;
            const serverCheckUrl = `${serverUrl}`; // Add a server check URL

            const options = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Open Dashboard', web_app: { url: webAppUrl } }],
                        [{ text: 'Server Status', url: serverCheckUrl }] // Second button
                    ]
                }
            };

            try {
                await bot.sendMessage(userId, `Hello ${username}, you were successfully authenticated and are ready to go. Click the buttons below to proceed`, options);
                console.log(`Sent message with two options to user ${username}`);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        bot.on('polling_error', (error) => {
            console.error('Polling error:', error);
            console.log('Bot encountered an error and will restart...');
            setTimeout(startBot, 10000); // Restart the bot after 10 seconds
        });

        console.log('Bot started');
    } catch (error) {
        console.error('Bot failed to start:', error);
        console.log('Retrying bot startup in 10 seconds...');
        setTimeout(startBot, 10000); // Retry after 10 seconds if an error occurs during startup
    }
};

// Simple HTTP server to keep Render happy
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running\n');
});

server.listen(PORT, () => {
    console.log(`Bot is listening on port ${PORT}`);
});

// Start the bot
startBot();

module.exports = {
    startBot,
};
