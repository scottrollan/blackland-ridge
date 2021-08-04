const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

require('dotenv').config();

admin.initializeApp(functions.config().firebase);
// admin.initializeApp();

const twilioSID = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
const twilioAUTH = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
const client = twilio(twilioSID, twilioAUTH);
const gmailUser = process.env.REACT_APP_GMAIL_EMAIL;
const gmailPass = process.env.REACT_APP_GMAIL_PASSWORD;
const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

let recipients = 'blackland.ridge.notifications@gmail.com';

///// Alert Administrator when newThread is created
exports.sendEmail = functions.firestore
  .document('messages/{msgId}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
    console.log(data);
    console.log(context.params);
    // let parsedMessage = '';
    // data.message.forEach((p) => {
    //   parsedMessage = `${parsedMessage}${p}<br>`;
    // });
    // admin
    //   .firestore()
    //   .doc('profiles/{profileID}')
    //   .where('receiveNotifications', '==', true)
    //   .get()
    //   .then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       const email = doc.data().email;
    //       recipients.concat(',', email);
    //       const mailOptions = {
    //         from: 'blackland.ridge.notifications@gmail.com',
    //         to: adminEmail,
    //         subject: 'Blackland Ridge Notification',
    //         html: `
    //           <h3>New Message from ${snapshot.data().name}</h3>
    //           <p>${parsedMessage}</p>
    //           `,
    //         // };
    //       };
    //       return transporter.sendMail(mailOptions, (error, data) => {
    //         if (error) {
    //           console.log(error);
    //           return false;
    //         }
    //         console.log('Email sent: ' + data.response);
    //       });
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  });

///// Alert administrator when New Profile created /////
exports.alertAdministrator = functions.firestore
  .document('profiles/{profileId}')
  .onCreate((snapshot, context) => {
    console.log(snapshot);
    console.log(context.params);
    // const mailOptions = {
    //   from: 'blackland.ridge.notifications@gmail.com',
    //   to: adminEmail,
    //   subject: 'New Profile Added',
    //   html: `<h3>${snapshot.data().name} just set up a new profile</h3>
    //           <p>Check the profile out and see if it looks legit.</p>
    //   `,
    // };

    // return transporter.sendMail(mailOptions, (error, data) => {
    //   if (error) {
    //     console.log(error);
    //     return false;
    //   }
    //   console.log('Email sent: ' + data.response);
    // });
  });

///// alert author when there is a new document in responseTriggers /////
exports.messageResponse = functions.firestore
  .document('responseTriggers/{rTriggerId}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
    const authorEmail = data.authorEmail;
    const responder = data.responder;
    const message = data.message;
    const title = data.title;

    const mailOptions = {
      from: 'blackland.ridge.notifications@gmail.com',
      to: 'blackland.ridge.notifications@gmail.com',
      bcc: authorEmail,
      subject: 'A response to your message:',
      html: `<h2>People are talking...</h2>
            <p>In response to your post <span style="font-style: italic; font-weight: bold;">${title}</span></p>
            <p><span style="font-weight: bold;">${responder} said:</span></p>${message}
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

///// alert recipient(s) when there is a new Chat/Private Message /////
exports.newChat = functions.firestore
  .document('chats/{chatId}')
  .onCreate(async (snapshot, context) => {
    console.log(snapshot);
    console.log(context.params);
    const data = snap.data();
    const messagesArray = data.messages;
    let parsedMessage = '';
    const paragraphs = messagesArray[0].paragraphs;
    paragraphs.forEach((p) => {
      parsedMessage = `${parsedMessage}${p}<br>`;
    });
    const author = messagesArray[0].name;
    const chatters = data.chatters;
    const chattersNum = chatters.length;
    const moreThanMe = chattersNum - 2;
    let youAnd = '...to you';
    if (moreThanMe > 0) {
      if (moreThanMe > 1) {
        youAnd = `...to you and ${moreThanMe} others`;
      } else {
        youAnd = '...to you and 1 other person';
      }
    }

    const recipientEmails = data.unreadEmails;
    const toEmails = recipientEmails.join(', ');

    const mailOptions = {
      from: 'blackland.ridge.notifications@gmail.com',
      to: 'blackland.ridge.notifications@gmail.com',
      bcc: toEmails,
      subject: 'You have a new private message.',
      html: ` <h2>from ${author}</h2>
              <p>${youAnd}</p>
              <p><span style="font-weight: bold;">${author}</span> said,  "<span style="font-style: italic;">${parsedMessage}</span>"</p>
              <a href="https://blackland-ridge.com/" rel="noreferrer noopener"><button style="background-color: #b9d452; border: none; color: white; padding: 15px 32px; border-radius: 8px; text-align: center; text-decoration: none; display: inline-block;font-size: 16px;">Login to Respond to Your Message</button></a>
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

///// URGENT alerts /////
exports.urgentAlerts = functions.firestore
  .document('urgentAlerts/{urgentId}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
    const emails = data.emails;
    const phones = data.phones;
    const poster = data.poster;
    const urgentMessage = data.urgentMessage;
    const title = data.title;

    const mailOptions = {
      from: 'blackland.ridge.notifications@gmail.com',
      to: 'blackland.ridge.notifications@gmail.com',
      // bcc: emails, //add emails here
      bcc: 'barry.rollan@gmail.com',
      subject: 'URGENT Alert - Blackland Ridge',
      html: `<h2>${title}</h2>
            <p style="font-weight: bold;">${title}</p>
            <p>${poster} said:</p>  
            ${urgentMessage}
            <a href="https://blackland-ridge.com/" rel="noreferrer noopener"><button style="background-color: #b9d452; border: none; color: white; padding: 15px 32px; border-radius: 8px; text-align: center; text-decoration: none; display: inline-block;font-size: 16px;">Go To BR Messages</button></a>
            <p>${phones}</p>
            <p>${emails}</p>
    `,
    };
    const smsBody = `Urgent Alert from Blackland Ridge: ${title} -- ${urgentMessage} - from ${poster}`;

    try {
      const message = await client.messages.create({
        body: smsBody,
        from: '+17702851340',
        to: '+14048405408',
      });
      console.log(message.sid);
    } catch (error) {
      console.log(error);
    }

    return transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
        console.log(error);
        return false;
      }
      console.log('Email sent: ' + data.response);
    });
  });
