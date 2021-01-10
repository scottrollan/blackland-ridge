import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import { referralsCollection, fsArrayUnion } from '../firestore/index';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import $ from 'jquery';
import styles from './StarRating.module.scss';

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
    const length = newRatingArray.length;
    const oldTotalStars = starRating * length;
    const myOldRating = myRating;
    let myNewRating = stars;

    const myRatingObj = {
      ratedBy: me,
      ref: myRef,
      stars: stars,
    };
    if (iHaveRated) {
      newRatingArray.splice(myIndex, 1);
      newRatingArray = [...newRatingArray, myRatingObj];
      try {
        referralsCollection.doc(docID).update({
          rating: [...newRatingArray],
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        referralsCollection.doc(docID).update({
          rating: fsArrayUnion({ ...myRatingObj }),
        });
      } catch (error) {
        console.log(error);
      }
    }
    setStarRating((oldTotalStars - myOldRating + myNewRating) / length);
    setMyRating(stars);
  };

  useEffect(() => {
    let raterList = [];
    let stars = 0;
    const arrayLength = ratingArray.length;
    const getRating = async () => {
      await ratingArray.forEach((r, index) => {
        raterList.push(r.ratedBy);
        stars += r.stars;
        if (r.ratedBy === me) {
          setIHaveRated(true);
          setMyIndex(index);
          const thisRating = r.stars;
          setMyRating(thisRating);
          $(`#star${thisRating}`).prop('checked', true);
        }
      });
      const avgRating = stars / arrayLength;
      setStarRating(avgRating);
    };
    getRating();
  }, [ratingArray]);

  return (
    <div className="container">
      <div className={styles.rating}>
        <div>Average Rating: {starRating.toFixed(2)}/5</div>
        <div>
          <i
            className={[
              `fas fa-star ${styles.glyphiconStar} ${styles.partial}`,
            ]}
            style={{
              '--percent-full': `${starRating >= 1 ? 100 : starRating * 100}%`,
            }}
          ></i>
          <i
            className={[
              `fas fa-star ${styles.glyphiconStar} ${styles.partial}`,
            ]}
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
            className={[
              `fas fa-star ${styles.glyphiconStar} ${styles.partial}`,
            ]}
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
            className={[
              `fas fa-star ${styles.glyphiconStar} ${styles.partial}`,
            ]}
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
            className={[
              `fas fa-star ${styles.glyphiconStar} ${styles.partial}`,
            ]}
            title={<p>this is inside a p tag</p>}
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
      </div>
      {/* //////////My Rating Playground////////// */}

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

      {/* <div
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
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip>
              <i className="fal fa-grin-stars"></i>
            </Tooltip>
          }
        >
          <label htmlFor="star5"></label>
        </OverlayTrigger>
        <input
          type="radio"
          id="star4"
          name="rating"
          value="4"
          onClick={() => recordMyRating(4)}
        />
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip>
              <i className="fal fa-smile"></i>
            </Tooltip>
          }
        >
          <label htmlFor="star4"></label>
        </OverlayTrigger>
        <input
          type="radio"
          id="star3"
          name="rating"
          value="3"
          onClick={() => recordMyRating(3)}
        />
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip>
              <i className="fal fa-meh"></i>
            </Tooltip>
          }
        >
          <label htmlFor="star3"></label>
        </OverlayTrigger>
        <input
          type="radio"
          id="star2"
          name="rating"
          value="2"
          onClick={() => recordMyRating(2)}
        />
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip>
              <i className="fal fa-frown"></i>
            </Tooltip>
          }
        >
          <label htmlFor="star2"></label>
        </OverlayTrigger>

        <input
          type="radio"
          id="star1"
          name="rating"
          value="1"
          onClick={() => recordMyRating(1)}
        />
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip>
              <i className="fal fa-angry"></i>
            </Tooltip>
          }
        >
          <label htmlFor="star1"></label>
        </OverlayTrigger>
        <span style={{ margin: 'auto' }}>My Rating:</span>
      </div> */}
    </div>
  );
}
