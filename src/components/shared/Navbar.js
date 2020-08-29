import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as db from '../../firestore';
import styles from './NavBar.module.scss';

const NavBar = ({ userName }) => {
  return (
    <Navbar
      className={styles.navBar}
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      fixed="top"
    >
      <Navbar.Brand style={{ display: userName ? 'inherit' : 'none' }}>
        Welcome, {userName}
        <Button
          onClick={() => db.signOut()}
          style={
            ({ display: userName ? 'inherit' : 'none' }, { marginLeft: '1rem' })
          }
        >
          Logout{'   '}
          <i className="fas fa-arrow-right"></i>
        </Button>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto"></Nav>
        <Nav>
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/notHome" className="nav-link">
            Not Home
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
