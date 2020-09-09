import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { Button, Modal } from 'react-bootstrap';
import $ from 'jquery';
import * as db from '../firestore';
// import useFetchProfile from '../hooks/useFetchProfile';
import StreetAddress from '../components/StreetAddress';
import styles from './Profile.module.scss';

const Profile = ({
  show,
  userName,
  userPhoneNumber,
  userEmail,
  userAddress,
  userPhotoURL,
}) => {
  const user = useContext(UserContext);

  const [uid, setUid] = useState(user ? user.uid : '');
  const [name, setName] = useState(user ? user.displayName : '');
  const [phone, setPhone] = useState(user ? user.phoneNumber : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [photoURL, setPhotoURL] = useState(user ? user.photoURL : '');
  const [streetAddress, setStreetAddress] = useState('');

  const submitProfile = async () => {
    console.log(uid, name, phone, email, photoURL, streetAddress);
  };

  const setProfile = () => {
    if (user.uid) {
      setUid(user.uid);
    }
    if (userName) {
      setName(userName);
    } else if (user.displayName) {
      setName(user.displayName);
    }
    if (userEmail) {
      setEmail(userEmail);
    } else if (user.email) {
      setEmail(user.email);
    }
    if (userPhoneNumber) {
      setPhone(userPhoneNumber);
    } else if (user.phoneNumber) {
      setPhone(user.phoneNumber);
    }
    if (userPhotoURL) {
      setPhotoURL(userPhotoURL);
    } else if (user.photoURL) {
      setPhotoURL(user.photoURL);
    }
    if (userAddress) {
      setStreetAddress(userAddress);
    }
    $('#profileSetup').hide();
    $('#profileForm').show();
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
    setProfile();
  }, []);

  return (
    <div id="profileModal">
      <Modal show={show} id="profile">
        <Modal.Header>Set Up Your Profile</Modal.Header>

        <Modal.Body>
          <div id="profileSetup">
            <h3>One final step...</h3>
            <Button variant="info" onClick={() => setProfile()}>
              Finish My Profile!
            </Button>
          </div>
          <form id="profileForm" onSubmit={submitProfile}>
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
              style={{ display: userAddress ? 'none' : 'flex' }}
            >
              <StreetAddress
                onChange={(e) => setStreetAddress(e.target.value)}
                userAddress={streetAddress}
              />
            </div>
            <div
              className={styles.inputRow}
              style={{ display: userAddress ? 'flex' : 'none' }}
            >
              <span className={styles.label}>Street Address:</span>
              <span className={styles.input}>{streetAddress}</span>
            </div>
            <div className={styles.inputRow}>
              <img
                src={photoURL}
                alt="Upload an Image"
                style={{ height: '80px' }}
              />
            </div>
            <Button type="submit">Save Profile</Button>
            <Button variant="warning" onClick={() => db.signOut()}>
              Logout
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;
