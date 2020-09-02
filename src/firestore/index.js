import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import $ from 'jquery';

var firebaseConfig = {
  apiKey: 'AIzaSyB_gjxWhO4gEPanbkSX236imesTUi5W7Bo',
  authDomain: 'trans-falcon-287713.firebaseapp.com',
  databaseURL: 'https://trans-falcon-287713.firebaseio.com',
  projectId: 'trans-falcon-287713',
  storageBucket: 'trans-falcon-287713.appspot.com',
  messagingSenderId: '177194986194',
  appId: '1:177194986194:web:0384c1acbddd9b632f1b0b',
  measurementId: 'G-CNCF4VYN66',
};

const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export const signInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  await auth.signInWithPopup(provider);
  // window.location.reload();
};
export const signInWithFacebook = async () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  await auth.signInWithPopup(provider);
  // window.location.reload();
};
export const signInWithTwitter = async () => {
  const provider = new firebase.auth.TwitterAuthProvider();
  await auth.signInWithPopup(provider);
  // window.location.reload();
};
export const signInUserWithEmail = async (email, password) => {
  let promise;
  try {
    promise = await auth.signInWithEmailAndPassword(email, password);
  } catch (e) {
    if (e.code === 'auth/wrong-password') {
      $('#incorrectPassword').css('display', 'flex');
    } else if (e.code === 'auth/user-not-found') {
      $('#userNotFound').css('display', 'flex');
    } else if (e.code === '"auth/too-many-requests"') {
      $('#tooManyAttempts').css('display', 'flex');
    } else {
      $('#welcome').show();
      $('#logoutBtn').show();
    }
  }
  // return promise;
};
export const createUserWithEmail = async (email, password) => {
  const promise = await auth.createUserWithEmailAndPassword(email, password);
  // promise.catch((err) => console.log(err.message));
  return promise;
};
export const signInAnonymously = async () => {
  // const provider = new firebase.anonymousAuthProvider();
  await firebase.auth().signInAnonymously();
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      $('#logoutBtn').show();
    } else {
      $('#logoutBtn').hide();
    }
  });
  window.location.reload();
};

export const signOut = async () => {
  await auth.signOut();
  window.location.reload();
};

export const checkAuth = (cb) => {
  return auth.onAuthStateChanged(cb);
};

firebase.auth().onAuthStateChanged((firebaseUser) => {
  if (firebaseUser) {
  } else {
  }
});
