// testFirebase.js
const { db } = require('./config/firebase'); // Adjust the path if needed

(async () => {
    try {
        const docRef = db.collection('test').doc('sample');
        await docRef.set({ message: 'Firestore is working!' });
        console.log('Firestore is working!');
    } catch (error) {
        console.error('Error testing Firestore:', error);
    }
})();
