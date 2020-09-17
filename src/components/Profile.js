import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { Button, Modal } from 'react-bootstrap';
import $ from 'jquery';
import * as db from '../firestore';
import { Client } from '../api/sanityClient';
import StreetAddress from '../components/StreetAddress';
import ErrorMessage from '../components/ErrorMessage';
import styles from './Profile.module.scss';
import imageUrlBuilder from '@sanity/image-url';

const Profile = () => {
  const thisUser = useContext(UserContext);

  const builder = imageUrlBuilder(Client);

  const urlFor = (source) => {
    return builder.image(source);
  };

  //////state for inputs//////
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageRef, setImageRef] = useState('');
  const [address, setAddress] = useState('Select Your Address');
  const [directory, setDirectory] = useState(false);
  const [notifications, setNotifications] = useState(false);
  //////state for error message popup////////
  const [errorMessage, setErrorMessage] = useState('');
  const [tryAgainBtn, setTryAgainBtn] = useState('block');
  const [tryAgainText, setTryAgainText] = useState('Try Again');
  const [resetBtn, setResetBtn] = useState('none');

  //////send state variables to sanity///////
  const submitProfile = async () => {
    const imageObj = {
      _type: 'image',
      asset: {
        _ref: imageRef,
        _type: 'reference',
      },
    };
    const image = imageObj;
    image['_type'] = 'image';
    const userObj = {
      name,
      phone,
      email,
      photoURL,
      address,
      image,
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

  const grabProfile = async () => {
    console.log(thisUser.image);
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
    } else {
      const imageObj = await thisUser.image;
      setPhotoURL(urlFor(imageObj).url());
    }
    console.log(photoURL);
    if (thisUser.address) {
      setAddress(thisUser.address);
    }
    if (thisUser.receiveNotifications) {
      setNotifications(true);
      $('#receiveNotifications').prop('checked', true);
    } else {
      $('#receiveNotifications').prop('checked', false);
    }
    if (thisUser.includeInDirectory) {
      setNotifications(true);
      $('#includeInDirectory').prop('checked', true);
    } else {
      $('#includeInDirectory').prop('checked', false);
    }

    $('#profileSetup').hide();
    $('#profileForm').css('display', 'flex');
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

  const fileSelect = (e) => {
    const file = e.target.files[0];
    const buttonId = e.target.getAttribute('button');
    setSelectedFile(file);
    $(`#${buttonId}`).show();
  };

  const fileUpload = async () => {
    let imageRes = await Client.assets.upload('image', selectedFile);
    setPhotoURL(imageRes.url);
    const newImageRef = imageRes._id;
    console.log(newImageRef);
    setImageRef(newImageRef);
  };

  const saveHandler = () => {
    console.log(thisUser);
    switch (true) {
      case $('#nameInput').val() === '':
        setErrorMessage('Please Select a User Name');
        setTryAgainText('Ok, Enter a User Name');
        setResetBtn('none');
        $('#errorMessage').css('display', 'flex');
        break;
      case address === 'Select Your Address':
        setErrorMessage('Please Select Your Address to Continue');
        setTryAgainText('Ok, Select My Address');
        $('#errorMessage').css('display', 'flex');
        break;
      default:
        submitProfile();
        break;
    }
  };

  useEffect(() => {
    grabProfile();
  }, []);

  return (
    <Modal
      show={thisUser && (!thisUser.address || !thisUser.name) ? true : false}
      id="profile"
    >
      <ErrorMessage
        errorMessage={errorMessage}
        tryAgainBtn={tryAgainBtn}
        tryAgainText={tryAgainText}
        resetBtn={resetBtn}
      />
      <Modal.Header>Profile Setup</Modal.Header>

      <Modal.Body>
        <div id="profileSetup" className={styles.profileSetup}>
          <h3>One final step...</h3>
          <Button variant="info" onClick={() => grabProfile()}>
            Finish My Profile!
          </Button>
        </div>
        <form id="profileForm" className={styles.profileForm}>
          <label htmlFor="nameInput">User Name:</label>
          <input
            id="nameInput"
            required
            type="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Judy Patel"
          ></input>

          <label htmlFor="emailInput">Email Address:</label>
          <input
            id="emailInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="username@email.com"
          ></input>

          <label htmlFor="phoneInput">Phone Number:</label>
          <input
            type="tel"
            id="phoneInput"
            placeholder="(770)555-1234"
            value={phone}
            onInput={phoneMask}
            onChange={(e) => setPhone(e.target.value)}
          />

          <StreetAddress
            onChange={(e) => setAddress(e.target.value)}
            userAddress={address}
            style={{ display: thisUser && thisUser.address ? 'none' : 'flex' }}
          />

          <div
            style={{ display: thisUser && thisUser.address ? 'flex' : 'none' }}
          >
            <span className={styles.label}>Street Address:</span>
            <span className={styles.input}>{address}</span>
          </div>
          <div className={styles.photoDiv}>
            <img src={photoURL} alt="profile" style={{ height: '80px' }} />
            <div className={styles.formFile}>
              <label className="form-file-label">Upload New Image</label>
              <input
                name="file"
                button="uploadFunctionButton"
                type="file"
                onChange={(e) => fileSelect(e)}
                className="form-control-file"
              />
              <button
                id="uploadFunctionButton"
                value="image-6cfbe57620cf399cfc417a0ac19af893f539058a-650x433-jpg"
                type="button"
                className="btn btn-primary"
                style={{ display: 'none' }}
                onClick={() => fileUpload()}
              >
                Upload Photo
              </button>
            </div>
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
          <Button onClick={() => saveHandler()}>Save Profile</Button>
          {/* <Button onClick={() => db.signOut()}>Logout</Button> */}
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Profile;
