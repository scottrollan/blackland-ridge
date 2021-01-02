import React, { useEffect, useContext } from 'react';
import QuickButtons from '../../components/shared/QuickButtons';
import { profilesCollection } from '../../firestore';
import { Card, Tab, Tabs, Button } from 'react-bootstrap';
import $ from 'jquery';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import styles from './Directory.module.scss';

const Directory = () => {
  const thisUser = useContext(UserContext);
  const me = thisUser.name;
  const history = useHistory();

  const [neighborList, setNeighborList] = React.useState([]);
  const [addressMode, setAddressMode] = React.useState(true);

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
    setAddressMode(false);
  };
  $('#addressTab').click(() => sortByAddress());
  $('#nameTab').click(() => sortByName());

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
      <div className={styles.directory}>
        <Tabs defaultActiveKey="address">
          <Tab id="nameTab" eventKey="name" title="Sort by Name">
            <div className={styles.cardGrid}>
              {neighborList.map((n) => {
                return (
                  <Card
                    key={n.photoURL}
                    className={styles.card}
                    style={{
                      display: n.includeInDirectory ? 'inherit' : 'none',
                    }}
                  >
                    <Card.Header
                      style={{ display: addressMode ? 'inherit' : 'none' }}
                    >
                      {n.address}
                      {/* add some logic to place all profiles at same address onto same card??? */}
                    </Card.Header>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <div className={styles.infoDiv}>
                        <Card.Title>{n.name}</Card.Title>

                        <Card.Text
                          style={{ display: addressMode ? 'none' : 'inherit' }}
                        >
                          {n.address}
                        </Card.Text>
                        <Card.Text
                          style={{
                            display: n.phoneInDirectory ? 'inherit' : 'none',
                          }}
                        >
                          {n.phone}
                        </Card.Text>
                        <Card.Text
                          style={{
                            display: n.emailInDirectory ? 'inherit' : 'none',
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
                        >
                          <img
                            src={n.photoURL}
                            alt=""
                            className={styles.photo}
                          />
                        </a>
                        <Button
                          className={styles.editProfile}
                          style={{
                            display: n.name === me ? 'block' : 'none',
                          }}
                          onClick={() => history.push('/myProfile')}
                        >
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Tab>
          <Tab id="addressTab" eventKey="address" title="Sort by Address">
            <div className={styles.cardGrid}>
              {neighborList.map((n) => {
                return (
                  <Card
                    key={n.photoURL}
                    className={styles.card}
                    style={{
                      display: n.includeInDirectory ? 'inherit' : 'none',
                    }}
                  >
                    <Card.Header
                      style={{ display: addressMode ? 'inherit' : 'none' }}
                    >
                      {n.address}
                    </Card.Header>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <div className={styles.infoDiv}>
                        <Card.Title>{n.name}</Card.Title>

                        <Card.Text
                          style={{ display: addressMode ? 'none' : 'inherit' }}
                        >
                          {n.address}
                        </Card.Text>
                        <Card.Text
                          style={{
                            display: n.phoneInDirectory ? 'inherit' : 'none',
                          }}
                        >
                          {n.phone}
                        </Card.Text>
                        <Card.Text
                          style={{
                            display: n.emailInDirectory ? 'inherit' : 'none',
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
                        >
                          <img
                            src={n.photoURL}
                            alt=""
                            className={styles.photo}
                          />
                        </a>

                        <Button
                          className={styles.editProfile}
                          style={{
                            display: n.name === me ? 'block' : 'none',
                          }}
                          onClick={() => history.push('/myProfile')}
                        >
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default Directory;
