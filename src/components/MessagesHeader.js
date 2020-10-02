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

let randomStr = ''; //prepare a new element in the original thread's ref array
const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for (let i = 0; i < 12; i++) {
  randomStr += characters.charAt(Math.floor(Math.random() * characters.length));
}

const MessagesHeader = ({ getMessages }) => {
  const thisUser = React.useContext(UserContext);
  const me = thisUser.name;
  const imageAsset = thisUser.image;
  const myPic = urlFor(imageAsset);
  return (
    <div className={styles.messagesHeader}>
      <h4>Post a New Message</h4>
      <Comment
        m={{ _id: randomStr }}
        newThread={true}
        getMessages={getMessages}
        fieldName="Message"
      />
    </div>
  );
};

export default MessagesHeader;
