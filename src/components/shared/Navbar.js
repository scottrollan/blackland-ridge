import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import * as db from '../../firestore';
import styles from './NavBar.module.scss';

const NavBar = ({ userName, user }) => {
  let isLoggedIn;
  if (user) {
    isLoggedIn = true;
  }

  const isAnonymous = user.isAnonymous;

  // let displayName = null;
  // if (userName) {
  //   displayName = userName;
  // }

  const logout = () => {
    db.signOut();
  };

  if (isAnonymous) {
    $('#logoutBtn').text('Login to Post');
  } else {
    $('#logoutBtn').text('Logout');
  }

  console.log(
    'isAnon: ',
    isAnonymous,
    'loggedin: ',
    isLoggedIn,
    'name: ',
    userName
  );
  // React.useEffect(() => {
  //   logWhat();
  // }, []);

  return (
    <Navbar className={styles.navBar} collapseOnSelect expand="lg" fixed="top">
      <Navbar.Brand>
        <span
          id="welcome"
          className={styles.welcome}
          style={{ display: isLoggedIn || isAnonymous ? 'inherit' : 'none' }}
        >
          Welcome{isAnonymous ? '!' : `, ${userName}!`}
          <Button
            id="logoutBtn"
            className={styles.logoutBtn}
            onClick={() => logout()}
          >
            Logout
          </Button>
        </span>
        <Button
          id="loginBtn"
          className={styles.loginBtn}
          onClick={() => $('#authentication').css('display', 'flex')}
          style={{ display: isLoggedIn || isAnonymous ? 'none' : 'inherit' }}
        >
          Login
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
