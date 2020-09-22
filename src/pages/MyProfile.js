import React, { useState, useContext, useEffect, useReducer } from 'react';
import { UserContext } from '../App';
import { Client } from '../api/sanityClient';
import { Spinner } from 'react-bootstrap';
import $ from 'jquery';
import ProfileForm from '../components/ProfileForm';
import ErrorMessage from '../components/ErrorMessage';
import imageUrlBuilder from '@sanity/image-url';
import styles from './MyProfile.module.scss';

const MyProfile = () => {
  const thisUser = useContext(UserContext);

  // const saveHandler = () => {
  //   switch (true) {
  //     case $('#profileNameInput').val() === '':
  //       setErrorMessage('Please Select a User Name');
  //       setTryAgainText('Ok, Enter a User Name');
  //       $('#errorMessage').css('display', 'flex');
  //       break;
  //     default:
  //       submitProfile();
  //       break;
  //   }
  // // };

  // const submitProfile = async () => {
  //   const response = await Client.patch(state._id)
  //     .set(state)
  //     .commit()
  //     .catch((err) => {
  //       console.log('Error: ', err.message);
  //     });
  //   console.log(response);
  // };

  // React.useEffect(() => {
  //   return { ...state, ...thisUser };
  // }, []);

  return thisUser ? (
    <div className={styles.myProfile}>
      <ProfileForm
        thisUser={thisUser}
        // saveHandler={() => saveHandler()}
        // setThis={(value, field) => setThis(field, value)}
        // fileSelect={(e) => fileSelect(e)}
        // fileUpload={() => fileUpload()}
        // setN={() => setN()}
        // setD={() => setD}
      />
    </div>
  ) : (
    <div className={styles.myProfile}>
      <Spinner animation="grow" variant="dark" />
    </div>
  );
};

export default MyProfile;
