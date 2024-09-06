const { db, admin } = require('../config/firebase');

const storeUserData = async (username, userId) => {
    try {
        const userRef = db.collection('users').doc( userId.toString());
        await userRef.set({
            username,
            userId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`User data for userId ${userId} stored successfully.`);
    } catch (error) {
        console.error('Error storing user data:', error);
    }
};
const getUserData = async (userId) => {
    try {
        const userRef = db.collection('users').doc(userId.toString());
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

module.exports = { storeUserData, getUserData };
