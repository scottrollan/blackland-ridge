import React, { useState, useContext } from 'react';
import { UserContext } from '../App';
// import GrabProfile from '../functions/GrabProfile';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import { Client } from '../api/sanityClient';
import ErrorMessage from '../components/ErrorMessage';
import imageUrlBuilder from '@sanity/image-url';
import styles from './MyProfile.module.scss';

const MyProfile = () => {
  const thisUser = useContext(UserContext);

  const builder = imageUrlBuilder(Client);

  const urlFor = (source) => {
    return builder.image(source);
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [tryAgainText, setTryAgainText] = useState('');
  const [name, setName] = useState(thisUser.name);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(thisUser.phone ? thisUser.phone : '');
  const address = thisUser.address ? thisUser.address : '';
  const [receiveNotifications, setReceiveNotifications] = useState(
    thisUser.receiveNotifications ? thisUser.receiveNotifications : false
  );
  const [includeInDirectory, setIncludeInDirectory] = useState(
    thisUser.includeInDirectory ? thisUser.includeInDirectory : false
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageRef, setImageRef] = useState(
    thisUser.image ? thisUser.image.asset._ref : null
  );

  const setD = () => {
    if ($('#includeInDirectory').prop('checked') === true) {
      setIncludeInDirectory(true);
    } else {
      setIncludeInDirectory(false);
    }
  };
  const setN = () => {
    if ($('#receiveNotifications').prop('checked') === true) {
      setReceiveNotifications(true);
    } else {
      setReceiveNotifications(false);
    }
  };

  const fileSelect = (e) => {
    const image = e.target.files[0];
    const buttonId = e.target.getAttribute('button');
    setSelectedFile(image);
    $(`#${buttonId}`).show();
  };

  const fileUpload = async () => {
    let imageRes = await Client.assets.upload('image', selectedFile);
    $('#profileSetupImage img').attr('src', urlFor(imageRes));
    const newImageRef = imageRes._id;
    setImageRef(newImageRef);
  };

  const phoneMask = () => {
    let num = $('#profilePhoneInput').val().replace(/\D/g, '');
    $('#profilePhoneInput').val(
      '(' +
        num.substring(0, 3) +
        ')' +
        num.substring(3, 6) +
        '-' +
        num.substring(6, 10)
    );
  };
  $('[type="tel"]').keyup(phoneMask);

  const saveHandler = () => {
    switch (true) {
      case $('#profileNameInput').val() === '':
        setErrorMessage('Please Select a User Name');
        setTryAgainText('Ok, Enter a User Name');
        $('#errorMessage').css('display', 'flex');
        break;
      default:
        submitProfile();
        break;
    }
  };

  const submitProfile = async () => {
    const userObj = {
      _id: thisUser._id,
      _type: 'profile',
      name,
      email,
      phone,
      includeInDirectory,
      receiveNotifications,
      image: {
        _type: 'image',
        asset: {
          _ref: imageRef,
          _type: 'reference',
        },
      },
    };
    const response = await Client.patch(thisUser._id)
      .set(userObj)
      .commit()
      .catch((err) => {
        console.log('Error: ', err.message);
      });
    console.log(response);
  };

  React.useEffect(() => {
    window.location.reload();
  }, []);

  return (
    <div className={styles.myProfile}>
      {/* <ErrorMessage
        errorMessage={errorMessage}
        tryAgainText={tryAgainText}
        tryAgainButton="block"
        resetBtn="none"
      /> */}
      <form
        id="profileForm"
        className={styles.profileForm}
        style={{ display: thisUser ? 'flex' : 'none' }}
      >
        <h1
          className={styles.header}
          style={{ display: name ? 'block' : 'none' }}
        >
          Profile for {name}
        </h1>

        <label htmlFor="profileNameInput">
          User Name{' '}
          <span style={{ color: 'var(--google-red', fontSize: 'small' }}>
            required
          </span>
        </label>
        <div style={{ fontSize: 'small' }}>
          as you want it to appear in the directory (if opt in)
        </div>
        <input
          id="profileNameInput"
          required
          type="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ex: Judy Patel"
        ></input>

        <label htmlFor="profileEmailInput">Email Address:</label>
        <input
          id="profileEmailInput"
          type="email"
          // value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="username@email.com"
        ></input>

        <label htmlFor="profilePhoneInput">Phone Number:</label>

        <input
          type="tel"
          id="profilePhoneInput"
          placeholder="(770)555-1234"
          value={phone}
          onInput={phoneMask}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div>
          <span>Street Address:</span> <span>{address}</span>
          <div style={{ fontSize: 'small' }}>
            contact the{' '}
            <a href="mailto:barry@barryrollanstudio.com?subject=incorrect address on Blackland Ridge">
              network administrator
            </a>{' '}
            if your address is listed incorrectly
          </div>
        </div>
        <div className={styles.photoDiv}>
          <img
            id="profileSetupImage"
            src={thisUser.imageURL}
            alt=""
            style={{ height: '80px', alignSelf: 'center' }}
          />
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
            value={includeInDirectory}
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
            value={receiveNotifications}
            onClick={() => setN()}
          />
        </div>
        <Button onClick={() => saveHandler()}>Save Profile</Button>
        {/* <Button onClick={() => db.signOut()}>Logout</Button> */}
      </form>
    </div>
  );
};

export default MyProfile;
