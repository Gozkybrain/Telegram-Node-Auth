# Telegram Authentication Node.js App

This Node.js application serves as a backend service for authenticating users via Telegram and generating Firebase custom tokens for authentication in other applications.

## Features

- Telegram Authentication: Verifies incoming requests from Telegram using HMAC based on the provided data and bot token.
- Firebase Integration: Generates Firebase custom tokens for authenticated Telegram users.
- Express Server: Provides a REST API endpoint (/auth/telegram) to handle incoming authentication requests.

## Prerequisites

Before running this application, ensure you have:

- Node.js installed on your machine 
- Firebase Admin SDK configured with your Firebase project credentials.
- Telegram Bot API token for authenticating requests from Telegram.

## Usage

### Authenticating via Telegram
Send a POST request to http://localhost:3000/auth/telegram with the following JSON payload:

```
{
  "id": "123456789",
  "first_name": "John",
  "auth_date": "1623670300",
  "hash": "<computed-hmac>"
}
```

Replace `<computed-hmac>` with the `HMAC` generated using your bot token and the provided data (id, first_name, auth_date).


