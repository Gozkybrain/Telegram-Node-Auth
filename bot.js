const http = require('http');
const TelegramBot = require('node-telegram-bot-api');
const { storeUserData } = require('./controllers/userController');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT_BOT || 2021;
const token = process.env.TELEGRAM_BOT_TOKEN;
const botUrl = process.env.BOT_URL;

let bot;

const startBot = () => {
    try {
        bot = new TelegramBot(token, { polling: true });

        bot.onText(/\/start/, async (msg) => {
            const username = msg.from.username;
            const userId = msg.from.id;

            try {
                await storeUserData(username, userId);
                console.log('User data stored successfully');
            } catch (error) {
                console.error('Error storing user data:', error);
            }

            const webAppUrl = `${botUrl}/user/${username}/${userId}`;

            const options = {
                reply_markup: {
                    inline_keyboard: [[
                        {
                            text: 'Open Web App',
                            web_app: { url: webAppUrl }
                        }
                    ]]
                }
            };

            try {
                await bot.sendMessage(userId, `Welcome to JayGee, ${username} Click the button below to proceed`, options);
                console.log(`Sent message with link button to user ${username}`);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        bot.onText(/\/connect/, async (msg) => {
            const username = msg.from.username;
            const userId = msg.from.id;

            try {
                await storeUserData(username, userId);
                console.log('User data stored successfully');
            } catch (error) {
                console.error('Error storing user data:', error);
            }

            const serverUrl = `${botUrl}/user/${username}/${userId}`;

            const options = {
                reply_markup: {
                    inline_keyboard: [[
                        { text: 'Click here to proceed', url: serverUrl }
                    ]]
                }
            };

            try {
                await bot.sendMessage(userId, `Welcome to JayGee, ${username}. Click the button below to proceed`, options);
                console.log(`Sent message with link button to user ${username}`);
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
    console.log(`Server is listening on port ${PORT}`);
});

// Export startBot to be used in server.js
module.exports = {
    startBot,
};
