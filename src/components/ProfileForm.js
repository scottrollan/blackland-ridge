import React, { useReducer, useState } from 'react';
import StreetAddress from './StreetAddress';
import { signOut, profilesCollection, usersRef } from '../firestore';
import { Button, LinearProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { createRandomString } from '../functions/CreateRandomString';
import $ from 'jquery';
// import { Client } from '../api/sanityClient';
import styles from './ProfileForm.module.scss';

const reducer = (state, action) => {
  switch (action.type) {
    case 'setFullName':
      return { ...state, name: action.payload };
    case 'setDisplayName':
      return { ...state, displayName: action.payload };
    case 'setEmail':
      return { ...state, email: action.payload };
    case 'setPhone':
      return { ...state, phone: action.payload };
    case 'setAddress':
      return { ...state, address: action.payload };
    case 'imageUploaded':
      $('#profileSetupImage').attr('src', action.payload.url);
      return { ...state, photoURL: action.payload.url };
    //////////checkboxes/////////////
    case 'setDirectory':
      if ($('#includeInDirectory').prop('checked')) {
        return { ...state, includeInDirectory: true };
      } else {
        return {
          ...state,
          includeInDirectory: false,
          emailInDirectory: false,
          phoneInDirectory: false,
        };
      }
    case 'setNotifications':
      if ($('#receiveNotifications').prop('checked')) {
        return { ...state, receiveNotifications: true };
      } else {
        return {
          ...state,
          receiveNotifications: false,
        };
      }
    case 'setDisplayEmail':
      if (
        $('#displayEmail').prop('checked') &&
        $('#includeInDirectory').prop('checked')
      ) {
        return { ...state, emailInDirectory: true };
      } else {
        return { ...state, emailInDirectory: false };
      }
    case 'setDisplayPhone':
      if (
        $('#displayPhone').prop('checked') &&
        $('#includeInDirectory').prop('checked')
      ) {
        return { ...state, phoneInDirectory: true };
      } else {
        return { ...state, phoneInDirectory: false };
      }
    default:
      return state;
  }
};

const ProfileForm = ({ thisUser, setError }) => {
  const [state, dispatch] = useReducer(reducer, { ...thisUser });
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  let history = useHistory();

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

  const fileSelect = async (e) => {
    const thisImage = e.target.files[0];
    setImage(thisImage);
    $('#uploadFunctionButton').css('visibility', 'visible');
  };

  const uploadImage = async (e) => {
    e.preventDefault();

    const randomString = createRandomString(8);
    const uploadTask = usersRef
      .child(`${randomString}${image.name}`)
      .put(image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        //gives progress info on upload
        const transferProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(transferProgress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        //when complete
        uploadTask.snapshot.ref.getDownloadURL().then((gotURL) => {
          dispatch({
            type: 'imageUploaded',
            payload: { url: gotURL, image: image },
          });
        });
        console.log('Upload Complete');
      }
    );
  };

  const saveHandler = async () => {
    switch (true) {
      case $('#profileNameInput').val() === '':
        setError('Please Select a User Name', 'Go Back');
        $('#errorMessage').css('display', 'show');
        break;
      case $('#displayNameInput').val() === '':
        setError('Please Select a Display Name', 'Go Back');
        $('#errorMessage').css('display', 'show');
        break;
      case state.emailInDirectory && $('#profileEmailInput').val() === '':
        setError(
          'Please enter an email address, or uncheck the "Let my neighbors see my email address" box',
          'Go Back'
        );
        $('#errorMessage').css('display', 'show');
        break;
      case state.phoneInDirectory && $('#profilePhoneInput').val() === '':
        setError(
          'Please enter a phone number, or uncheck the "Let my neighbors see my phone number" box',
          'Go Back'
        );
        $('#errorMessage').css('display', 'show');
        break;
      case state.address === '' || state.address === 'Select Your Address':
        setError('Please select your address from the menu', 'Go Back');
        $('#errorMessage').css('display', 'show');
        break;
      default:
        //if no input errors

        try {
          await profilesCollection.doc(state.id).set({ ...state });
          setError('Your profile has been upated', 'OK');
          history.push('/');
          window.location.reload();
          $('#errorMessage').css('display', 'flex');
        } catch (error) {
          console.log(error);
        }
        break;
    }
  };

  const logout = () => {
    signOut();

    history.push('/');
  };

  return (
    <form id="profileForm" className={styles.profileForm}>
      {/* <h2 style={{ display: state.address ? 'inherit' : 'none' }}>
        My Profile
      </h2> */}
      <label htmlFor="profileNameInput" style={{ marginBottom: 0 }}>
        Full Name{' '}
        <span style={{ color: 'var(--google-red', fontSize: 'small' }}>
          required
        </span>
      </label>
      <div style={{ fontSize: 'small', textAlign: 'left' }}>
        as you want it to appear in the directory (ex:{' '}
        <span style={{ fontStyle: 'italic' }}>John W. Doe</span>)
      </div>
      <input
        id="profileNameInput"
        required
        type="input"
        value={state.name}
        onChange={(e) =>
          dispatch({ type: 'setFullName', payload: e.target.value })
        }
        placeholder="John Doe"
      ></input>

      <label htmlFor="displayNameInput" style={{ marginBottom: 0 }}>
        Display Name{' '}
        <span style={{ color: 'var(--google-red', fontSize: 'small' }}>
          required
        </span>
      </label>
      <div style={{ fontSize: 'small', textAlign: 'left' }}>
        as you want it to appear in conversations/posts (ex:{' '}
        <span style={{ fontStyle: 'italic' }}>John D</span>)
      </div>
      <input
        id="displayNameInput"
        required
        type="input"
        value={state.displayName}
        onChange={(e) =>
          dispatch({ type: 'setDisplayName', payload: e.target.value })
        }
        placeholder="John Doe"
      ></input>

      <label htmlFor="profileEmailInput">
        Email Address:{' '}
        <span
          style={{
            color: 'var(--google-red',
            fontSize: 'small',
            display: state.emailInDirectory ? 'inline' : 'none',
          }}
        >
          required
        </span>
      </label>
      <input
        id="profileEmailInput"
        type="email"
        required={state.emailInDirectory ? true : false}
        value={state.email}
        onChange={(e) =>
          dispatch({ type: 'setEmail', payload: e.target.value })
        }
        placeholder="username@email.com"
      ></input>
      <label htmlFor="profilePhoneInput">
        Phone Number:{' '}
        <span
          style={{
            color: 'var(--google-red',
            fontSize: 'small',
            display: state.phoneInDirectory ? 'inline' : 'none',
          }}
        >
          required
        </span>
      </label>
      <input
        type="tel"
        id="profilePhoneInput"
        placeholder="(770)555-1234"
        required={state.phoneInDirectory ? true : false}
        value={state.phone}
        onInput={phoneMask}
        onChange={(e) =>
          dispatch({ type: 'setPhone', payload: e.target.value })
        }
      />
      <div
        style={{
          display: state.address ? 'none' : 'inherit',
          flexDirection: 'column',
          textAlign: 'left',
        }}
      >
        <StreetAddress
          onChange={(e) =>
            dispatch({ type: 'setAddress', payload: e.target.value })
          }
        />
      </div>
      <div
        style={{
          display: state.address ? 'flex' : 'none',
          flexDirection: 'column',
          textAlign: 'left',
        }}
      >
        <label htmlFor="profileAddress">Street Address:</label>
        <input
          type="text"
          id="profileAddress"
          value={state.address}
          readOnly
          onFocus={() => $('#addressNote').show()}
          // onClick={showAddressNote}
          style={{ marginBottom: '0.5rem' }}
        />
        <div
          id="addressNote"
          style={{ fontSize: 'x-small', marginBottom: '1rem', display: 'none' }}
        >
          contact the{' '}
          <a href="mailto:barry@barryrollanstudio.com?subject=incorrect address on Blackland Ridge">
            network administrator
          </a>{' '}
          if your address is listed incorrectly
        </div>
      </div>
      <div style={{ width: '100%', minHeight: '14px', padding: '3px 10px' }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          style={{ visibility: progress < 1 ? 'hidden' : 'visible' }}
        />
      </div>
      <div className={styles.photoDiv}>
        <img
          id="profileSetupImage"
          src={state.photoURL}
          alt=""
          style={{
            minHeight: 'var(--avatar-size)',
            alignSelf: 'center',
          }}
        />
        <div>
          <label className="form-file-label">Upload New Image</label>
          <input
            name="file"
            // button="uploadFunctionButton"
            type="file"
            onChange={(e) => fileSelect(e)}
            className="form-control-file"
          />
          <Button
            id="uploadFunctionButton"
            value="image-6cfbe57620cf399cfc417a0ac19af893f539058a-650x433-jpg"
            type="button"
            style={{ visibility: 'hidden' }}
            // onClick={() => dispatch({ type: 'uploadFile' })}
            onClick={uploadImage}
          >
            Upload Photo
          </Button>
        </div>
      </div>
      <div className={styles.checkboxes}>
        <div className={styles.checkboxRow}>
          <label htmlFor="includeInDirectory">
            Include me in the neighborhood Directory:
          </label>
          <input
            className={styles.checkbox}
            type="checkbox"
            id="includeInDirectory"
            checked={state.includeInDirectory ? true : false}
            onChange={(e) => dispatch({ type: 'setDirectory', payload: e })}
          />
        </div>
        <div
          className={styles.checkboxRow}
          style={{ display: state.includeInDirectory ? 'inherit' : 'none' }}
        >
          <label htmlFor="displayEmail">
            Let my neighbors see my email address:
          </label>
          <input
            className={styles.checkbox}
            type="checkbox"
            id="displayEmail"
            checked={state.emailInDirectory ? true : false}
            onChange={(e) => dispatch({ type: 'setDisplayEmail', payload: e })}
          />
        </div>
        <div
          className={styles.checkboxRow}
          style={{ display: state.includeInDirectory ? 'inherit' : 'none' }}
        >
          <label htmlFor="displayPhone">
            Let my neighbors see my phone number:
          </label>
          <input
            className={styles.checkbox}
            type="checkbox"
            id="displayPhone"
            checked={state.phoneInDirectory ? true : false}
            onChange={(e) => dispatch({ type: 'setDisplayPhone', payload: e })}
          />
        </div>
        <div className={styles.checkboxRow}>
          <label htmlFor="receiveNotifications">
            Send me occassional notifications:
          </label>
          <input
            className={styles.checkbox}
            type="checkbox"
            id="receiveNotifications"
            checked={state.receiveNotifications ? true : false}
            onChange={(e) => dispatch({ type: 'setNotifications', payload: e })}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Button onClick={saveHandler}>Save Profile</Button>
        <Button onClick={logout}>Logout</Button>
      </div>
    </form>
  );
};

export default ProfileForm;
