import React from 'react';
import styles from './Home.module.scss';

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.heading}>
        <span className={styles.blackland}>Blackland Ridge</span>
        <div className={styles.headingButtonRow}>
          <span>Classifieds</span>
          <span>Messages</span>
          <span>Calendar</span>
        </div>
      </div>
    </div>
  );
}
