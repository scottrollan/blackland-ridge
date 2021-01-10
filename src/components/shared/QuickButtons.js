import React, { useContext } from 'react';
import { UserContext } from '../../App';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './QuickButtons.module.scss';

export default function QuickButtons() {
  const thisUser = useContext(UserContext);
  return (
    <div className={styles.quickButtons}>
      <div className={[`${styles.row} ${styles.bigButtons}`]}>
        <Link to="/pets" className={[`${styles.bigButton} ${styles.row}`]}>
          <i className={[`far fa-dog ${styles.icon} ${styles.dog}`]}></i>
          <span className={styles.bigButtonWords}>Pet Registry</span>
          <i
            className={[`far fa-cat ${styles.backwardCat} ${styles.icon}`]}
          ></i>
        </Link>
        <Link to="/referrals" className={[`${styles.bigButton} ${styles.row}`]}>
          <i
            className={[`fad fa-shopping-cart ${styles.icon} ${styles.dog}`]}
          ></i>
          <span className={styles.bigButtonWords}>Business Referrals</span>
          <i
            className={[
              `fad fa-hands-helping ${styles.backwardCat} ${styles.icon}`,
            ]}
          ></i>
        </Link>
      </div>
      <div
        className={styles.row}
        style={{ display: thisUser ? 'flex' : 'none' }}
      >
        <OverlayTrigger
          delay={{ show: 250, hide: 400 }}
          overlay={<Tooltip>Message Board</Tooltip>}
        >
          <Link to="/">
            <i className={[`fad fa-comments-alt ${styles.icon}`]}></i>
          </Link>
        </OverlayTrigger>
        <OverlayTrigger
          delay={{ show: 250, hide: 400 }}
          overlay={<Tooltip>Photo Albums</Tooltip>}
        >
          <Link to="/album">
            <i className={[`fad fa-images ${styles.icon}`]}></i>
          </Link>
        </OverlayTrigger>
        <OverlayTrigger
          delay={{ show: 250, hide: 400 }}
          overlay={<Tooltip>Neighbor Directory</Tooltip>}
        >
          <Link to="/directory">
            <i className={[`fal fa-address-book ${styles.icon}`]}></i>
          </Link>
        </OverlayTrigger>
      </div>
    </div>
  );
}
