import React from 'react';
import QuickButtons from '../../components/shared/QuickButtons';
import Footer from '../../components/shared/Footer';
import PaypalLogo from '../../assets/paypal.png';
import styles from './PayDues.module.scss';

export default function PayDues() {
  return (
    <>
      <QuickButtons />
      <div className={styles.payDues}>
        <h3>Pay Your $70 Annual Dues</h3>
        <div className={styles.body}>
          <div className={styles.paragraph}>
            <a
              href="https://www.paypal.me/BlacklandridgeGC"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <div className={styles.paypalDiv}>
                <p>Pay here with </p>
                <img
                  src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_150x38.png"
                  alt="PayPal"
                />
              </div>
            </a>
          </div>

          <div className={styles.paragraph}>
            Or you can write check, payable to{' '}
            <b>Blackland Ridge Garden Club</b>, and drop it off at the home of
            Kim Timson, 94 Lakeshore Circle. Just place your check in the
            mailbox.
          </div>
        </div>
        <br />
      </div>
      <Footer />
    </>
  );
}
