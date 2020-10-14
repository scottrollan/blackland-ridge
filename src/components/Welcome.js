import React from 'react';
import $ from 'jquery';
import styles from './Welcome.module.scss';

export default function Welcome() {
  return (
    <div
      className={styles.alertDiv}
      id="welcome"
      onClick={() => $('#welcome').hide()}
    >
      <div className={styles.fadeIn}>
        <h4>Welcome Home To</h4>
        <h3>Blackland Ridge</h3>
      </div>
    </div>
  );
}
