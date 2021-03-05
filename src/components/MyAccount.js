import React, { useState } from 'react';
import Chat from '../pages/chat/Chat';
import OpenMessage from '../pages/chat/OpenMessage';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import styles from './MyAccount.module.scss';

export const MyAccount = ({ thisUser, logInOut }) => {
  const myID = thisUser.id;
  const myChats = thisUser.chats;
  const [chatShow, setChatShow] = useState(false);
  const [messageShow, setMessageShow] = useState(false);
  const [openMessage, setOpenMessage] = useState({});
  const handleChatShow = () => {
    setChatShow(true);
  };
  const handleChatClose = () => {
    setChatShow(false);
  };
  const handleMessageShow = (m) => {
    setOpenMessage({ ...m });
    setMessageShow(true);
  };
  const handleMessageClose = () => {
    setMessageShow(false);
    setChatShow(true);
  };
  const collapseNavbar = () => {
    $('.navbar-toggler').addClass('collapsed');
    $('#brandDropdown').removeClass('show');
    $('#logBtn').click();
  };

  return (
    <div style={{ position: 'relative' }}>
      <Chat
        show={chatShow}
        handleClose={handleChatClose}
        handleMessageShow={handleMessageShow}
        myID={myID}
        myChats={myChats}
      />
      <OpenMessage
        message={openMessage}
        handleMessageClose={handleMessageClose}
        show={messageShow}
      />
      <span style={{ display: 'flex' }}>
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
            className={styles.logBtn}
            id="logBtn"
          >
            <span style={{ display: thisUser ? 'none' : 'block' }}>
              Login/Signup
            </span>
            <span style={{ display: thisUser ? 'block' : 'none' }}>
              My Account
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu id="brandDropdown" onMouseLeave={collapseNavbar}>
            <Dropdown.Item id="logBtn" onClick={() => logInOut()}>
              {thisUser ? 'Logout' : 'Login or Sign Up'}
            </Dropdown.Item>
            <span style={{ display: thisUser ? 'block' : 'none' }}>
              <Link
                to="/myProfile"
                className="dropdown-item"
                onClick={() => collapseNavbar()}
                style={{ display: thisUser ? 'inherit' : 'none' }}
              >
                My Profile
              </Link>
              {/* <div
                className="dropdown-item"
                onClick={handleChatShow}
                style={{ display: thisUser ? 'inherit' : 'none' }}
              >
                My Messages
              </div>
              <Link
                className="dropdown-item"
                onClick={() => collapseNavbar()}
                style={{ display: thisUser ? 'inherit' : 'none' }}
                to="/"
              >
                My Notifications
              </Link> */}
            </span>
          </Dropdown.Menu>
        </Dropdown>
      </span>
    </div>
  );
};
