import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { Button, Modal } from 'react-bootstrap';
import $ from 'jquery';
import * as db from '../firestore';
import { Client } from '../api/sanityClient';
import StreetAddress from '../components/StreetAddress';
import ErrorMessage from '../components/ErrorMessage';
import styles from './Profile.module.scss';

const Profile = ({ show }) => {
  const thisUser = useContext(UserContext);
  //////state for inputs//////
  const [name, setName] = useState(thisUser ? thisUser.name : '');
  const [phone, setPhone] = useState(thisUser ? thisUser.phone : '');
  const [email, setEmail] = useState(thisUser ? thisUser.email : '');
  const [photoURL, setPhotoURL] = useState(thisUser ? thisUser.photURL : '');
  const [address, setAddress] = useState(thisUser ? thisUser.address : '');
  const [directory, setDirectory] = useState(
    thisUser ? thisUser.includeInDirectory : false
  );
  const [notifications, setNotifications] = useState(
    thisUser ? thisUser.receiveNotifications : false
  );
  //////state for error message popup////////
  const [errorMessage, setErrorMessage] = useState('');
  const [tryAgainBtn, setTryAgainBtn] = useState(true);
  const [tryAgainText, setTryAgainText] = useState('Try Again');
  const [resetBtn, setResetBtn] = useState(false);

  //////send state variables to sanity///////
  const submitProfile = async () => {
    const userObj = {
      name,
      phone,
      email,
      photoURL,
      address,
      includeInDirectory: directory,
      receiveNotifications: notifications,
    };

    const r = await Client.patch(thisUser._id)
      .set(userObj)
      .commit()
      .catch((err) => {
        console.log('Error: ', err.message);
      });

    if (
      r.address &&
      r.name &&
      ((r.includeInDirectory && r.phone && r.email) || !r.includeInDirectory)
    ) {
      userObj['profileComplete'] = true;
    } else {
      userObj['profileComplete'] = false;
    }
  };

  const setD = () => {
    if ($('#includeInDirectory').prop('checked') === true) {
      setDirectory(true);
    } else {
      setDirectory(false);
    }
  };
  const setN = () => {
    if ($('#receiveNotifications').prop('checked') === true) {
      setNotifications(true);
    } else {
      setNotifications(false);
    }
  };

  const grabProfile = () => {
    if (thisUser.name) {
      setName(thisUser.name);
    }
    if (thisUser.email) {
      setEmail(thisUser.email);
    }
    if (thisUser.phone) {
      setPhone(thisUser.phone);
    }
    if (thisUser.photoURL) {
      setPhotoURL(thisUser.photoURL);
    }
    if (thisUser.address) {
      setAddress(thisUser.address);
    }
    if (thisUser.receiveNotifications) {
      $('#receiveNotifications').prop('checked', true);
    } else {
      $('#receiveNotifications').prop('checked', false);
    }
    if (thisUser.includeInDirectory) {
      $('#includeInDirectory').prop('checked', true);
    } else {
      $('#includeInDirectory').prop('checked', false);
    }
    if (thisUser && !thisUser.profileComplete) {
      //if no username or address has not been set, show the profile form to complete
      $('#profileSetup').hide();
      $('#profileForm').show();
    }
  };

  const phoneMask = () => {
    let num = $('#phoneInput').val().replace(/\D/g, '');
    $('#phoneInput').val(
      '(' +
        num.substring(0, 3) +
        ')' +
        num.substring(3, 6) +
        '-' +
        num.substring(6, 10)
    );
  };

  $('[type="tel"]').keyup(phoneMask);

  useEffect(() => {
    grabProfile();
  }, []);

  return (
    <Modal show={show} id="profile">
      <ErrorMessage
        errorMessage={errorMessage}
        tryAgainBtn={tryAgainBtn}
        tryAgainText={tryAgainText}
        resetBtn={resetBtn}
      />
      <Modal.Header>Set Up Your Profile</Modal.Header>

      <Modal.Body>
        <div id="profileSetup" className={styles.profileSetup}>
          <h3>One final step...</h3>
          <Button variant="info" onClick={() => grabProfile()}>
            Finish My Profile!
          </Button>
        </div>
        <form id="profileForm" className={styles.profileForm}>
          <div className={styles.inputRow}>
            <label htmlFor="nameInput">User Name:</label>
            <input
              id="nameInput"
              required
              type="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Judy Patel"
            ></input>
          </div>
          <div className={styles.inputRow}>
            <label htmlFor="emailInput">Email Address:</label>
            <input
              id="emailInput"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username@email.com"
            ></input>
          </div>
          <div className={styles.inputRow}>
            <label htmlFor="phoneInput">Phone Number:</label>
            <input
              type="tel"
              id="phoneInput"
              placeholder="(770)555-1234"
              value={phone}
              onInput={phoneMask}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div
            className={styles.inputRow}
            style={{ display: thisUser && thisUser.address ? 'none' : 'flex' }}
          >
            <StreetAddress
              onChange={(e) => setAddress(e.target.value)}
              userAddress={address}
            />
          </div>
          <div
            className={styles.inputRow}
            style={{ display: thisUser && thisUser.address ? 'flex' : 'none' }}
          >
            <span className={styles.label}>Street Address:</span>
            <span className={styles.input}>{address}</span>
          </div>
          <div className={styles.inputRow}>
            <img src={photoURL} alt="profile" style={{ height: '80px' }} />
          </div>
          <div className={styles.checkboxRow}>
            <label htmlFor="includeInDirectory">
              Include me in the neighborhood Directory:
            </label>
            <input
              type="checkbox"
              id="includeInDirectory"
              value="directory"
              onClick={() => setD()}
            />
          </div>
          <div className={styles.checkboxRow}>
            <label htmlFor="receiveNotifications">
              Send me occassional notifications:
            </label>
            <input
              type="checkbox"
              id="receiveNotifications"
              value="notifications"
              onClick={() => setN()}
            />
          </div>
          <Button onClick={() => submitProfile()}>Save Profile</Button>
          <Button onClick={() => db.signOut()}>Logout</Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Profile;
