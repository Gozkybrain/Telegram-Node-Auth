# PharmaCheck: Telegram Node Authentication

## Project Overview

`PharmaCheck` is a two-part application consisting of a `Telegram Bot` and a `Backend Server` aimed at streamlining user authentication via Telegram. The bot interacts with users, collects their Telegram `username` and `user ID`, and passes these details to a frontend URL for authentication purposes. This project is particularly useful for services that require fast, convenient user authentication, leveraging Telegram as a platform.

## Key Goals:

* Provide an easy-to-use authentication method through Telegram.
* Extract user details (Telegram username and userId).
* Redirect users to a web-based frontend for further interactions using the extracted details as credentials.

## Features

* User Authentication via Telegram:
    * Extracts the username and userId of a user upon interaction with the bot.
    * Passes user data to a frontend application via a URL.
* Dual Action Buttons:
    * Open PharmaCheck Dashboard: Redirects users to the frontend URL for authentication.
    * Check Server Status: Provides a quick way to check server status via a URL.
* Error Handling and Auto-Restart:
In the event of errors (e.g., polling errors), the bot is designed to restart itself automatically after a brief delay.

## Technologies Used

- Node.js: Used to run the bot's backend.
- Telegram Bot API: Manages bot-user interactions.
- Firebase Firestore: Stores user data (username and userId).
- Express.js: Used to create a simple HTTP server to keep the bot alive on services like Render.
- dotenv: Manages environment variables for sensitive configurations like bot tokens and URLs.


