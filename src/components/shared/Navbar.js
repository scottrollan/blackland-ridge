import React, { useContext, useEffect } from 'react';
import { UserContext } from '../../App';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import * as db from '../../firestore';
import styles from './NavBar.module.scss';

const NavBar = ({ loginShow }) => {
  const thisUser = useContext(UserContext);

  const logInOut = () => {
    if (thisUser) {
      db.signOut();
      loginShow(false);
    }
    if (!thisUser) {
      loginShow(true);
    }
  };

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
          >
            Welcome, {thisUser.name ? `${thisUser.name}!` : 'Neighbor!'}
            <Button
              id="logBtn"
              className={styles.logoutBtn}
              onClick={() => logInOut()}
            >
              {thisUser ? 'Logout' : 'Login or Sign Up'}
            </Button>
          </span>
        </Nav>
        <Nav>
          <Link
            to="/"
            className={[`nav-link ${styles.navLink}`]}
            onClick={() => collapseNavbar()}
          >
            Home
          </Link>

          <NavDropdown
            title="The Neighborhood"
            id="collasible-nav-dropdown"
            className={styles.navLink}
          >
            {/* <NavDropdown.Item> */}
            <Link
              to="/calendar"
              className="dropdown-item"
              onClick={() => collapseNavbar()}
            >
              Calendar
            </Link>
            <Link
              to="/directory"
              className="dropdown-item"
              onClick={() => collapseNavbar()}
            >
              Directory
            </Link>
            {/* </NavDropdown.Item> */}
            <Link
              to="/"
              className="dropdown-item"
              onClick={() => collapseNavbar()}
            >
              Homes For Sale
            </Link>
            <Link
              to="/"
              className="dropdown-item"
              onClick={() => collapseNavbar()}
            >
              Pay Your Dues
            </Link>
            {/* <NavDropdown.Divider /> */}
            <Link
              to="/"
              className="dropdown-item"
              onClick={() => collapseNavbar()}
            >
              Referrals
            </Link>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
