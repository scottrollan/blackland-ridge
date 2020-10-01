import React from 'react';
import { UserContext } from '../App';
import { Client } from '../api/sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import Comment from './Comment';
import styles from './MessagesHeader.module.scss';

const builder = imageUrlBuilder(Client);

const urlFor = (source) => {
  return builder.image(source);
};

const MessagesHeader = ({ getMessages }) => {
  const thisUser = React.useContext(UserContext);
  const me = thisUser.name;
  const imageAsset = thisUser.image;
  const myPic = urlFor(imageAsset);
  return (
    <div className={styles.messagesHeader}>
      <h4>New Topic</h4>
      <Comment m={null} newThread={true} getMessages={getMessages} />
    </div>
  );
};

export default MessagesHeader;
