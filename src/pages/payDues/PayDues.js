import React from 'react';
import QuickButtons from '../../components/shared/QuickButtons';
import Footer from '../../components/shared/Footer';
import styles from './PayDues.module.scss';

export default function PayDues() {
  return (
    <>
      <QuickButtons />
      <div className={styles.payDues}>
        <h3>Page Coming Soon... maybe.</h3>
        <br />
      </div>
      <Footer />
    </>
  );
}
