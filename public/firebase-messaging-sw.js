importScripts('http://www.gstatic.com/firebasejs/8.2.5/firebase-app.js');
importScripts('http://www.gstatic.com/firebasejs/8.2.5/firebase-messaging.js');

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

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler((payload) => {
  const title = 'New Message';
  const options = {
    body: payload.data.status,
  };
  return self.registration.showNotification(title, options);
});
