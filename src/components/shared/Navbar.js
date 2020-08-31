import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import * as db from '../../firestore';
import styles from './NavBar.module.scss';

const NavBar = ({ userName }) => {
  const logout = () => {
    db.signOut();
  };

  const checkLogin = (userName) => {
    if (userName) {
      $('#loginBtn').show();
      $('#logoutBtn').hide();
    } else {
      $('#logoutBtn').show();
      $('#loginBtn').hide();
    }
  };

  React.useEffect(() => {
    checkLogin();
  }, []);
  return (
    <Navbar className={styles.navBar} collapseOnSelect expand="lg" fixed="top">
      <Navbar.Brand>
        <span id="welcome" className={styles.welcome}>
          Welcome{userName ? `, ${userName}.` : '!'}
          <Button
            id="loginBtn"
            className={styles.loginBtn}
            onClick={() => $('#authentication').css('display', 'flex')}
          >
            Login
          </Button>
        </span>
        <Button
          id="logoutBtn"
          className={styles.logoutBtn}
          onClick={() => logout()}
        >
          Logout
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
