import React from 'react';
import styles from './Home.module.scss';

export default function Home() {
  return (
    <div className={styles.home}>
      <span className={styles.blackland}>Blackland Ridge</span>
      <div className={styles.dropHome}>HOME</div>
    </div>
  );
}
