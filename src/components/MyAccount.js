import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import Chat from '../pages/chat/Chat';
import OpenMessage from '../pages/chat/OpenMessage';
import NewMessage from '../pages/chat/NewMessage';
import { chatsCollection } from '../firestore/index';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import styles from './MyAccount.module.scss';

export const MyAccount = ({ logInOut }) => {
  const thisUser = useContext(UserContext);
  const myID = thisUser.id;
  // const myChats = thisUser.chats;
  const [myChatArray, setMyChatArray] = useState([]);
  const [chatShow, setChatShow] = useState(false);
  const [messageShow, setMessageShow] = useState(false);
  const [newMessageShow, setNewMessageShow] = useState(false);
  const [openMessage, setOpenMessage] = useState({});
  const [haveUnread, setHaveUnread] = useState(false);
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
  const handleNewMessageShow = () => {
    setNewMessageShow(true);
  };
  const handleMessageClose = () => {
    setMessageShow(false);
    setChatShow(true);
  };
  const handleNewMessageClose = () => {
    setNewMessageShow(false);
    setChatShow(true);
  };
  const collapseNavbar = () => {
    $('.navbar-toggler').addClass('collapsed');
    $('#brandDropdown').removeClass('show');
    $('#logBtn').click();
  };

  useEffect(() => {
    if (!myID) {
      return;
    }
    let myChats = [];
    let unreadArray = [];
    //listen for changes
    chatsCollection
      .where('chatters', 'array-contains', myID)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let data = { ...doc.data(), id: doc.id };
          unreadArray = [...unreadArray, ...data.unread];
          myChats = [...myChats, { ...data }];
        });
        if (unreadArray.includes(myID)) {
          setHaveUnread(true);
        } else {
          setHaveUnread(false);
        }
        setMyChatArray([...myChats]);
      });
    const unsubscribe = chatsCollection.onSnapshot(() => {});

    return unsubscribe();
  }, [chatsCollection, myID]);

  return (
    <div style={{ position: 'relative' }}>
      <Chat
        show={chatShow}
        handleClose={handleChatClose}
        handleMessageShow={handleMessageShow}
        handleNewMessageShow={handleNewMessageShow}
        myID={myID}
        myChats={myChatArray}
      />
      <OpenMessage
        message={openMessage}
        handleMessageClose={() => handleMessageClose()}
        show={messageShow}
      />
      <NewMessage
        show={newMessageShow}
        handleNewMessageClose={() => handleNewMessageClose()}
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
              <div
                className="dropdown-item"
                onClick={handleChatShow}
                style={{ display: thisUser ? 'inherit' : 'none' }}
              >
                My Messages
                <span
                  id="haveUnread"
                  style={{
                    display: haveUnread ? 'inline-block' : 'none',
                  }}
                >
                  &nbsp;&nbsp;&nbsp;
                  <i
                    className="fas fa-envelope"
                    style={{
                      color: 'var(--color-pallette-accent)',
                      fontSize: 'small',
                    }}
                  ></i>
                </span>
              </div>
              <Link
                className="dropdown-item"
                onClick={() => collapseNavbar()}
                style={{ display: thisUser ? 'inherit' : 'none' }}
                to="/"
              >
                My Notifications
              </Link>
            </span>
          </Dropdown.Menu>
        </Dropdown>
      </span>
    </div>
  );
};
