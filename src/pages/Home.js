import React from 'react';
import styles from './Home.module.scss';
import Messages from './Messages';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.heading}>
        <span className={styles.blackland}>Blackland Ridge</span>
        <div className={styles.headingButtonRow}>
          <Link to="/" className={styles.homeLink}>
            <span className={styles.clickable}>Classifieds</span>
          </Link>
          <Link to="/" className={styles.homeLink}>
            <span className={styles.clickable}>Business Referrals</span>
          </Link>

          <Link to="/" className={styles.homeLink}>
            <span className={styles.clickable}>Homes for Sale</span>
          </Link>
        </div>
      </div>
      <Messages />
    </div>
  );
}
