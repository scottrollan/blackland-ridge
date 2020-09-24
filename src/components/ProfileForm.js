import React, { useReducer, useState } from 'react';
import StreetAddress from './StreetAddress';
import * as db from '../firestore';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import { Client } from '../api/sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import styles from './ProfileForm.module.scss';

const builder = imageUrlBuilder(Client);

const urlFor = (source) => {
  return builder.image(source);
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setName':
      return { ...state, name: action.payload };
    case 'setEmail':
      return { ...state, email: action.payload };
    case 'setPhone':
      return { ...state, phone: action.payload };
    case 'setAddress':
      return { ...state, address: action.payload };
    case 'imageUploaded':
      $('#profileSetupImage').attr('src', action.payload.url);
      return { ...state, image: action.payload.image };
    //////////checkboxes/////////////
    case 'setDirectory':
      if ($('#includeInDirectory').prop('checked')) {
        return { ...state, includeInDirectory: true };
      } else {
        return { ...state, includeInDirectory: false };
      }
    case 'setNotifications':
      if ($('#receiveNotifications').prop('checked')) {
        return { ...state, receiveNotifications: true };
      } else {
        return { ...state, receiveNotifications: false };
      }
    case 'setDisplayEmail':
      console.log(state);
      if ($('#displayEmail').prop('checked')) {
        return { ...state, emailInDirectory: true };
      } else {
        return { ...state, emailInDirectory: false };
      }
    case 'setDisplayPhone':
      if ($('#displayPhone').prop('checked')) {
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

  const [selectedFile, setSelectedFile] = useState(null);

  const history = useHistory();

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
    setSelectedFile(thisImage);
    $('#uploadFunctionButton').css('visibility', 'visible');
  };

  const uploadImage = async () => {
    try {
      const response = await Client.assets.upload('image', selectedFile);
      console.log(response);
      const newImage = {
        _type: 'image',
        asset: {
          _ref: response._id,
          _type: 'reference',
        },
      };
      dispatch({
        type: 'imageUploaded',
        payload: { url: response.url, image: newImage },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const saveHandler = async () => {
    switch (true) {
      case $('#profileNameInput').val() === '':
        setError('Please Select a User Name', 'Go Back');
        break;
      case state.emailInDirectory && $('#profileEmailInput').val() === '':
        setError(
          'Please enter an email address, or uncheck the "Let my neighbors see my email address" box',
          'Go Back'
        );
        break;
      case state.phoneInDirectory && $('#profilePhoneInput').val() === '':
        setError(
          'Please enter a phone number, or uncheck the "Let my neighbors see my phone number" box',
          'Go Back'
        );
        break;
      case state.address === '' || state.address === 'Select Your Address':
        setError('Please select your address from the menu', 'Go Back');
      default:
        state['_type'] = 'profile';
        delete state.isNewUser;
        try {
          const response = await Client.patch(state._id).set(state).commit();
          console.log(response);
          setError('Your profile has been updated', 'close');
          history.push('/');
          break;
        } catch (error) {
          console.log(error);
        }
        break;
    }
  };

  const logout = () => {
    db.signOut();
    history.push('/');
  };

  return (
    <form
      id="profileForm"
      className={styles.profileForm}
      style={{ display: thisUser ? 'flex' : 'none' }}
    >
      <h2 style={{ display: state.address ? 'inherit' : 'none' }}>
        My Profile
      </h2>
      <label htmlFor="profileNameInput" style={{ marginBottom: 0 }}>
        User Name{' '}
        <span style={{ color: 'var(--google-red', fontSize: 'small' }}>
          required
        </span>
      </label>
      <div style={{ fontSize: 'small' }}>
        as you want it to appear in the directory (if opted in)
      </div>
      <input
        id="profileNameInput"
        required
        type="input"
        value={state.name}
        onChange={(e) => dispatch({ type: 'setName', payload: e.target.value })}
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
      <div className={styles.photoDiv}>
        <img
          id="profileSetupImage"
          src={urlFor(state.image)}
          alt=""
          style={{ minHeight: '120px', alignSelf: 'center' }}
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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={saveHandler}>Save Profile</Button>
        <Button onClick={logout}>Logout</Button>
      </div>
    </form>
  );
};

export default ProfileForm;
