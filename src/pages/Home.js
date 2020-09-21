import React from 'react';
import styles from './Home.module.scss';
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
            <span className={styles.clickable}>Discussion Board</span>
          </Link>

          <Link to="/calendar" className={styles.homeLink}>
            <span className={styles.clickable}>Calendar</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
