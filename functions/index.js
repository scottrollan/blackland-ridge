const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
require('dotenv').config();

admin.initializeApp();

const gmailUser = process.env.REACT_APP_GMAIL_EMAIL;
const gmailPass = process.env.REACT_APP_GMAIL_PASSWORD;
const adminEmail = process.env.ADMIN_EMAIL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

///// Alert Administrator when newThread is created
exports.sendEmail = functions.firestore
  .document('messages/{msgId}')
  .onCreate((snapshot, context) => {
    const mailOptions = {
      from: 'blackland.ridge.notifications@gmail.com',
      to: adminEmail,
      subject: 'Blackland Ridge Notification',
      html: `<h3>New message from ${snapshot.data().name}</h3>`,
    };

    return transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
        console.log(error);
        return false;
      }
      console.log('Email sent: ' + data.response);
    });
  });

///// Alert administrator when New Profile created /////
exports.alertAdministrator = functions.firestore
  .document('profiles/{profileId}')
  .onCreate((snapshot, context) => {
    const mailOptions = {
      from: 'blackland.ridge.notifications@gmail.com',
      to: adminEmail,
      subject: 'New Profile Added',
      html: `<h3>${snapshot.data().name} just set up a new profile</h3>
              <p>Check the profile out and see if it looks legit.</p>
      `,
    };

    return transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
        console.log(error);
        return false;
      }
      console.log('Email sent: ' + data.response);
    });
  });

///// add document to messageTriggers when message response is created
exports.responseTriggers = functions.https.onRequest((req, res) => {
  const authorEmail = req.query.E;
  const title = req.query.T;
  const responder = req.query.R;
  const snippet = req.query.M;
  return cors(req, res, async () => {
    const addMessageTrigger = await admin
      .firestore()
      .collection('responseTriggers')
      .add({
        authorEmail: authorEmail,
        title: title,
        responder: responder,
        snippet: snippet,
      });

    res.json({ result: `${addMessageTrigger.id}` });
  });
});

///// alert author when there is a Message Response /////
exports.messageResponse = functions.firestore
  .document('responseTriggers/{rTriggerId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();

    const authorEmail = data.authorEmail;
    const responder = data.responder;
    const snippet = data.snippet;
    const title = data.title;

    const mailOptions = {
      from: 'blackland.ridge.notifications@gmail.com',
      to: authorEmail,
      subject: 'A response to your message:',
      html: `<h3>People are talking...</h3>
            <p>In response to your post <span style="font-style: italic;">${title}</span></p>
            <p><span style="font-weight: bold;">${responder}</span> said,  "<span style="font-style: italic;">${snippet}</span>"</p>
            <a href="https://blackland-ridge.com/" rel="noreferrer noopener"><button style="background-color: #b9d452; border: none; color: white; padding: 15px 32px; border-radius: 8px; text-align: center; text-decoration: none; display: inline-block;font-size: 16px;">Go To BR Messages</button></a>
    `,
    };

    return transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
        console.log(error);
        return false;
      }
      console.log('Email sent: ' + data.response);
    });
  });
