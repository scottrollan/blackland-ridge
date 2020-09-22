import React, { useReducer, useState } from 'react';
import { Button } from 'react-bootstrap';
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
      console.log(state);
      return { ...state, name: action.payload };
    case 'setEmail':
      return { ...state, email: action.payload };
    case 'setPhone':
      return { ...state, phone: action.payload };
    case 'imageUploaded':
      $('#profileSetupImage').attr('src', action.payload.url);
      return { ...state, image: action.payload.image };
    default:
      return state;
  }
};
const ProfileForm = ({ thisUser }) => {
  const [state, dispatch] = useReducer(reducer, { ...thisUser });
  const [selectedFile, setSelectedFile] = useState(null);
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

  const showAddressNote = () => {
    $(`#addressNote`).show();
  };

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

  return (
    <form
      id="profileForm"
      className={styles.profileForm}
      style={{ display: thisUser ? 'flex' : 'none' }}
    >
      <h2>My Profile</h2>
      <label htmlFor="profileNameInput">
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
      <label htmlFor="profileEmailInput">Email Address:</label>
      <input
        id="profileEmailInput"
        type="email"
        value={state.email}
        onChange={(e) =>
          dispatch({ type: 'setEmail', payload: e.target.value })
        }
        placeholder="username@email.com"
      ></input>
      <label htmlFor="profilePhoneInput">Phone Number:</label>
      <input
        type="tel"
        id="profilePhoneInput"
        placeholder="(770)555-1234"
        value={state.phone}
        onInput={phoneMask}
        onChange={(e) =>
          dispatch({ type: 'setPhone', payload: e.target.value })
        }
      />
      <label htmlFor="profileAddress">Street Address:</label>
      <input
        type="text"
        id="profileAddress"
        value={state.address}
        readOnly
        onClick={showAddressNote}
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
      <div className={styles.checkboxRow}>
        <label htmlFor="includeInDirectory">
          Include me in the neighborhood Directory:
        </label>
        <input
          type="checkbox"
          id="includeInDirectory"
          value={thisUser.includeInDirectory}
          onClick={(e) => dispatch({ type: 'setDirectory', payload: e })}
        />
      </div>
      <div className={styles.checkboxRow}>
        <label htmlFor="receiveNotifications">
          Send me occassional notifications:
        </label>
        <input
          type="checkbox"
          id="receiveNotifications"
          value={thisUser.receiveNotifications}
          onClick={(e) => dispatch({ type: 'setNotifications', payload: e })}
        />
      </div>
      <Button onClick={() => dispatch({ type: 'saveHandler' })}>
        Save Profile
      </Button>
      {/* <Button onClick={() => db.signOut()}>Logout</Button> */}
    </form>
  );
};

export default ProfileForm;
