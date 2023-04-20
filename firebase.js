require('dotenv').config();

const admin = require('firebase-admin');
const firebase = require('firebase/app');
require('firebase/auth');

console.log(process.env.FIREBASE_PRIVATE_KEY);
console.log(process.env);

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

module.exports = { auth, admin, firebase };

