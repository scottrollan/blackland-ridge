import React, { useContext } from 'react';
import { MyAccount } from '../MyAccount';
import NavDropdownItems from './NavDropdownItems';
import { UserContext } from '../../App';
import { LoginContext } from '../../App';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import * as db from '../../firestore';
import styles from './NavBar.module.scss';

const NavBar = () => {
  let history = useHistory();
  const thisUser = useContext(UserContext);
  const setLoginPopup = useContext(LoginContext);

  const logInOut = () => {
    if (thisUser) {
      db.signOut();
      setLoginPopup.hideLoginPopup();
      history.push('/');
    }
    if (!thisUser) {
      setLoginPopup.showLoginPopup();
    }
  };

  const collapseNavbar = () => {
    // $('.navbar-toggler').click();
    $('.navbar-toggler').click();
  };

  return (
    <Navbar className={styles.navBar} collapseOnSelect expand="lg" id="mainNav">
      <Navbar.Brand className={styles.navbarBrand} id="brand">
        <MyAccount logInOut={logInOut} />
      </Navbar.Brand>

      <Navbar.Toggle
        aria-controls="responsive-navbar-nav"
        style={{ backgroundColor: 'var(--white)' }}
      />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <span
            id="welcome"
            className={[`nav-link ${styles.navLink} ${styles.welcome}`]}
          >
            Welcome,{' '}
            {thisUser && thisUser.name ? `${thisUser.name}!` : 'Neighbor!'}
          </span>
        </Nav>
        <Nav>
          <NavDropdown
            title="The Neighborhood"
            id="collasible-nav-dropdown"
            className={[`${styles.navLink} ${styles.subDrop}`]}
          >
            <NavDropdownItems
              collapseNavbar={collapseNavbar}
              logInOut={logInOut}
            />
          </NavDropdown>
          <div className={styles.directDrop}>
            <NavDropdownItems
              collapseNavbar={collapseNavbar}
              logInOut={logInOut}
            />
          </div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
