const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

require('dotenv').config();

admin.initializeApp();

const gmailUser = process.env.REACT_APP_GMAIL_EMAIL;
const gmailPass = process.env.REACT_APP_GMAIL_PASSWORD;
const testEmail = process.env.TEST_EMAIL;
const adminEmail = process.env.ADMIN_EMAIL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

exports.sendEmail = functions.firestore
  .document('messages/{msgId}')
  .onCreate((snapshot, context) => {
    const mailOptions = {
      from: 'blackland.ridge.notifications@gmail.com',
      to: testEmail,
      subject: 'Sending Email using Node.js',
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

///// Message Response /////
exports.messageResponse = functions.firestore
  .document('messages/{msgId}')
  .onUpdate((snapshot, context) => {
    const author = snapshot.data().authorRef;
    const authorId = author.id;

    const mailOptions = {
      from: 'blackland.ridge.notifications@gmail.com',
      to: adminEmail,
      subject: 'Message Updated',
      html: `<h3>Below is the author id for the original message.</h3>
            <p>///////////</p>
            <p>${authorId}</p>
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
