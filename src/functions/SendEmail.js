const nodemailer = require('nodemailer');

export const sendEmail = () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.REACT_APP_GMAIL_EMAIL,
      pass: process.env.REACT_APP_GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.REACT_APP_GMAIL_EMAIL,
    to: 'barry.rollan@gmail.com',
    subject: 'Sending Email using Node.js',
    html: '<h2>What up, big dick?</h2><p>You jerkin it today?',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
