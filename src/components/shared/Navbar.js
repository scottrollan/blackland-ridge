import React, { useContext } from 'react';
import Zillow from '../../assets/zillow.png';
import { UserContext } from '../../App';
import { LoginContext } from '../../App';
import { Client } from '../../api/sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import { Navbar, Nav, NavDropdown, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import * as db from '../../firestore';
import styles from './NavBar.module.scss';

const NavBar = () => {
  let history = useHistory();
  const thisUser = useContext(UserContext);
  const setShowLogin = useContext(LoginContext);

  const builder = imageUrlBuilder(Client);

  const urlFor = (source) => {
    return builder.image(source);
  };
  const logInOut = () => {
    if (thisUser) {
      db.signOut();
      setShowLogin(false);
      history.push('/');
    }
    if (!thisUser) {
      setShowLogin(true);
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
            thisUser && thisUser.image
              ? urlFor(thisUser.image)
              : 'https://robohash.org/user?bgset=bg1'
          }
          alt=""
          style={{ borderRadius: '50%' }}
        />
        <Dropdown>
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-basic"
            className={styles.logBtn}
          >
            My Account
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              id="logBtn"
              // className={styles.logoutBtn}
              onClick={() => logInOut()}
            >
              {thisUser ? 'Logout' : 'Login or Sign Up'}
            </Dropdown.Item>
            <Link
              to="/myProfile"
              className="dropdown-item"
              onClick={() => collapseNavbar()}
              style={{ display: thisUser ? 'inherit' : 'none' }}
            >
              My Profile
            </Link>
            {/* <Dropdown.Item href="#/action-3"></Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
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
          {/* <Link
            to="/"
            className={[`nav-link ${styles.navLink}`]}
            onClick={() => collapseNavbar()}
          >
            Home
          </Link> */}

          <NavDropdown
            title="The Neighborhood"
            id="collasible-nav-dropdown"
            className={styles.navLink}
          >
            {/* <NavDropdown.Item> */}
            <Link
              to="/"
              className="dropdown-item"
              onClick={() => collapseNavbar()}
              style={{ display: thisUser ? 'inherit' : 'none' }}
            >
              Discussion
            </Link>
            <Link
              to="/calendar"
              className="dropdown-item"
              onClick={() => collapseNavbar()}
              style={{ display: thisUser ? 'inherit' : 'none' }}
            >
              Calendar
            </Link>
            <Link
              to="/directory"
              className="dropdown-item"
              onClick={() => collapseNavbar()}
              style={{ display: thisUser ? 'inherit' : 'none' }}
            >
              Directory
            </Link>
            <a
              href="https://www.zillow.com/homes/for_sale/?searchQueryState=%7B%22usersSearchTerm%22%3A%2230067%22%2C%22mapBounds%22%3A%7B%22west%22%3A-84.43712215325927%2C%22east%22%3A-84.42454795739745%2C%22south%22%3A33.94546877093187%2C%22north%22%3A33.95742995262041%7D%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22ah%22%3A%7B%22value%22%3Atrue%7D%7D%2C%22isListVisible%22%3Atrue%2C%22mapZoom%22%3A16%2C%22customRegionId%22%3A%2275aa25f873X1-CReejk073xunpa_wtbvq%22%7D"
              target="_blank"
              rel="noopener noreferrer"
              className="dropdown-item"
              onClick={() => collapseNavbar()}
            >
              Homes by{' '}
              <img src={Zillow} alt="Zillow" className={styles.zillow} />
            </a>
            <Link
              to="/payDues"
              className="dropdown-item"
              onClick={() => collapseNavbar()}
              style={{ display: thisUser ? 'inherit' : 'none' }}
            >
              Pay Your Dues
            </Link>
            {/* <NavDropdown.Divider /> */}
            <Link
              to="/referrals"
              className="dropdown-item"
              onClick={() => collapseNavbar()}
            >
              Referrals
            </Link>
            <div
              className="dropdown-item"
              style={{ display: thisUser ? 'none' : 'inherit' }}
              onClick={() => setShowLogin(true)}
            >
              Login For More
            </div>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
