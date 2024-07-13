const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const crypto = require('crypto');
const cors = require('cors'); // Import CORS middleware
require('dotenv').config();  // Load environment variables

const app = express();

app.use(cors()); // Use CORS middleware

app.use(bodyParser.json());

// Initialize Firebase Admin
const serviceAccount = {
  // Your Firebase service account details
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Initialize Firestore
const db = admin.firestore();

// Telegram Authentication Route (POST)
app.post('/auth/telegram', async (req, res) => {
  const { id, first_name, auth_date, hash, username, photo_url } = req.body;

  // Verify the request came from Telegram (basic check)
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = crypto.createHash('sha256').update(token).digest();
  const dataCheckString = `auth_date=${auth_date}\nfirst_name=${first_name}\nid=${id}`;

  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
