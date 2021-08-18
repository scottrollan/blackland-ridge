import React, { useState, useEffect, useContext } from 'react';
import ErrorMessage from '../../components/ErrorMessage.js';
import { UserContext } from '../../App';
import { kidsForHire } from '../../data/kidsForHire';
import { kidsForHireCollection, timeStamp } from '../../firestore/index';
import { Modal, Button, Form } from 'react-bootstrap';
import $ from 'jquery';
import _ from 'lodash';
import styles from './KidsForHire.module.scss';

export default function NewKidModal({ kidModalShow, toggleKidModalShow }) {
  const [popupText, setPopupText] = useState('default nothingness');
  const [errorButtonText, setErrorButtonText] = useState('Go Back');
  const [kidInfo, setKidInfo] = useState({
    name: '',
    birthdate: '',
    contactPerson: 'parent',
    contactBy: 'email',
    email: '',
    phone: '',
    jobs: [],
    date: null,
    notes: '',
  });
  const thisUser = useContext(UserContext);
  const parent = thisUser.name;
  const parentID = thisUser.id;
  const kidJobs = kidsForHire.sort();

  const phoneMask = () => {
    let num = $('#kidPhone').val().replace(/\D/g, '');
    $('#kidPhone').val(
      '(' +
        num.substring(0, 3) +
        ')' +
        num.substring(3, 6) +
        '-' +
        num.substring(6, 10)
    );
  };

  const toggleJob = (job) => {
    const currentJobs = [...kidInfo.jobs].sort();
    let newJobList = [];
    if (currentJobs.includes(job)) {
      //remove job if exists in jobs
      newJobList = _.remove(currentJobs, (j) => {
        return j !== job;
      });
    } else {
      //add job
      currentJobs.push(job);
      newJobList = currentJobs.sort();
    }
    setKidInfo({ ...kidInfo, jobs: [...newJobList] });
  };
  ///// Submit New Kid /////
  const submitKidInfo = (event) => {
    console.log('submitKidInfo fired...');
    event.preventDefault();
    const nowDate = new Date();
    const now = timeStamp.fromDate(nowDate);
    const myKidInfo = { ...kidInfo, date: now, parent };
    if (myKidInfo.jobs.length < 1) {
      setPopupText('You have to select at least one job from the list.');
      setErrorButtonText('Go Back');
      $('#NewKidErrorMessage').css('display', 'flex').css('z-index', '999');
      return;
    }
    if (myKidInfo.parentID === '') {
      setKidInfo({ ...kidInfo, parentID: thisUser.id });
    }
    try {
      kidsForHireCollection.add({ ...myKidInfo }).then(() => {
        $('input[name="jobCheck"]').prop('checked', false); //clear checkboxes
        setKidInfo({
          ...kidInfo,
          name: '',
          birthdate: '',
          email: '',
          phone: '',
          jobs: [],
          contactPerson: parent,
          contactBy: 'email',
          parentID: '',
          notes: '',
        });
        setPopupText('Your kid has been added to the database successfully.');
        setErrorButtonText('OK');
        $('#NewKidErrorMessage').css('display', 'flex');
        setTimeout(() => toggleKidModalShow(), 3000);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    $('input[name="jobCheck"]').prop('checked', false);
    setKidInfo({
      ...kidInfo,
      jobs: [],
      contactPerson: thisUser.name,
      parentID: thisUser.id,
    });
  }, [thisUser]);

  return (
    <Modal show={kidModalShow} onHide={toggleKidModalShow} scrollable>
      <ErrorMessage
        errorMessage={popupText}
        tryAgainBtn="inherit"
        tryAgainText={errorButtonText}
        resetBtn="none"
        idFromProps="NewKidErrorMessage"
      />
      <Modal.Header
        closeButton
        style={{ backgroundColor: 'var(--color-pallette-muted-accent)' }}
      >
        <Modal.Title>
          Add my kid to the&nbsp;
          <b>
            <em>Kids-For-Hire</em>
          </b>
          &nbsp; list
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitKidInfo}>
          <div>Kid's Name</div>
          <Form.Control
            type="text"
            placeholder="My Kid's Name"
            value={kidInfo.name}
            onChange={(e) => setKidInfo({ ...kidInfo, name: e.target.value })}
            required
          ></Form.Control>
          <div>
            Kid's Birthday{' '}
            <span style={{ fontSize: 'small' }}>
              <em>optional - birthdate will not appear, only age in years</em>
            </span>
            <Form.Control
              type="date"
              onChange={(e) =>
                setKidInfo({ ...kidInfo, birthdate: e.target.value })
              }
              value={kidInfo.birthdate}
            ></Form.Control>
          </div>
          <div>Contact Information</div>
          <Form.Control
            className={styles.contactWho}
            as="select"
            id="whoToContact"
            variant="secondary"
            title={
              kidInfo.contactPerson === '' ? parent : kidInfo.contactPerson
            }
            value={kidInfo.contactPerson}
            onChange={(e) =>
              setKidInfo({ ...kidInfo, contactPerson: e.target.value })
            }
          >
            <option value="parent">{`Contact ${parent}`}</option>
            <option value="kid">
              {kidInfo.name === ''
                ? 'Contact my kid'
                : `Contact ${kidInfo.name}`}
            </option>{' '}
          </Form.Control>
          <Form.Control
            className={styles.contactHow}
            as="select"
            id="howToContact"
            variant="secondary"
            title={kidInfo.contactBy}
            onChange={(e) =>
              setKidInfo({ ...kidInfo, contactBy: e.target.value })
            }
          >
            <option value="email">by email at</option>
            <option value="text">by text at</option>
            <option value="call">by phone at</option>
          </Form.Control>

          <Form.Control
            className={styles.contactAt}
            id="kidPhone"
            type="tel"
            placeholder="(770)555-1234"
            value={kidInfo.phone}
            onInput={phoneMask}
            onChange={(e) => setKidInfo({ ...kidInfo, phone: e.target.value })}
            style={{
              display: kidInfo.contactBy === 'email' ? 'none' : 'inline',
            }}
            required={kidInfo.contactBy !== 'email'}
          />

          <Form.Control
            className={styles.contactAt}
            id="kidEmail"
            type="email"
            placeholder="me@example.com"
            value={kidInfo.email}
            onChange={(e) => setKidInfo({ ...kidInfo, email: e.target.value })}
            style={{
              display: kidInfo.contactBy === 'email' ? 'inline' : 'none',
            }}
            required={kidInfo.contactBy === 'email'}
          />
          <div
            style={{
              borderTop: '1px solid var(--color-pallette-accent)',
              padding: '1rem 0',
              marginTop: '1rem',
            }}
          >
            {kidInfo.name !== '' ? `${kidInfo.name} ` : 'My kid '}can do:
          </div>
          {kidJobs.map((h) => (
            <Form.Group
              className="mb-3"
              controlId={`check${h}`}
              key={h}
              required
            >
              <Form.Check
                type="checkbox"
                label={h}
                onChange={() => toggleJob(h)}
                name="jobCheck"
              />
            </Form.Group>
          ))}
          <Form.Control
            type="text"
            as="textarea"
            placeholder="Notes"
            value={kidInfo.notes}
            maxLength="144"
            rows={3}
            onChange={(e) => setKidInfo({ ...kidInfo, notes: e.target.value })}
          ></Form.Control>
          <Button type="submit" className={styles.sendKidInfo}>
            Add to Kids For Hire
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
