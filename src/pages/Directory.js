import React from 'react';
import { Client } from '../api/sanityClient';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import styles from './Directory.module.scss';

const Directory = () => {
  const [neighborList, setNeighborList] = React.useState([]);
  const [addressMode, setAddressMode] = React.useState(true);
  const getNeighborList = async () => {
    const neighbors = await Client.fetch(
      "*[_type == 'profile'] | order(address)"
    );
    neighbors.sort((a, b) =>
      a.address.substring(a.address.indexOf(' ') + 1) +
        a.address.split(' ')[0] >
      b.address.substring(b.address.indexOf(' ') + 1) + b.address.split(' ')[0]
        ? 1
        : -1
    );
    setNeighborList([...neighbors]);
  };

  const sortByAddress = () => {
    let neighbors = [...neighborList];
    neighbors.sort((a, b) =>
      a.address.substring(a.address.indexOf(' ') + 1) +
        a.address.split(' ')[0] >
      b.address.substring(b.address.indexOf(' ') + 1) + b.address.split(' ')[0]
        ? 1
        : -1
    );
    setNeighborList([...neighbors]);
    setAddressMode(true);
  };

  const sortByName = () => {
    let ourNeighbors = [...neighborList];
    ourNeighbors.sort((a, b) =>
      a.name.split(' ').pop() + a.name.split(' ')[0] >
      b.name.split(' ').pop() + b.name.split(' ')[0]
        ? 1
        : -1
    );
    setNeighborList([...ourNeighbors]);
    setAddressMode(false);
  };

  React.useEffect(() => {
    getNeighborList();
  }, []);

  return (
    <div className={styles.directory}>
      <div className={[`${styles.buttonRow} ${styles.row}`]}>
        <Button onClick={() => sortByAddress()}>Address</Button>
        <Button onClick={() => sortByName()}>Name</Button>
      </div>
      {neighborList.map((n) => {
        return (
          <div key={n._id}>
            <div className={styles.largerScreens}>
              <div className={styles.row}>
                <div>{n.name}</div>
                <div className={styles.address}>{n.address}</div>
                <div>{n.phone}</div>
                <div>
                  <Button href={`mailto:${n.email}`}>Email</Button>
                </div>
              </div>
            </div>
            <div className={styles.smallerScreens}>
              <DropdownButton
                id="dropdown-item-button"
                title={addressMode ? `${n.address}` : `${n.name}`}
                style={{ margin: '0.5rem' }}
              >
                <Dropdown.ItemText>
                  {addressMode ? `${n.name}` : `${n.address}`}
                </Dropdown.ItemText>
                <Dropdown.Item>{n.phone}</Dropdown.Item>
                <Dropdown.Item>{n.email}</Dropdown.Item>
              </DropdownButton>{' '}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Directory;
