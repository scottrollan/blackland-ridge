import React, { useEffect, useContext, useState } from 'react';
import QuickButtons from '../../components/shared/QuickButtons';
import Footer from '../../components/shared/Footer';
import NewMessageForm from '../chat/NewMessageForm';
import { profilesCollection } from '../../firestore';
import { CardDeck, Card, Button, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import $ from 'jquery';
import styles from './Directory.module.scss';

const Directory = () => {
  const thisUser = useContext(UserContext);
  const me = thisUser.name;
  const history = useHistory();

  const [neighborList, setNeighborList] = useState([]);
  const [addressMode, setAddressMode] = useState(true);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [recipient, setRecipient] = useState([]);

  let neighbors = [];

  const sortByAddress = () => {
    neighbors = [...neighborList];
    neighbors.sort((a, b) =>
      a.address.split(' ')[1] + a.address.split(' ').shift() >
      b.address.split(' ')[1] + b.address.split(' ').shift()
        ? 1
        : -1
    );
    setNeighborList([...neighbors]);
    neighbors = [];
    setAddressMode(true);
  };

  const sortByName = () => {
    neighbors = [...neighborList];
    neighbors.sort((a, b) =>
      a.name.split(' ').pop() + a.name.split(' ')[0] > //DoeJane will come before DoeJohn
      b.name.split(' ').pop() + b.name.split(' ')[0]
        ? 1
        : -1
    );
    setNeighborList([...neighbors]);
    neighbors = [];
    setAddressMode(false);
  };

  useEffect(() => {
    let mounted = true;
    let allNeighbors = [];
    const getNeighborList = async () => {
      try {
        await profilesCollection.get().then((snapshot) => {
          snapshot.forEach((doc) => {
            allNeighbors.push(doc.data());
          });
        });
        //sort by street name, then number (so that 4181 Blackland Dr comes before 38 Blackland Way, i.e.)
        allNeighbors.sort((a, b) =>
          a.address.split(' ')[1] + a.address.split(' ').shift() >
          b.address.split(' ')[1] + b.address.split(' ').shift()
            ? 1
            : -1
        );
        setAddressMode(true);
      } catch (error) {
        console.log(error);
      } finally {
        if (mounted) {
          setNeighborList([...allNeighbors]);
          allNeighbors = [];
        }
      }
    };
    getNeighborList();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <QuickButtons />
      <Modal show={showNewMessage} onHide={() => setShowNewMessage(false)}>
        <Modal.Header closeButton id="messageTo">
          <span id="test">old</span>
        </Modal.Header>
        <Modal.Body>
          <NewMessageForm
            theseRecipients={recipient}
            closeNewMessage={() => setShowNewMessage(false)}
          />
        </Modal.Body>
      </Modal>
      <div
        className={styles.directory}
        style={{ display: thisUser ? 'initial' : 'none' }}
      >
        <div className={styles.sortButtonDiv}>
          <Button onClick={() => sortByName()} className={styles.sortButton}>
            Sort by Name
          </Button>
          <Button onClick={() => sortByAddress()} className={styles.sortButton}>
            Sort by Address
          </Button>
        </div>
        <CardDeck className={styles.cardGrid}>
          {neighborList.map((n) => {
            return (
              <span key={`card${n.id}`}>
                <Card
                  className={styles.card}
                  style={{
                    display: n.includeInDirectory ? 'flex' : 'none',
                  }}
                >
                  <Card.Header>{addressMode ? n.address : n.name}</Card.Header>
                  <Card.Body className={styles.cardBody}>
                    <div className={styles.infoDiv}>
                      <Card.Text
                        style={{ fontSize: 'larger', fontWeight: '500' }}
                      >
                        {addressMode ? n.name : n.address}
                      </Card.Text>

                      <Card.Text
                        style={{
                          display: n.phoneInDirectory ? 'block' : 'none',
                        }}
                      >
                        {n.phone}
                      </Card.Text>
                      <Card.Text
                        style={{
                          display: n.emailInDirectory ? 'block' : 'none',
                        }}
                      >
                        {n.email}
                      </Card.Text>
                    </div>
                    <div className={styles.photoDiv}>
                      <a
                        href={n.photoURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.photo}
                        style={{ backgroundImage: `url(${n.photoURL})` }}
                      >
                        <span></span>
                      </a>

                      {/* <Button
                        style={{
                          display: n.name === me ? 'none' : 'block',
                        }}
                        onClick={() => createNewMessage(n)}
                        className={styles.sendMessage}
                      >
                        Message
                      </Button> */}

                      <Button
                        style={{
                          display: n.name === me ? 'block' : 'none',
                        }}
                        onClick={() => history.push('/myProfile')}
                        className={styles.editProfile}
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </span>
            );
          })}
        </CardDeck>
      </div>
      <Footer />
    </>
  );
};

export default Directory;
