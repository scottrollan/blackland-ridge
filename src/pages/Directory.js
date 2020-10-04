import React from 'react';
import { Client } from '../api/sanityClient';
import { Card, Tab, Tabs, Button } from 'react-bootstrap';
import $ from 'jquery';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import imageUrlBuilder from '@sanity/image-url';
import styles from './Directory.module.scss';

const builder = imageUrlBuilder(Client);

const urlFor = (source) => {
  return builder.image(source);
};

const Directory = () => {
  const thisUser = React.useContext(UserContext);
  const me = thisUser.name;
  const history = useHistory();

  const [neighborList, setNeighborList] = React.useState([]);
  const [addressMode, setAddressMode] = React.useState(true);

  let neighbors;
  const getNeighborList = async () => {
    try {
      neighbors = await Client.fetch("*[_type == 'profile'] | order(address)");
      setNeighborList([...neighbors]);
      //sort by street name, then number (so that 4181 Blackland Dr comes before 38 Blackland Way, i.e.)
      neighborList.sort((a, b) =>
        a.address.split(' ')[1] + a.address.split(' ').shift() >
        b.address.split(' ')[1] + b.address.split(' ').shift()
          ? 1
          : -1
      );
    } catch (error) {
      console.log(error);
    } finally {
      setNeighborList([...neighbors]);
      setAddressMode(true);
    }
  };

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

  React.useEffect(() => {
    getNeighborList();
  }, []);

  return (
    <div className={styles.directory}>
      <Tabs defaultActiveKey="address">
        <Tab id="nameTab" eventKey="name" title="Name">
          <div className={styles.cardGrid}>
            {neighborList.map((n) => {
              return (
                <Card
                  key={n._id}
                  className={styles.card}
                  style={{ display: n.includeInDirectory ? 'inherit' : 'none' }}
                >
                  <Card.Header
                    style={{ display: addressMode ? 'inherit' : 'none' }}
                  >
                    {n.address}
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
                        href={urlFor(n.image)}
                        target="_blank"
                        rel="noopenner noreferrer"
                      >
                        <img
                          src={urlFor(n.image)}
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
        <Tab id="addressTab" eventKey="address" title="Address">
          <div className={styles.cardGrid}>
            {neighborList.map((n) => {
              return (
                <Card
                  key={n._id}
                  className={styles.card}
                  style={{ display: n.includeInDirectory ? 'inherit' : 'none' }}
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
                        href={urlFor(n.image)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={urlFor(n.image)}
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
  );
};

export default Directory;
