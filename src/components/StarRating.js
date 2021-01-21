import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import { referralsCollection, fsArrayUnion } from '../firestore/index';
import $ from 'jquery';
import styles from './StarRating.module.scss';

const uniqBy = require('lodash.uniqby');

export default function StarRating({ ratingArray, docID }) {
  const [starRating, setStarRating] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const thisUser = useContext(UserContext);
  const me = thisUser.name;
  const myRef = thisUser.ref;

  const recordMyRating = (stars) => {
    console.log(`Old rating array ${ratingArray}`);
    const myRatingObj = {
      ratedBy: me,
      ref: myRef,
      stars: stars,
    };

    let newRatingArray = [...ratingArray];
    newRatingArray.splice(0, 0, myRatingObj);
    newRatingArray = uniqBy(newRatingArray, 'ref.id');
    console.log(newRatingArray);

    try {
      referralsCollection.doc(docID).update({
        rating: [...newRatingArray],
      });
    } catch (error) {
      console.log(error);
    }

    let newTotalStars = 0;
    newRatingArray.forEach((r) => {
      newTotalStars += r.stars;
    });
    setStarRating(newTotalStars / newRatingArray.length);
    setMyRating(stars);
  };

  useEffect(() => {
    let raterList = [];
    let stars = 0;
    let arrayLength = ratingArray.length;
    const getRating = async () => {
      await ratingArray.forEach((r, index) => {
        raterList.push(r.ratedBy);
        stars += r.stars;
        if (r.ratedBy === me) {
          const thisRating = r.stars;
          setMyRating(thisRating);
          $(`#star${thisRating}`).prop('checked', true);
        }
      });
      const avgRating = stars / arrayLength;
      if (isNaN(avgRating)) {
        setStarRating(0);
      } else {
        setStarRating(avgRating);
      }
    };
    getRating();
  }, [ratingArray]);

  return (
    <div className="container">
      <div className={styles.rating}>
        <div>Average Rating: {starRating.toFixed(2)}/5</div>
        <div style={{ fontSize: 'small' }}>{ratingArray.length} ratings</div>
        <div>
          {[1, 2, 3, 4, 5].map((s) => (
            <i
              className={[
                `fas fa-star ${styles.glyphiconStar} ${styles.partial}`,
              ]}
              style={{
                '--percent-full': `${
                  starRating >= s //if s=2, greater than/= 2?,
                    ? 100 //then the 2 star is 100%
                    : starRating <= s - 1 //otherwise, less than 1 (2-1)?
                    ? 0 //then 2 start is 0%
                    : (starRating - (s - 1)) * 100
                }%`,
              }}
            ></i>
          ))}
        </div>
      </div>
      <div className={styles.rating}>
        <div>My Rating:</div>

        <div className={styles.starRow}>
          {[5, 4, 3, 2, 1].map((s) => {
            return (
              <i
                key={s}
                className={[
                  `fas fa-star ${styles.glyphiconStar} ${styles.partial} ${styles.myRating}`,
                ]}
                id={`mStar${s}`}
                title="&#xf118;"
                style={{
                  fontFamily: 'Arial, FontAwesome',
                  '--percent-full': `${myRating >= s ? 100 : 0}%`,
                }}
                onClick={() => recordMyRating(s)}
              ></i>
            );
          })}
        </div>
      </div>
    </div>
  );
}
