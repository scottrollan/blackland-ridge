const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.someroute = functions.https.onRequest(async (req, res) => {
  const name = req.query.name;
  const phone = req.query.phone;

  const addContact = await admin.firestore().collection('contacts').add({
    name: name,
    phone: phone,
  });

  res.json({ result: `${addContact.id}` });
});

///TRIGGERS
exports.addDate = functions.firestore
  .document('contacts/{contactId}')
  .onCreate((snapshot, context) => {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    return admin
      .firestore()
      .doc(`contacts/${context.params.contactId}`)
      .update({
        dateAdded: timestamp,
      });
  });

///CALLABLES
exports.addLog = functions.https.onCall((data, context) => {
  return 'log added';
});
