import React from 'react';
import { Spinner } from 'react-bootstrap';
import styles from './Loading.module.scss';

const Loading = ({ loading }) => {
  return (
    <div
      className={styles.alertDiv}
      style={{ display: loading ? 'flex' : 'none' }}
    >
      <div className={styles.fadeIn}>
        <Spinner animation="border" variant="secondary" />{' '}
      </div>
    </div>
  );
};

export default Loading;
