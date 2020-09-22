import React, { useReducer } from 'react';
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
      console.log(action.payload);
      return { ...state, email: action.payload };
    case 'setPhone':
      console.log(action.payload);
      return { ...state, phone: action.payload };
  }
};
const ProfileForm = ({ thisUser }) => {
  const [state, dispatch] = useReducer(reducer, { ...thisUser });
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
  return (
    <form
      id="profileForm"
      className={styles.profileForm}
      style={{ display: thisUser ? 'flex' : 'none' }}
    >
      <h1 className={styles.header}>Profile for {state.name}</h1>

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
        value={state.name}
        onChange={(e) => dispatch({ type: 'setName', payload: e.target.value })}
        placeholder="John Doe"
      ></input>

      <label htmlFor="profileEmailInput">Email Address:</label>
      <input
        id="profileEmailInput"
        type="email"
        value={thisUser.email}
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
        value={thisUser.phone}
        onInput={phoneMask}
        onChange={(e) =>
          dispatch({ type: 'setPhone', payload: e.target.value })
        }
      />

      <div>
        <span>Street Address:</span> <span>{thisUser.address}</span>
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
          src={urlFor(state.image)}
          alt=""
          style={{ height: '80px', alignSelf: 'center' }}
        />
        <div className={styles.formFile}>
          <label className="form-file-label">Upload New Image</label>
          <input
            name="file"
            button="uploadFunctionButton"
            type="file"
            onChange={(e) => dispatch({ type: 'selectFile', payload: e })}
            className="form-control-file"
          />
          <button
            id="uploadFunctionButton"
            value="image-6cfbe57620cf399cfc417a0ac19af893f539058a-650x433-jpg"
            type="button"
            className="btn btn-primary"
            style={{ display: 'none' }}
            onClick={() => dispatch({ type: 'uploadFile' })}
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
