const startBot = require('./bot');
const startServer = require('./server');

// Start the bot
console.log("Starting the bot...");
startBot();
console.log("Bot is running");

// Start the server
console.log("Starting the server...");
startServer();
console.log("Server is running");
