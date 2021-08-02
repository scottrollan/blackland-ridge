import React, { useContext } from 'react';
import { UserContext } from '../../App';
import ResponseAccordion from '../ResponseAccordion';
import { profilesCollection } from '../../firestore/index';
import { createRandomString } from '../../functions/CreateRandomString';
import $ from 'jquery';
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from 'react-html-parser';
import styles from './SingleMessage.module.scss';

const SingleMessage = ({ m }) => {
  // const [m, setm] = useState({ ...m });
  const thisUser = useContext(UserContext);
  const myID = thisUser.id ?? '';
  const newThread = m.newThread ?? false;

  let authorIsMe = false;
  let originalPostDate;
  let rString = createRandomString(11);
  let photoURL;
  let thisAuthor;
  const authorRef = m.authorRef;
  const authID = authorRef.id;
  if (authID === myID) {
    authorIsMe = true;
  }
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

  // React.useEffect(() => {
  profilesCollection
    .doc(authID)
    .get()
    .then((doc) => {
      switch (doc.exists) {
        case true:
          const profile = { ...doc.data() };
          photoURL = profile.photoURL;
          thisAuthor = profile.displayName;
          $(`#image${rString}`).attr('src', photoURL);
          $(`#aTag${rString}`).attr('href', photoURL);
          $(`#name${rString}`).html(authorIsMe ? 'ME' : thisAuthor);
          break;
        default:
          console.log('Sorry, that user no longer exists');
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
  // }, []);

  return (
    <div style={{ width: '100%' }}>
      <div
        className={styles.messageWordsDiv}
        style={{
          flexDirection: !newThread && authorIsMe ? 'row-reverse' : 'row',
        }}
      >
        <div className={styles.avatarDiv}>
          <a
            href={photoURL}
            target="_blank"
            rel="noopener noreferrer"
            id={`aTag${rString}`}
          >
            <img
              src={photoURL}
              alt=""
              className={styles.avatar}
              id={`image${rString}`}
            />
          </a>
          <div style={{ letterSpacing: '0.2rem' }} id={`name${rString}`}></div>
        </div>
        <div className={styles.paragraphDiv}>
          <h4>{m.title ? m.title : null}</h4>
          <span style={{ fontSize: 'small' }}>{originalPostDate}</span>

          <div
            className={!newThread && authorIsMe ? styles.quoteMe : styles.quote}
          >
            {ReactHtmlParser(m.message)}
          </div>
        </div>
      </div>
      {/*\/  ONLY FOR SCREENS SMALLER THAN BREAKPOINT MEDIUM \/ */}
      <div className={styles.mobileQuote}>{ReactHtmlParser(m.message)}</div>
      <div className={styles.messageImagesDiv}>
        {m.attachedImages
          ? m.attachedImages.map((i) => {
              const iKey = createRandomString(9);
              return (
                <a
                  key={iKey}
                  href={i}
                  alt=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={i} alt="" className={styles.messageImage} />
                </a>
              );
            })
          : null}
      </div>

      <ResponseAccordion fieldName={'Replies'} m={m} />
    </div>
  );
};

export default SingleMessage;
