import React from 'react';
import { Spinner } from 'react-bootstrap';
import styles from './Loading.module.scss';

const Loading = () => {
  return (
    <div id="loading" className={styles.alertDiv}>
      <div className={styles.fadeIn}>
        <Spinner animation="border" variant="light" />{' '}
      </div>
    </div>
  );
};

export default Loading;
