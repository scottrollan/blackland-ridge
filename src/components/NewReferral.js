import React, { useState, useContext } from 'react';
import Loading from '../components/shared/Loading';
import { UserContext } from '../App';
import { referralsCollection } from '../firestore/index';
import { referralCategories } from '../data/referralCategories';
import { createRandomString } from '../functions/CreateRandomString';
import { Modal, Button, Form } from 'react-bootstrap';
import $ from 'jquery';
import styles from './NewReferral.module.scss';

export default function NewReferral({ show, handleClose }) {
  const thisUser = useContext(UserContext);
  const me = thisUser.name;
  const [subcategories, setSubcategories] = useState([]); //to populate choices
  const [name, setName] = useState('');
  const [comments, setComments] = useState('');
  const [category, setCategory] = useState('select');
  const [subcategory, setSubcategory] = useState([]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [image, setImage] = useState('');

  const selectCategory = (cat) => {
    const subC = referralCategories.find((el) => el.category === cat);
    setSubcategories([...subC.subcategories]);
  };

  const handleMultiselect = (options) => {
    const theseSubs = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        theseSubs.push(options[i].value);
      }
    }
    console.log(theseSubs);
    setSubcategory([...theseSubs]);
  };

  const clearAllFields = () => {
    setName('');
    setComments('');
    setCategory('select');
    setSubcategories([]);
    setSubcategory([]);
    setPhone('');
    setEmail('');
    setAddress('');
    setWebsite('');
    setImage('');
  };

  const checkInputs = (e) => {
    e.preventDefault();
    switch (true) {
      case category === 'select':
        alert('Please select a category.');
        break;
      case phone === '' && email === '' && website === '':
        alert(
          'Please enter a phone number, email address or website for this business/person.'
        );
        break;
      default:
        handleClose(); //close modal
        clearAllFields(); // set "state" back to blank fields
        saveReferral();
        break;
    }
  };
  const saveReferral = async () => {
    $('#loading').css({ display: 'flex', zIndex: '999' }); //loading on

    const rID = createRandomString(20);
    const newReferral = {
      address,
      category,
      comments,
      email,
      image,
      name,
      phone,
      link1: website,
      rating: [
        {
          ratedBy: thisUser.name,
          ref: thisUser.ref,
          stars: 5,
        },
      ],
      referrer: me,
      subcategory,
    };
    try {
      referralsCollection.doc(rID).set(newReferral);
    } catch (error) {
      console.log(error);
    } finally {
      $('#loading').css('display', 'none');
    }
  };

  const phoneMask = () => {
    let num = $('#phone').val().replace(/\D/g, '');
    $('#phone').val(
      '(' +
        num.substring(0, 3) +
        ')' +
        num.substring(3, 6) +
        '-' +
        num.substring(6, 10)
    );
  };
  $('[type="tel"]').keyup(phoneMask);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      className={styles.Modal}
      id="newReferralModal"
    >
      <Loading />
      <Modal.Header
        // closeButton
        style={{
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Modal.Title style={{ color: 'green' }}>
          Refer a New Person or Business
        </Modal.Title>
        <p style={{ fontStyle: 'italic' }}>
          Please fill in as much information as possible
        </p>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => checkInputs(e)} id="newReferral">
          <Form.Group controlId="name">
            <Form.Label>Business or Person's Name (* required)</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="comments">
            <Form.Label>
              In 500 characters or fewer, tell us why you would recommend{' '}
              <span style={{ display: !name ? 'inherit' : 'none' }}>
                this business
              </span>
              <span style={{ display: !name ? 'none' : 'inherit' }}>
                {name}
              </span>
              . (* required)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows="5"
              maxLength="500"
              placeholder=""
              required
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
            <span>{comments.length}/500</span>
          </Form.Group>
          <div className={styles.categoryDiv}>
            <Form.Group controlId="category" className={styles.category}>
              <Form.Label>Select Category (* required)</Form.Label>
              <Form.Control
                as="select"
                value={category}
                required
                onChange={(e) => {
                  setCategory(e.target.value);
                  selectCategory(e.target.value);
                }}
              >
                <option disabled>select</option>
                {referralCategories.map((c) => {
                  return <option key={c.category}>{c.category}</option>;
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="subcategory" className={styles.category}>
              <Form.Label>Subcategory(ies)</Form.Label>
              <Form.Control
                as="select"
                multiple
                onChange={(e) => handleMultiselect(e.target.options)}
              >
                {subcategories.map((s) => {
                  return (
                    <option
                      key={s}
                      // onClick={() => selectSubs()}
                    >
                      {s}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
          </div>

          <Form.Group controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              placeholder="(770)555-1234"
              value={phone}
              onInput={phoneMask}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>email</Form.Label>
            <Form.Control
              type="email"
              placeholder="me@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="address">
            <Form.Label>Website</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://example.com"
              value={website}
              onClick={() => setWebsite('https://')}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </Form.Group>
          {/* <Form.Group>
            <Form.File
              id="image"
              label="Upload An Image"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group> */}
          <Button variant="success" type="submit">
            Save
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
