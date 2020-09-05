import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import * as db from '../../firestore';
import styles from './NavBar.module.scss';

const NavBar = ({ user, isLoggedIn }) => {
  let displayName = null;
  if (user) {
    displayName = user.displayName;
  }

  const logout = () => {
    db.signOut();
  };
  if (!displayName) {
    $('#logoutBtn').text('Login to Post');
  } else {
    $('#logoutBtn').text('Logout');
  }

  // React.useEffect(() => {
  //   logWhat();
  // }, []);

  return (
    <Navbar className={styles.navBar} collapseOnSelect expand="lg" fixed="top">
      <Navbar.Brand>
        <span
          id="welcome"
          className={styles.welcome}
          // style={{ display: isLoggedIn ? 'inherit' : 'none' }}
        >
          Welcome{displayName ? `, ${displayName}.` : '!'}
          <Button
            id="logoutBtn"
            className={styles.logoutBtn}
            onClick={() => logout()}
            // style={{ display: user ? 'flex' : 'none' }}
          >
            Logout
          </Button>
        </span>
        <Button
          id="loginBtn"
          className={styles.loginBtn}
          onClick={() => $('#authentication').css('display', 'flex')}
          style={{ display: isLoggedIn ? 'none' : 'inherit' }}
        >
          Login, yo.
        </Button>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto"></Nav>
        <Nav>
          <Link to="/" className={[`nav-link ${styles.navLink}`]}>
            Home
          </Link>

          <Link to="/notHome" className={[`nav-link ${styles.navLink}`]}>
            Not Home
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
