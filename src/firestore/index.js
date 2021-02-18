import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/firebase-functions';
import 'firebase/firebase-messaging';
import $ from 'jquery';

const firebaseConfig = {
  apiKey: 'AIzaSyB_gjxWhO4gEPanbkSX236imesTUi5W7Bo',
  authDomain: 'trans-falcon-287713.firebaseapp.com',
  databaseURL: 'https://trans-falcon-287713.firebaseio.com',
  projectId: 'trans-falcon-287713',
  storageBucket: 'trans-falcon-287713.appspot.com',
  messagingSenderId: '177194986194',
  appId: '1:177194986194:web:0384c1acbddd9b632f1b0b',
  measurementId: 'G-CNCF4VYN66',
};
firebase.initializeApp(firebaseConfig);
export default firebase;

const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

/////////// Messaging ///////
// const messaging = firebase.messaging();
// messaging
//   .requestPermission()
//   .then(() => {
//     console.log('Have permission');
//     return messaging.getToken();
//   })
//   .then((token) => {
//     console.log(token);
//   })
//   .catch((error) => {
//     console.log(`Error occured: ${error.message}`);
//   });

// messaging.onMessage((payload) => {
//   console.log(`onMessage: ${payload}`);
//   //could also load to notification badge or whatever
// });

////////// Storage //////////
const storage = firebase.storage();
export const storageRef = storage.ref();
export const usersRef = storageRef.child('images/users');
export const albumsRef = storageRef.child('images/albums/');
export const attachmentsRef = storageRef.child('images/messageAttachments');
export const petsRef = albumsRef.child('/pets');
export const itemsForSaleRef = albumsRef.child('/itemsForSale');
export const wildlifeRef = albumsRef.child('/wildlife');
export const miscRef = albumsRef.child('/misc');

export const functions = firebase.functions();

////////// Database access //////////
export const profilesCollection = firebaseApp
  .firestore()
  .collection('profiles');

export const messagesCollection = firebaseApp
  .firestore()
  .collection('messages');

export const referralsCollection = firebaseApp
  .firestore()
  .collection('referrals');

export const responseTriggers = firebaseApp
  .firestore()
  .collection('responseTriggers');

export const urgentAlertsCollection = firebaseApp
  .firestore()
  .collection('urgentAlerts');

export const firebaseTimestamp = firebase.firestore.FieldValue.serverTimestamp();
export const timeStamp = firebase.firestore.Timestamp;
export const fsArrayUnion = firebase.firestore.FieldValue.arrayUnion;

////////// Authentication //////////

export const auth = firebaseApp.auth();
export const currentUser = auth.currentUser;

////////// login third party //////////
export const signInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  await auth.signInWithPopup(provider);
  window.location.reload();
};
export const signInWithFacebook = async () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  await auth.signInWithPopup(provider);
  window.location.reload();
};
export const signInWithTwitter = async () => {
  const provider = new firebase.auth.TwitterAuthProvider();
  await auth.signInWithPopup(provider);
  window.location.reload();
};
export const signInWithEmail = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    window.location.reload();
  } catch (e) {
    if (e.code === 'auth/wrong-password') {
      return 'incorrectPassword';
    } else if (e.code === 'auth/user-not-found') {
      return 'userNotFound';
    } else if (e.code === '"auth/too-many-requests"') {
      return 'tooManyAttempts';
    }
  }
};

export const createUserWithEmail = async (email, password) => {
  try {
    const data = await auth.createUserWithEmailAndPassword(email, password);
    return data;
    //data contains data.user
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    if (errorCode === 'auth/email-already-in-use') {
      return 'userAlreadyExists';
    } else {
      console.log(errorMessage);
    }
  }
};

export const sendResetPassword = async (emailAddress) => {
  try {
    auth.sendPasswordResetEmail(emailAddress).then(() => {
      // Email sent.
      $('#resetPassword').css('display', 'flex');
    });
  } catch (error) {
    alert(error.message);
  }
};

export const signOut = async () => {
  await auth.signOut();
  window.location.reload();
};

export const checkAuth = (cb) => {
  return auth.onAuthStateChanged(cb);
};

export const user = () => {
  return auth.currentUser;
};
