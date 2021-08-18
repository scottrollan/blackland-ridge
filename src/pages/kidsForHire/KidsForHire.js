import React, { useContext, useEffect, useState } from 'react';
import NewKidModal from './NewKidModal.js';
import ErrorMessage from '../../components/ErrorMessage';
import { UserContext } from '../../App';
import { kidsForHireCollection, timeStamp } from '../../firestore/index';
import QuickButtons from '../../components/shared/QuickButtons';
import {
  OverlayTrigger,
  Button,
  Tooltip,
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
    const sortAndFilterKids = (kidsArray) => {
      const today = new Date();
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
        <div className={styles.cardGrid}>
          {kids.map((kid) => {
            const uniqueID = kid.uniqueID;
            const formattedPhone = kid.phone.replace(/\D/g, '');
            return (
              <Card
                className={styles.card}
                key={uniqueID}
                id={`kidCard${kid.kidID}`}
              >
                <Card.Header as="h4">{kid.name}</Card.Header>

                <ListGroup className="list-group-flush">
                  <ListGroupItem>
                    <em>I can do:</em>
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
