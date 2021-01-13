const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const gmailUser = process.env.REACT_APP_GMAIL_EMAIL;
const gmailPass = process.env.REACT_APP_GMAIL_PASSWORD;

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
      to: 'steve@gmail.com',
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
