const db = require('../models/index');
const { admin, firebase, auth } = require('../../firebase');


const registerUser = async function (ctx) {
  try {
    const { firstName, lastName, email, password } = ctx.request.body;
    const createUser = await admin.auth().createUser({ email, password });
    const storeUser = await db.User.create({ firebase_uid: createUser.uid, firstName, lastName, email})
    
    ctx.status = 201;
    ctx.body = { user: storeUser };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
  }
}

const loginUser = async function (ctx) {
  try {
    const { email, password, idToken } = ctx.request.body;
    let userCredential;
    if (email && password) {
      userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);

    } else if (idToken) {
      const credential = admin.auth.GoogleAuthProvider.credential(idToken);
      userCredential = await firebase.auth().signInWithCredential(credential);
    } else {
      ctx.status = 400;
      ctx.body = { error: 'Invalid Request'};
      return;
    }

    const validatedUser = userCredential.user;

    if (!validatedUser) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid email or password'};
      return;
    }

    const getUser = await db.User.findOne({ where: { firebase_uid: validatedUser.uid} });
    ctx.status = 200;
    ctx.body = { user: getUser};
  } catch (error) {
    console.error(error);
    ctx.status = 500;
  }
}

const logoutUser = async function (ctx) {
  try {
    const { idToken, email, password } = ctx.request.body;
    let providerId;
    if (idToken) {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      providerId = decodedToken.firebase.identities['google.com'][0];
    }
    await auth.revokeRefreshTokens(providerId);
    ctx.status = 200;
    ctx.body = { message: 'User logged out successfully'};
    if (!idToken) {
      await firebase.auth().signOut();
      ctx.status = 200;
      ctx.body = { message: 'User logged out succesfully'};
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
  }
}


module.exports = { logoutUser, loginUser, registerUser};