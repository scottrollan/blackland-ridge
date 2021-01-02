import React, { useContext } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';
import styles from './QuickButtons.module.scss';

export default function QuickButtons() {
  const thisUser = useContext(UserContext);
  return (
    <div className={styles.row} style={{ display: thisUser ? 'flex' : 'none' }}>
      <Link to="/">
        <i className={[`fad fa-comments-alt ${styles.icon}`]}></i>
      </Link>
      <Link to="/album">
        <i className={[`fad fa-images ${styles.icon}`]}></i>
      </Link>
      <Link to="/directory">
        <i className={[`fal fa-address-book ${styles.icon}`]}></i>
      </Link>
    </div>
  );
}
