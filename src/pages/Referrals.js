import React, { useState, useEffect } from 'react';
import NewReferral from '../components/NewReferral';
import { referralCategories } from '../data/referralCategories';
import { fetchReferrals } from '../api/sanityClient';
import { Nav, Card, Button } from 'react-bootstrap';
import $ from 'jquery';
import styles from './Referrals.module.scss';

export default function Referrals() {
  const [allReferrals, setAllReferrals] = useState([]);
  const [category, setCategory] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchData = async () => {
    const response = await fetchReferrals();
    console.log(response);
    setAllReferrals([...response]);
  };

  const filterBy = (category) => {
    const result = allReferrals.filter(
      (referral) => referral.category === category
    );
    setCategory([...result]);
    $('#allReferrals').hide();
    $('#filtered').css('display', 'flex');
  };

  const readMore = (el, text) => {
    $(el).text(text);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className={styles.referrals}>
      <h3>Referrals from Your Neighbors</h3>
      <Button variant="success" onClick={handleShow}>
        <i className="far fa-user-plus"></i>
      </Button>
      <NewReferral show={show} handleClose={handleClose} />
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
      <div id="allReferrals" className={styles.cardDiv}>
        {allReferrals.map((r) => {
          const tolerance = 24;
          const original = r.comments;
          const cLength = original.split(' ').length;
          let abbreviated = '';
          if (cLength > tolerance) {
            abbreviated = original.split(' ').slice(0, tolerance).join(' ');
          }
          const elID = r.name.split(' ').join('-');
          return (
            <Card className={styles.card} key={r._id}>
              <Card.Title>{r.name}</Card.Title>
              {r.subcategory.map((s) => (
                <Card.Subtitle key={s}>{s}</Card.Subtitle>
              ))}

              <Card.Text id={elID}>
                {abbreviated ? abbreviated : original}
                <span>
                  <a
                    className={styles.moreBtn}
                    style={{ display: abbreviated ? 'inherit' : 'none' }}
                    onClick={() => readMore(`#${elID}`, original)}
                  >
                    ...more...
                  </a>
                </span>
              </Card.Text>
              <Card.Link
                href={r.link1}
                target="_blank"
                rel="noopener noreferrer"
              >
                {r.link1}
              </Card.Link>
              <Card.Footer className={styles.footer}>
                <span>{r.phone}</span>
                <span>{r.email}</span>
              </Card.Footer>
            </Card>
          );
        })}
      </div>
      <div className={`${styles.filtered} ${styles.cardDiv}`} id="filtered">
        {category.map((r) => {
          return (
            <Card className={styles.card} key={r._id}>
              <Card.Title>{r.name}</Card.Title>
              <Card.Subtitle className={styles.subcategory}>
                <span>{r.phone}</span>
                <span>{r.email}</span>
              </Card.Subtitle>

              <Card.Text>{r.comments}</Card.Text>
              <Card.Link>{r.link1}</Card.Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
