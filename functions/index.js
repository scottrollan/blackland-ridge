const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
require('dotenv').config();

admin.initializeApp(functions.config().firebase);

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
///// Send URGENT message to all
exports.sendEmail = functions.firestore
  .document('messages/{msgId}')
  .onCreate((snapshot, context) => {
    const data = snapshot.data();
    let parsedMessage = '';
    data.message.forEach((p) => {
      parsedMessage = `${parsedMessage}${p}<br>`;
    });
    let mailOptions = {};
    if (data.category === 'Urgent') {
      mailOptions = {
        from: 'blackland.ridge.notifications@gmail.com',
        to: 'blackland.ridge.notifications@gmail.com',
        bcc: 'barry.rollan@gmail.com',
        subject: 'URGENT ALERT',
        html: `
        <h1>Urgent Alert from ${data.name}</h1>
        <p>${parsedMessage}</p>
        `,
      };
    } else {
      mailOptions = {
        from: 'blackland.ridge.notifications@gmail.com',
        to: adminEmail,
        subject: 'Blackland Ridge Notification',
        html: `
        <h3>New Message from ${snapshot.data().name}</h3>
        <p>${parsedMessage}</p>
        `,
      };
    }
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

/////
exports.responseTrigger = functions.https.onCall((data, context) => {
  return `you hit the responseTrigger onCall function`;
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
