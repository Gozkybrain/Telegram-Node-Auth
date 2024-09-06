// config/firebase.js
const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Specify the path to the service account key

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_KEY);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();
module.exports = { db, admin };
