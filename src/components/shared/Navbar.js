import React, { useContext } from 'react';
import NavDropdownItems from './NavDropdownItems';
import { UserContext } from '../../App';
import { LoginContext } from '../../App';
import { Navbar, Nav, NavDropdown, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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
    $('.navbar-toggler').click();
  };
  return (
    <Navbar className={styles.navBar} collapseOnSelect expand="lg">
      <Navbar.Brand className={styles.navbarBrand}>
        <img
          src={
            thisUser && thisUser.photoURL
              ? thisUser.photoURL
              : 'https://robohash.org/user?bgset=bg1'
          }
          alt=""
          style={{ borderRadius: '50%', maxHeight: '3rem' }}
        />
        <Dropdown>
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-basic"
            className={styles.logBtn}
          >
            <span style={{ display: thisUser ? 'none' : 'block' }}>
              Login/Signup
            </span>
            <span style={{ display: thisUser ? 'block' : 'none' }}>
              My Account
            </span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item id="logBtn" onClick={() => logInOut()}>
              {thisUser ? 'Logout' : 'Login or Sign Up'}
            </Dropdown.Item>
            <Link
              to="/myProfile"
              className="dropdown-item"
              // onClick={() => collapseNavbar()}
              style={{ display: thisUser ? 'inherit' : 'none' }}
            >
              My Profile
            </Link>
          </Dropdown.Menu>
        </Dropdown>
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
