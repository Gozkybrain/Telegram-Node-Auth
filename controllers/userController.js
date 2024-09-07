const { db, admin } = require('../config/firebase');

// Function to store user data with an initial balance
const storeUserData = async (username, userId) => {
    try {
        const initialBalance = [
            {
                amount: 20,
                type: 'credit',
                referenceId: 'initial_deposit', // Unique identifier for this initial deposit
                date: admin.firestore.Timestamp.fromDate(new Date()) // Current date
            }
        ];

        const userRef = db.collection('telegram').doc(userId.toString());
        await userRef.set({
            username,
            userId,
            balance: initialBalance, // Initialize balance with the default entry
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`User data for userId ${userId} stored successfully with initial balance.`);
    } catch (error) {
        console.error('Error storing user data:', error);
    }
};

// Function to get user data
const getUserData = async (userId) => {
    try {
        const userRef = db.collection('telegram').doc(userId.toString());
        const doc = await userRef.get();
        if (doc.exists) {
            return doc.data(); // Return the user data
        } else {
            return null; // User not found
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Failed to fetch user data');
    }
};

// Export functions
module.exports = { storeUserData, getUserData };
