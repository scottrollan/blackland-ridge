import React, { useState, useContext } from 'react';
import ContactInfoPopup from './ContactInfoPopup';
import QuickButtons from '../../components/shared/QuickButtons';
import Footer from '../../components/shared/Footer';
import styles from './PayDues.module.scss';

export default function PayDues() {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <>
      <ContactInfoPopup
        contactModalOpen={contactModalOpen}
        setContactModalOpen={setContactModalOpen}
      />
      <QuickButtons />
      <div className={styles.payDues}>
        <h3>Pay Your $70 Annual Dues</h3>
        <div className={styles.body}>
          <div className={styles.paragraph}>
            <div
              className={styles.paypalDiv}
              onClick={() => setContactModalOpen(true)}
            >
              <p>Pay here with </p>
              <img
                src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_150x38.png"
                alt="PayPal"
              />
            </div>
          </div>

          <div className={styles.paragraph}>
            Or you can write a check, payable to{' '}
            <b>Blackland Ridge Garden Club</b>, and drop it off at the home of
            Kim Timson,{' '}
            <a
              href="https://www.google.com/maps/place/94+Lakeshore+Cir+NE,+Marietta,+GA+30067/@33.9522419,-84.4321876,18z/"
              target="_blank"
              rel="noreferrer noopener"
            >
              94 Lakeshore Circle
            </a>
            . Just place your check in the mailbox.
          </div>
        </div>
        <br />
      </div>
      <Footer />
    </>
  );
}
