import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import { referralsCollection, fsArrayUnion } from '../firestore/index';
import styles from './StarRating.module.scss';
import remove from 'lodash.remove';

export default function StarRating({ ratingArray, docID }) {
  const [starRating, setStarRating] = useState(0);
  const [iHaveRated, setIHaveRated] = useState(false);
  const [myIndex, setMyIndex] = useState(null);
  const [myRating, setMyRating] = useState(0);
  const thisUser = useContext(UserContext);
  const me = thisUser.name;
  const myRef = thisUser.ref;

  const recordMyRating = (stars) => {
    let newRatingArray = [...ratingArray];
    const myRatingObj = {
      ratedBy: me,
      ref: myRef,
      stars: stars,
    };
    if (iHaveRated) {
      newRatingArray.splice(myIndex, 1);
      newRatingArray = [...newRatingArray, myRatingObj];
      referralsCollection.doc(docID).update({
        rating: [...newRatingArray],
      });
    } else {
      referralsCollection.doc(docID).update({
        rating: fsArrayUnion({ ...myRatingObj }),
      });
    }
  };

  useEffect(() => {
    let raterList = [];
    let stars = 0;
    const arrayLength = ratingArray.length;
    ratingArray.forEach((r, index) => {
      raterList.push(r.ratedBy);
      stars += r.stars;
      if (r.ratedBy === me) {
        setIHaveRated(true);
        setMyIndex(index);
        setMyRating(r.rating);
      }
    });
    setStarRating(stars / arrayLength);
  }, [ratingArray]);

  return (
    <div className="container">
      <div className={styles.averageRating}>
        <div>Average Rating: {starRating}/5</div>
        <i
          className={[`fas fa-star ${styles.glyphiconStar} ${styles.partial}`]}
          style={{
            '--percent-full': `${starRating > 1 ? 100 : starRating * 100}%`,
          }}
        ></i>
        <i
          className={[`fas fa-star ${styles.glyphiconStar} ${styles.partial}`]}
          style={{
            '--percent-full': `${
              starRating >= 2
                ? 100
                : starRating < 1
                ? 0
                : (starRating % 1) * 100
            }%`,
          }}
        ></i>
        <i
          className={[`fas fa-star ${styles.glyphiconStar} ${styles.partial}`]}
          style={{
            '--percent-full': `${
              starRating >= 3
                ? 100
                : starRating < 2
                ? 0
                : (starRating % 2) * 100
            }%`,
          }}
        ></i>
        <i
          className={[`fas fa-star ${styles.glyphiconStar} ${styles.partial}`]}
          style={{
            '--percent-full': `${
              starRating >= 4
                ? 100
                : starRating < 3
                ? 0
                : (starRating % 3) * 100
            }%`,
          }}
        ></i>
        <i
          className={[`fas fa-star ${styles.glyphiconStar} ${styles.partial}`]}
          style={{
            '--percent-full': `${
              starRating >= 5
                ? 100
                : starRating < 4
                ? 0
                : (starRating % 4) * 100
            }%`,
          }}
        ></i>
      </div>
      <div
        className={[
          `${styles.starrating} risingstar d-flex justify-content-center} flex-row-reverse`,
        ]}
      >
        <input
          type="radio"
          id="star5"
          name="rating"
          value="5"
          onClick={() => recordMyRating(5)}
        />
        <label htmlFor="star5" title="5 star">
          <span className={styles.starNumber} style={{}}>
            5
          </span>
        </label>

        <input
          type="radio"
          id="star4"
          name="rating"
          value="4"
          onClick={() => recordMyRating(4)}
        />
        <label htmlFor="star4" title="4 star">
          <span className={styles.starNumber}>4</span>
        </label>
        <input
          type="radio"
          id="star3"
          name="rating"
          value="3"
          onClick={() => recordMyRating(3)}
        />
        <label htmlFor="star3" title="3 star">
          <span className={styles.starNumber}>3</span>
        </label>
        <input
          type="radio"
          id="star2"
          name="rating"
          value="2"
          onClick={() => recordMyRating(2)}
        />
        <label htmlFor="star2" title="2 star">
          <span className={styles.starNumber}>2</span>
        </label>
        <input
          type="radio"
          id="star1"
          name="rating"
          value="1"
          onClick={() => recordMyRating(1)}
        />
        <label htmlFor="star1" title="1 star">
          <span className={styles.starNumber}>1</span>
        </label>
        <span style={{ margin: 'auto' }}>My Rating:</span>
      </div>
    </div>
  );
}
