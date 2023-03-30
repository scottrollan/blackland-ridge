import React, { useReducer, useState } from 'react';
import StreetAddress from './StreetAddress';
import { signOut, profilesCollection, usersRef } from '../firestore';
import { Button, LinearProgress } from '@material-ui/core';
import { Form } from 'react-bootstrap';
import { createRandomString } from '../functions/CreateRandomString';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
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
    case 'setUrgentAlerts':
      if ($('#textUrgentAlerts').prop('checked')) {
        return { ...state, textUrgentAlerts: true };
      } else {
        return { ...state, textUrgentAlerts: false };
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

const ProfileForm = ({ thisUser, setError, handleClose }) => {
  const today = new Date();
  const initialData = { ...thisUser };
  const [state, dispatch] = useReducer(reducer, {
    ...initialData,
    firstTimeLogin: false,
    dateCreated: today,
  });
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [redirect, setRedirect] = useState(null);

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
  // $('[type="tel"]').keyup(phoneMask);

  const fileSelect = async (e) => {
    const thisImage = e.target.files[0];
    setImage(thisImage);
    $('#uploadFunctionButton').css('visibility', 'visible');
  };

  const uploadImage = async (e) => {
    e.preventDefault();

    const randomString = createRandomString(22);
    const uploadTask = usersRef.child(`${randomString}`).put(image);

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
        setError(
          'Profile image file too large.  Try an image smaller than 10MB.',
          'OK'
        );
        $('#errorMessage').css('display', 'flex');
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
      case $('#profileEmailInput').val() === '':
        setError('Please enter an email address', 'Go Back');
        $('#errorMessage').css('display', 'show');
        break;
      case state.phoneInDirectory && $('#profilePhoneInput').val() === '':
        setError(
          'Please enter a phone number, or uncheck the "Let my neighbors see my phone number" box',
          'Go Back'
        );
        $('#errorMessage').css('display', 'show');
        break;
      case state.textUrgentAlerts && $('#profilePhoneInput').val() === '':
        setError(
          'Please enter a mobile number, or uncheck the "Text URGENT ALERTS to my phone" box',
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
        } catch (error) {
          console.log(error);
        }
        setError('Your profile has been upated', 'OK');
        $('#errorMessage').css('display', 'flex');
        handleClose();
        break;
    }
  };

  const logout = () => {
    signOut();
    setRedirect(true);
  };

  if (redirect) {
    return <Redirect to="/"></Redirect>;
  }
  return (
    <Form
      id="profileForm"
      className={styles.profileForm}
      style={{ textAlign: 'left' }}
    >
      <Form.Group controlId="profileNameInput">
        <Form.Label style={{ marginBottom: 0 }}>
          Full Name{'  '}
          <span style={{ color: 'var(--google-red', fontSize: 'small' }}>
            required
          </span>
          <div style={{ fontSize: 'small' }}>
            as you would like it to appear in the directory
          </div>
        </Form.Label>
        <Form.Control
          type="text"
          required
          value={state.name}
          onChange={(e) =>
            dispatch({ type: 'setFullName', payload: e.target.value })
          }
          placeholder="John W. Doe"
        />
      </Form.Group>
      <Form.Group controlId="displayNameInput">
        <Form.Label style={{ marginBottom: 0 }}>
          Display Name{' '}
          <span style={{ color: 'var(--google-red', fontSize: 'small' }}>
            required
          </span>
          <div style={{ fontSize: 'small', textAlign: 'left' }}>
            as you want it to appear in conversations/posts (ex:{' '}
            <span style={{ fontStyle: 'italic' }}>John D</span>)
          </div>
        </Form.Label>

        <Form.Control
          required
          type="input"
          value={state.displayName}
          onChange={(e) =>
            dispatch({ type: 'setDisplayName', payload: e.target.value })
          }
          placeholder="John Doe"
        ></Form.Control>
      </Form.Group>

      <Form.Group controlId="profileEmailInput">
        <Form.Label>
          Email Address:{' '}
          <span
            style={{
              color: 'var(--google-red',
              fontSize: 'small',
            }}
          >
            required
          </span>
        </Form.Label>
        <Form.Control
          type="email"
          required
          value={state.email}
          onChange={(e) =>
            dispatch({ type: 'setEmail', payload: e.target.value })
          }
          placeholder="username@email.com"
        />
      </Form.Group>

      <Form.Group controlId="profilePhoneInput">
        <Form.Label>
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
        </Form.Label>
        <Form.Control
          type="tel"
          placeholder="(770)555-1234"
          required={state.phoneInDirectory ? true : false}
          value={state.phone}
          onInput={phoneMask}
          onChange={(e) =>
            dispatch({ type: 'setPhone', payload: e.target.value })
          }
        />
      </Form.Group>

      <StreetAddress
        address={thisUser.address}
        onChange={(e) =>
          dispatch({ type: 'setAddress', payload: e.target.value })
        }
      />

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
            maxHeight: '6rem',
            alignSelf: 'center',
          }}
        />
        <div>
          <Form.Group>
            <Form.Label className="form-file-label">
              Upload New Image
            </Form.Label>
            <Form.Control
              name="file"
              type="file"
              onChange={(e) => fileSelect(e)}
            />
          </Form.Group>
          <Button
            id="uploadFunctionButton"
            value="image-6cfbe57620cf399cfc417a0ac19af893f539058a-650x433-jpg"
            type="button"
            style={{ visibility: 'hidden' }}
            onClick={uploadImage}
          >
            Upload Photo
          </Button>
        </div>
      </div>
      <div className={styles.checkboxes}>
        <div>
          <Form.Group
            controlId="includeInDirectory"
            className={styles.checkboxRow}
          >
            <Form.Label>Include me in the neighborhood Directory:</Form.Label>
            <Form.Check
              inline
              type="checkbox"
              checked={state.includeInDirectory ? true : false}
              onChange={(e) => dispatch({ type: 'setDirectory', payload: e })}
              style={{ backgroundColor: 'transparent' }}
            />
          </Form.Group>
        </div>

        <div style={{ display: state.includeInDirectory ? 'inherit' : 'none' }}>
          <Form.Group
            controlId="displayEmail"
            className={styles.checkboxRow}
            style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
          >
            <Form.Label>Let my neighbors see my email address:</Form.Label>
            <Form.Check
              inline
              type="checkbox"
              checked={state.emailInDirectory ? true : false}
              onChange={(e) =>
                dispatch({ type: 'setDisplayEmail', payload: e })
              }
              style={{ backgroundColor: 'transparent' }}
            />
          </Form.Group>
        </div>

        <div style={{ display: state.includeInDirectory ? 'inherit' : 'none' }}>
          <Form.Group
            controlId="displayPhone"
            className={styles.checkboxRow}
            style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
          >
            <Form.Label>Let my neighbors see my phone number:</Form.Label>
            <Form.Check
              inline
              type="checkbox"
              checked={state.phoneInDirectory ? true : false}
              onChange={(e) =>
                dispatch({ type: 'setDisplayPhone', payload: e })
              }
              style={{ backgroundColor: 'transparent' }}
            />
          </Form.Group>
        </div>

        <div>
          <Form.Group
            className={styles.checkboxRow}
            controlId="receiveNotifications"
          >
            <Form.Label>Email me occassional notifications:</Form.Label>
            <Form.Check
              inline
              type="checkbox"
              checked={state.receiveNotifications ? true : false}
              onChange={(e) =>
                dispatch({ type: 'setNotifications', payload: e })
              }
              style={{ backgroundColor: 'transparent' }}
            />
          </Form.Group>
        </div>

        <div>
          <Form.Group
            className={styles.checkboxRow}
            controlId="textUrgentAlerts"
          >
            <Form.Label>
              Text{' '}
              <span style={{ textDecoration: 'underline' }}>Urgent Alerts</span>{' '}
              to my phone:
            </Form.Label>
            <Form.Check
              inline
              type="checkbox"
              checked={state.textUrgentAlerts ? true : false}
              onChange={(e) =>
                dispatch({ type: 'setUrgentAlerts', payload: e })
              }
              style={{ backgroundColor: 'transparent' }}
            />
          </Form.Group>
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
    </Form>
  );
};

export default ProfileForm;
