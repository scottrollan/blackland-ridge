import React, { useState, useContext, useEffect } from 'react';
import { MyAccount } from '../MyAccount';
import NavDropdownItems from './NavDropdownItems';
import { UserContext } from '../../App';
import { LoginContext } from '../../App';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { chatsCollection } from '../../firestore/index';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import * as db from '../../firestore';
import styles from './NavBar.module.scss';

const NavBar = () => {
  const [haveUnread, setHaveUnread] = useState(false);
  const [myChatArray, setMyChatArray] = useState([]);
  let history = useHistory();
  const thisUser = useContext(UserContext);
  const myID = thisUser.id;
  const setLoginPopup = useContext(LoginContext);
  const remove = require('lodash/remove');

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

  useEffect(() => {
    if (!myID) {
      return;
    }
    let chats = [];
    let unreadArray = [];
    //listen for changes
    chatsCollection
      .where('chatters', 'array-contains', myID)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          // unreadArray = [];
          let changeID = change.doc.id;
          let changeData = { ...change.doc.data(), id: changeID };
          let dataUnread = changeData.unread;
          unreadArray = [...unreadArray, ...dataUnread]; // add all unread to array
          chats = [...chats, changeData];
          if (change.type === 'modified') {
            //~if not initial fetch
            chats = remove(chats, (c) => {
              return c.id !== changeID; //remove pre-change element
            });
            chats = [...chats, changeData]; //replace with new element data
          }
        });
        if (unreadArray.includes(myID)) {
          setHaveUnread(true);
        } else {
          setHaveUnread(false);
        }
        setMyChatArray([...chats]);
      });
    const unsubscribe = chatsCollection.onSnapshot(() => {});

    return unsubscribe();
  }, [chatsCollection, myID]);

  return (
    <Navbar className={styles.navBar} collapseOnSelect expand="lg" id="mainNav">
      <Navbar.Brand className={styles.navbarBrand} id="brand">
        <MyAccount
          logInOut={logInOut}
          myChatArray={myChatArray}
          haveUnread={haveUnread}
        />
        <span
          id="haveUnread"
          style={{
            display: haveUnread ? 'inline-block' : 'none',
          }}
        >
          &nbsp;&nbsp;&nbsp;
          <i
            className={[`fas fa-envelope ${styles.wiggle}`]}
            style={{
              color: 'var(--color-pallette-accent)',
              fontSize: 'large',
            }}
          ></i>
        </span>
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
