import React, { useContext } from 'react';
import { UserContext } from '../App';
import { Client } from '../api/sanityClient';
import { Spinner } from 'react-bootstrap';
import $ from 'jquery';
import ProfileForm from '../components/ProfileForm';
import imageUrlBuilder from '@sanity/image-url';
import styles from './MyProfile.module.scss';

const MyProfile = () => {
  const thisUser = useContext(UserContext);

  return thisUser ? (
    <div className={styles.myProfile}>
      <ProfileForm thisUser={thisUser} />
    </div>
  ) : (
    <div className={styles.myProfile}>
      <Spinner animation="grow" variant="dark" />
    </div>
  );
};

export default MyProfile;
