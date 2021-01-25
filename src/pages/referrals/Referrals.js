import React, { useState, useEffect, useContext } from 'react';
import NewReferral from '../../components/NewReferral';
import QuickButtons from '../../components/shared/QuickButtons';
import StarRating from '../../components/StarRating';
import PostReferralAgreement from '../../components/PostReferralAgreement';
import { referralsCollection } from '../../firestore/index';
import { referralCategories } from '../../data/referralCategories';
import { UserContext } from '../../App';
import { createRandomString } from '../../functions/CreateRandomString';
import { Nav, Card, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import $ from 'jquery';
import styles from './Referrals.module.scss';

export default function Referrals() {
  const [allReferrals, setAllReferrals] = useState([]);
  const [category, setCategory] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [formShow, setFormShow] = useState(false);

  const thisUser = useContext(UserContext);

  const handleModalClose = () => setModalShow(false);
  const handleFormClose = () => setFormShow(false);

  const handleModalShow = () => setModalShow(true);
  const handleFormShow = () => setFormShow(true);

  const filterBy = (category) => {
    const result = allReferrals.filter(
      (referral) => referral.category === category
    );
    setCategory([...result]);
    $('#allReferrals').hide();
    $('#filtered').css('display', 'flex');
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Add A Referral
    </Tooltip>
  );

  useEffect(() => {
    let mounted = true;
    let theseReferrals = [];
    const getReferrals = async () => {
      try {
        await referralsCollection.get().then((snapshot) => {
          snapshot.forEach((doc) => {
            const thisReferral = { ...doc.data(), id: doc.id };
            theseReferrals = [...theseReferrals, thisReferral];
          });
        });
      } catch (error) {
        console.log(error);
      } finally {
        if (mounted) {
          setAllReferrals([...theseReferrals]);
        }
      }
    };
    getReferrals();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <QuickButtons />
      <div className={styles.referrals}>
        <div className={styles.heading}>
          <h3>Referrals from Your Neighbors</h3>
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
          >
            <Button
              variant="success"
              onClick={handleModalShow}
              className={styles.addBtn}
              style={{ display: thisUser !== '' ? 'initial' : 'none' }}
            >
              <i className="far fa-user-plus"></i>
            </Button>
          </OverlayTrigger>
          <PostReferralAgreement
            show={modalShow}
            handleClose={handleModalClose}
            handleFormShow={handleFormShow}
          />
          <NewReferral show={formShow} handleClose={handleFormClose} />
          <Nav justify variant="tabs">
            {referralCategories.map((c) => {
              return (
                <Nav.Item key={c.category}>
                  <Nav.Link
                    className={styles.link}
                    onClick={() => filterBy(c.category)}
                  >
                    {c.category}
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
        </div>
        <div id="allReferrals" className={styles.cardDiv}>
          {allReferrals.map((r) => {
            const tolerance = 24; //number of words you want to show initially
            const original = r.comments; //entire comment
            const cLength = original.split(' ').length; //comment word count
            let abbreviated = original;
            let useAbbreviated = false;
            const originalPoster = r.referrer;
            if (cLength > tolerance) {
              //if word count is over more than tolerance
              useAbbreviated = true;
              abbreviated = original.split(' ').slice(0, tolerance).join(' ');
            }
            const elID = createRandomString(10);
            let htmlAddress;
            if (r.address) {
              htmlAddress = `http://google.com/maps?q=${r.address
                .split(' ')
                .join('+')}`;
            }
            let htmlEmail;
            if (r.email) {
              htmlEmail = `mailto:${r.email}`;
            }
            let htmlPhone;
            if (r.phone) {
              const noHyphen = r.phone.replace('-', '');
              const noOpenParenth = noHyphen.replace('(', '');
              const noCloseParenth = noOpenParenth.replace(')', '');
              htmlPhone = `tel:+${noCloseParenth}`;
            }
            return (
              <Card className={styles.card} key={r.id}>
                <Card.Title>{r.name}</Card.Title>
                {r.subcategory.map((s) => (
                  <Card.Subtitle key={s}>{s}</Card.Subtitle>
                ))}

                <div id={`${elID}short`}>
                  {abbreviated}
                  <span>
                    <Button
                      className={styles.moreBtn}
                      style={{ display: useAbbreviated ? 'inherit' : 'none' }}
                      onClick={() => {
                        $(`#${elID}short`).hide();
                        $(`#${elID}long`).show();
                      }}
                    >
                      ...more...
                    </Button>
                  </span>
                </div>
                <div id={`${elID}long`} style={{ display: 'none' }}>
                  {original}
                </div>
                <div style={{ fontSize: 'small', alignSelf: 'flex-end' }}>
                  - {originalPoster}
                </div>
                <Card.Footer className={styles.footer}>
                  <span>
                    <a href={htmlPhone} className={styles.clickable}>
                      {r.phone}
                    </a>
                  </span>
                  <span>
                    <a href={htmlEmail} className={styles.clickable}>
                      {r.email}
                    </a>
                  </span>
                  <span style={{ display: r.address ? 'block' : 'none' }}>
                    <a
                      href={htmlAddress}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.clickable}
                    >
                      {r.address}
                    </a>
                  </span>
                  <Card.Link
                    href={r.link1}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.clickable}
                    style={{
                      display: r.link1 ? 'block' : 'none',
                    }}
                  >
                    <span className={styles.hyperlink}>
                      visit {r.name}'s website
                    </span>
                  </Card.Link>
                </Card.Footer>
              </Card>
            );
          })}
        </div>
        <div className={`${styles.filtered} ${styles.cardDiv}`} id="filtered">
          {category.map((r) => {
            let htmlAddress;
            if (r.address) {
              htmlAddress = `http://google.com/maps?q=${r.address
                .split(' ')
                .join('+')}`;
            }
            let htmlEmail;
            if (r.email) {
              htmlEmail = `mailto:${r.email}`;
            }
            let htmlPhone;
            if (r.phone) {
              const noHyphen = r.phone.replace('-', '');
              const noOpenParenth = noHyphen.replace('(', '');
              const noCloseParenth = noOpenParenth.replace(')', '');
              htmlPhone = `tel:+${noCloseParenth}`;
            }
            return (
              <Card className={styles.card} key={r.id}>
                <Card.Title>{r.name}</Card.Title>
                {r.subcategory.map((s) => (
                  <Card.Subtitle key={s}>{s}</Card.Subtitle>
                ))}

                <Card.Text>{r.comments}</Card.Text>
                <Card.Link
                  href={r.link1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.clickable}
                >
                  {r.link1}
                </Card.Link>
                <Card.Footer className={styles.footer}>
                  <span>
                    <a href={htmlPhone} className={styles.clickable}>
                      {r.phone}
                    </a>
                  </span>
                  <span>
                    <a href={htmlEmail} className={styles.clickable}>
                      {r.email}
                    </a>
                  </span>
                  <span>
                    <a
                      href={htmlAddress}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.clickable}
                    >
                      {r.address}
                    </a>
                  </span>
                  <StarRating ratingArray={r.rating ?? []} docID={r.id} />
                </Card.Footer>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
