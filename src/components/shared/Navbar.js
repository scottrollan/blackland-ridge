import React, { useContext } from 'react';
import { UserContext } from '../../App';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import * as db from '../../firestore';
import styles from './NavBar.module.scss';

const NavBar = () => {
  const thisUser = useContext(UserContext);
  let isLoggedIn;
  if (thisUser) {
    isLoggedIn = true;
  }

  const isAnonymous = thisUser.isAnonymous;

  const logout = () => {
    db.signOut();
  };

  if (isAnonymous) {
    $('#logoutBtn').text('Login to Post');
  } else {
    $('#logoutBtn').text('Logout');
  }

  const collapseNavbar = () => {
    $('.navbar-toggler').click();
  };

  return (
    <Navbar className={styles.navBar} collapseOnSelect expand="lg">
      <Navbar.Brand></Navbar.Brand>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <span
            id="welcome"
            className={[`nav-link ${styles.navLink} ${styles.welcome}`]}
            style={{ display: isLoggedIn || isAnonymous ? 'inherit' : 'none' }}
          >
            Welcome, {isAnonymous ? 'Neighbor!' : `${thisUser.name}!`}
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
        </Nav>
        <Nav>
          <Link
            to="/"
            className={[`nav-link ${styles.navLink}`]}
            onClick={() => collapseNavbar()}
          >
            Home
          </Link>

          <Link
            to="/calendar"
            className={[`nav-link ${styles.navLink}`]}
            onClick={() => collapseNavbar()}
          >
            Calendar
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
