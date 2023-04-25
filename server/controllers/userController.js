const db = require('../models/index');
const { admin, firebase, auth } = require('../../firebase');
const bcrypt = require('bcrypt');


const registerUser = async function (ctx) {
  try {
    const { firstName, lastName, email, password, firebaseUid } = ctx.request.body;
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const storeUser = await db.User.create({ firebase_uid: firebaseUid, firstName, lastName, email, password: hashedPassword})
    
    ctx.status = 201;
    ctx.body = { message: 'You have succesfully registered'};
  } catch (error) {
    console.error('Error in registerUser:' ,error);
    ctx.body = error;
    ctx.status = 500;
  }
}

const loginUser = async function (ctx) {
  try {
    const email = ctx.request.body.email || '';
    const password = ctx.request.body.password || '';
    const idToken = ctx.request.body.idToken || '';
    let userCredential;
    let getUser;
    if (email && password) {
      userCredential = await admin.auth().getUserByEmail(email);
      const getUser = await db.User.findOne({ where: { firebase_uid: userCredential.uid} });

      if (!getUser || !getUser.password || !bcrypt.compareSync(password, getUser.password)) {
        ctx.status = 401;
        ctx.body = { error: 'Invalid email or password' };
        return;
      } else {
        ctx.body = getUser;
      }
    } else if (idToken) {
      const credential = admin.auth.GoogleAuthProvider.credential(idToken);
      userCredential = await admin.auth().signInWithCredential(credential);
    } else {
      ctx.status = 400;
      ctx.body = { error: 'Invalid Request, did not send proper data'};
      return;
    }

    ctx.status = 200;
    ctx.body = 'You have succesfully logged in!';
  } catch (error) {
    console.error(error);
    ctx.body = error;
    ctx.status = 500;
  }
}

const logoutUser = async function (ctx) {
  try {
    const email = ctx.request.body.email || '';
    const password = ctx.request.body.password || '';
    const idToken = ctx.request.body.idToken || '';
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


const getAllUsers = async function (ctx) {
  try {
    const users = await db.User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email']
    })
    ctx.status = 200;
    ctx.body = { users };
  } catch (error) {
    console.error('Error in getAllUsers: ', error);
    ctx.body = error;
    ctx.status = 500;
  }
}


module.exports = { logoutUser, loginUser, registerUser, getAllUsers};