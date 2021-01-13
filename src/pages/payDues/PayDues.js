import React from 'react';
import { Button } from 'react-bootstrap';
import styles from './PayDues.module.scss';
import { sendEmail } from '../../functions/SendEmail';

export default function PayDues() {
  const sendTestEmail = () => {
    sendEmail();
  };

  return (
    <div className={styles.payDues}>
      <h3>Page Coming Soon...</h3>
      <br />
      <Button onClick={() => sendTestEmail()}>Test Now</Button>
    </div>
  );
}
