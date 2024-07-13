const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const crypto = require('crypto');
require('dotenv').config();  // Load environment variables

const app = express();
app.use(bodyParser.json());

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log('Received request:', req.method, req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Initialize Firebase Admin
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL  // Add databaseURL to initialize Firestore
});

// Initialize Firestore
const db = admin.firestore();

// Telegram Authentication Route
app.post('/auth/telegram', async (req, res) => {
  const { id, first_name, auth_date, hash, username, photo_url } = req.body;

  // Verify the request came from Telegram (basic check)
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = crypto.createHash('sha256').update(token).digest();
  const dataCheckString = `auth_date=${auth_date}\nfirst_name=${first_name}\nid=${id}`;

  // Log values for debugging
  console.log('Secret:', secret.toString('hex'));
  console.log('Data Check String:', dataCheckString);
  console.log('Received Hash:', hash);

  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

  // Log the computed hash
  console.log('Computed HMAC:', hmac);

  if (hmac !== hash) {
    return res.status(400).send('Verification failed');
  }

  try {
    // Save user details to Firestore
    await db.collection('users').doc(id.toString()).set({
      id,
      first_name,
      username,
      photo_url,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    // Generate Firebase Custom Token
    const firebaseToken = await admin.auth().createCustomToken(id.toString());
    res.send({ firebaseToken });
  } catch (error) {
    console.error('Error processing authentication:', error);
    res.status(500).send('Internal server error');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;  // Use environment variable for port or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
