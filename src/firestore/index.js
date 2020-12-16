import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
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

////////// Storage //////////
const storage = firebase.storage();
export const storageRef = storage.ref();
export const usersRef = storageRef.child('images/users');
export const albumsRef = storageRef.child('images/albums/');
export const attachmentsRef = storageRef.child('images/messageAttachments');

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

export const firebaseTimestamp = firebase.firestore.FieldValue.serverTimestamp();
export const timeStamp = firebase.firestore.Timestamp;
export const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
export const fsArrayUnion = firebase.firestore.FieldValue.arrayUnion;

////////// Authentication //////////

export const auth = firebaseApp.auth();

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
  } catch (e) {
    if (e.code === 'auth/wrong-password') {
      return 'incorrectPassword';
    } else if (e.code === 'auth/user-not-found') {
      return 'userNotFound';
    } else if (e.code === '"auth/too-many-requests"') {
      return 'tooManyAttempts';
    }
  }
  window.location.reload();
};

export const createUserWithEmail = async (email, password) => {
  try {
    const data = await auth.createUserWithEmailAndPassword(email, password);
    return data;
    //data contains data.additionalUserInfo.isNewUser (t/f) and data.user
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
