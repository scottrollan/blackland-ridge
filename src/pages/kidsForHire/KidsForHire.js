import React, { useContext, useEffect, useState } from 'react';
import NewKidModal from './NewKidModal.js';
import ErrorMessage from '../../components/ErrorMessage';
import { UserContext } from '../../App';
import { kidsForHire } from '../../data/kidsForHire';
import { kidsForHireCollection, timeStamp } from '../../firestore/index';
import QuickButtons from '../../components/shared/QuickButtons';
import {
  OverlayTrigger,
  Button,
  Tooltip,
  Form,
  Card,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import _ from 'lodash';
import $ from 'jquery';
import styles from './KidsForHire.module.scss';

export default function KidsForHire() {
  const [kidModalShow, setKidModalShow] = useState(false);
  const [kids, setKids] = useState([]);
  const [popupNotification, setPopupNotification] = useState('');
  const [filterOn, setFilterOn] = useState('Everything');

  const thisUser = useContext(UserContext);
  const thisUserID = thisUser.id;

  const renderKidTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Add Your Kid
    </Tooltip>
  );

  const toggleKidModalShow = () => {
    setKidModalShow(!kidModalShow);
  };

  const kidFilterOn = (job) => {
    setFilterOn(job);
  };

  const removeKid = (id, name) => {
    kidsForHireCollection
      .doc(id)
      .delete()
      .then(() => {
        setPopupNotification(
          'Your kid has been removed from the database successfully.'
        );
        $('#kidsForHireErrorMessage').css('display', 'flex');
        $(`#kidCard${id}`).css('display', 'none');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
  };

  useEffect(() => {
    let rawKids = [];
    const today = new Date();
    const sortAndFilterKids = (kidsArray) => {
      const lastSixMonths = new Date(today - 15768000000); //today - 6 months
      const sixMonthsAgo = timeStamp.fromDate(lastSixMonths);
      const sortedKids = kidsArray.sort((a, b) => {
        return a.date > b.date ? -1 : 1; //most recent at top
      });
      const filteredKids = sortedKids.filter((date) => date > sixMonthsAgo);
      const uniqueKids = _.uniqBy(filteredKids, 'uniqueID');
      setKids([...uniqueKids]);
    };
    kidsForHireCollection.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        const kidID = change.doc.id;
        const uniqueID = data.parentID.concat(data.name);
        rawKids = [...rawKids, { ...data, uniqueID, kidID }];
      });
      sortAndFilterKids(rawKids);
    });
    const unsubscribe = kidsForHireCollection.onSnapshot(() => {});
    return unsubscribe();
  }, []);
  return (
    <>
      <QuickButtons />
      <NewKidModal
        thisUser={thisUser}
        kidModalShow={kidModalShow}
        setKidModalShow={setKidModalShow}
        toggleKidModalShow={() => toggleKidModalShow()}
      />
      <ErrorMessage
        errorMessage={popupNotification}
        tryAgainBtn="inline"
        tryAgainText="OK"
        resetBtn="none"
        idFromProps="kidsForHireErrorMessage"
      />
      <h3
        className={styles.kidsForHire}
        style={{ display: thisUser ? 'none' : 'initial' }}
      >
        Login to view
      </h3>
      <div
        className={styles.kidsForHire}
        style={{ display: thisUser ? 'initial' : 'none' }}
      >
        <h3>Kids for Hire</h3>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <OverlayTrigger
            placement="auto"
            delay={{ show: 250, hide: 400 }}
            overlay={renderKidTooltip}
            style={{ display: thisUser ? 'initial' : 'none' }}
          >
            <Button
              variant="success"
              onClick={toggleKidModalShow}
              className={styles.addBtn}
              style={{ display: thisUser !== '' ? 'initial' : 'none' }}
              disabled={thisUser !== '' ? false : true}
            >
              <i className="far fa-user-plus"></i>
            </Button>
          </OverlayTrigger>
        </div>
        <h3
          style={{ display: thisUser && kids.length < 1 ? 'initial' : 'none' }}
        >
          No kids signed up yet... come back later.
        </h3>
        <div
          style={{
            display: thisUser && kids.length > 0 ? 'flex' : 'none',
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '0.5rem',
          }}
        >
          <div style={{ fontSize: 'large', whiteSpace: 'nowrap' }}>
            Show me kids who can do:{'  '}
          </div>
          <div>
            <Form.Control
              as="select"
              id="kidFilterDropdown"
              variant="success"
              label="x"
              onChange={(e) => kidFilterOn(e.target.value)}
              style={{ maxWidth: 'auto' }}
            >
              <option>Everything</option>
              {kidsForHire.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </Form.Control>
          </div>
        </div>
        <div className={styles.cardGrid}>
          {kids.map((kid) => {
            const uniqueID = kid.uniqueID;
            const formattedPhone = kid.phone.replace(/\D/g, '');
            const age =
              new Date(new Date() - new Date(kid.birthdate)).getFullYear() -
              1970;
            const thisKidJobs = kid.jobs.join(' ');
            return (
              <Card
                className={[`${styles.card} ${thisKidJobs}`]}
                key={uniqueID}
                id={`kidCard${kid.kidID}`}
                style={{
                  display:
                    kid.jobs.includes(filterOn) || filterOn === 'Everything'
                      ? 'initial'
                      : 'none',
                }}
              >
                <Card.Header as="h4">{kid.name} </Card.Header>

                <ListGroup className="list-group-flush">
                  <ListGroupItem>
                    <em>
                      I <span>am {age} years old and I </span>can do:
                    </em>
                  </ListGroupItem>

                  {kid.jobs.map((job) => {
                    const uniqueJobID = uniqueID.concat(job);

                    return (
                      <ListGroupItem key={uniqueJobID}>
                        &bull;&nbsp;&nbsp;{job}
                      </ListGroupItem>
                    );
                  })}
                </ListGroup>
                <div
                  style={{
                    display:
                      kid.notes === '' || !kid.notes ? 'none' : 'initial',
                    borderBottom: '1px solid lightgray',
                    padding: '0.5rem',
                  }}
                >
                  <em>{kid.notes}</em>
                </div>
                <div style={{ padding: '0.5rem' }}>
                  To inquire about hiring me, {kid.contactBy}{' '}
                  {kid.contactPerson === 'kid' ? 'me' : kid.parent} at{' '}
                  {kid.contactBy === 'email' ? kid.email : kid.phone}.
                </div>
                <Card.Footer className={styles.footer}>
                  <Button
                    className={styles.sendKidInfo}
                    href={
                      kid.contactBy === 'text'
                        ? `sms://+1${formattedPhone}`
                        : kid.contactBy === 'call'
                        ? `tel:+1${formattedPhone}`
                        : `mailto:${kid.email}`
                    }
                  >
                    {kid.contactBy}{' '}
                    {kid.contactPerson === 'kid' ? 'me' : kid.contactPerson}
                  </Button>
                  <Button
                    className={styles.sendKidInfo}
                    onClick={() => removeKid(kid.kidID, kid.name)}
                    style={{
                      display: kid.parentID === thisUserID ? 'initial' : 'none',
                    }}
                  >
                    Remove
                  </Button>
                </Card.Footer>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
