import React, { useState, useContext, useRef, useEffect } from 'react';
import { UserContext } from '../../App';
import ResponseReactions from './ResponseReactions';
import ResponseIcons from './ResponseIcons';
import { createRandomString } from '../../functions/CreateRandomString';
import { Overlay, Tooltip, OverlayTrigger, Popover } from 'react-bootstrap';
import ReactHtmlParser from 'react-html-parser';
import $ from 'jquery';
import styles from './SingleResponse.module.scss';

const SingleResponse = ({ m }) => {
  const thisResponse = { ...m };
  const thisUser = useContext(UserContext);
  const myID = thisUser.id ?? '';
  const [show, setShow] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [authorIsMe, setAuthorIsMe] = useState(false);
  const target = useRef(null);

  const handlePopoverShow = () => {
    setShow(true);
  };
  const handlePopoverHide = () => {
    setShow(false);
  };
  let originalPostDate;
  let rString = createRandomString(11);

  const date = m.createdAt;
  const milliseconds = date.seconds * 1000;
  const rawDate = new Date(milliseconds);
  originalPostDate =
    rawDate.toLocaleString('default', {
      month: 'long',
    }) +
    ' ' +
    rawDate.getDate() +
    ', ' +
    rawDate.getFullYear();
  useEffect(() => {
    const authorRef = m.authorRef ?? '';
    const authID = authorRef.id;
    if (authID === myID) {
      setAuthorIsMe(true);
    }
  }, []);
  return (
    <div style={{ width: '100%' }}>
      <div
        className={authorIsMe ? styles.myQuoteContainer : styles.quoteContainer}
      >
        <div className={styles.avatarDiv}>
          <a
            href={thisResponse.authorImageURL}
            target="_blank"
            rel="noopener noreferrer"
            id={`aTag${rString}`}
          >
            <img
              src={thisResponse.authorImageURL}
              alt=""
              className={styles.avatarImg}
              id={`image${rString}`}
            />
          </a>
        </div>
        <div
          className={authorIsMe ? styles.quoteMe : styles.quote}
          ref={target}
          onClick={() => setShowInfo(!showInfo)}
        >
          <span style={{ fontSize: 'small' }}>
            <em>
              {' '}
              On {originalPostDate} {thisResponse.name} said:
            </em>
          </span>
          {ReactHtmlParser(thisResponse.message)}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',

              width: '100%',
            }}
          >
            <span style={{ width: '33%' }}>
              <ResponseIcons m={thisResponse} />
              {/* thisResponse contains responseToID */}
            </span>

            <OverlayTrigger
              trigger="click"
              placement="auto"
              show={show}
              onToggle={() => handlePopoverShow()}
              overlay={
                <Popover
                  style={{ padding: '0.75rem' }}
                  onClick={() => handlePopoverHide()}
                >
                  <ResponseReactions m={thisResponse} />
                </Popover>
              }
            >
              <span
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '33%',
                  visibility: thisUser && !authorIsMe ? 'visible' : 'hidden',
                }}
                className={styles.likeButton}
              >
                <span>
                  <i className="far fa-thumbs-up" /> Like
                </span>{' '}
              </span>
            </OverlayTrigger>
          </div>
        </div>
      </div>

      <div className={styles.messageImagesDiv}>
        {thisResponse.attachedImages
          ? thisResponse.attachedImages.map((i) => {
              const iKey = createRandomString(9);
              return (
                <img
                  key={iKey}
                  src={i}
                  alt=""
                  className={styles.messageImage}
                />
              );
            })
          : null}
      </div>
    </div>
  );
};

export default SingleResponse;
