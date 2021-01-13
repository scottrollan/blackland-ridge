import React from 'react';
import { Button } from 'react-bootstrap';
import styles from './PayDues.module.scss';
import { sendEmail } from '../../functions/SendEmail';

export default function PayDues() {
  const user = process.env.REACT_APP_GMAIL_EMAIL;
  const pass = process.env.REACT_APP_GMAIL_PASSWORD;

  const sendTestEmail = () => {
    sendEmail(user, pass);
  };

  return (
    <div className={styles.payDues}>
      <h3>Page Coming Soon...</h3>
      <br />
      <Button onClick={() => sendTestEmail()}>Test Now</Button>

      <Button onClick={() => test()}>Test Node from React Component</Button>
    </div>
  );
}
