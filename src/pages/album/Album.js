import React, { useState, useEffect } from 'react';
import MainPage from './MainPage';
import WildlifePage from './WildlifePage';
import QuickButtons from '../../components/shared/QuickButtons';
import { miscRef, petsRef, wildlifeRef } from '../../firestore/index';
import { Tab, Tabs } from 'react-bootstrap';
import $ from 'jquery';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import styles from './Album.module.scss';

export default function Album() {
  const [attachedImages, setAttachedImages] = useState([]);
  const [firstPage, setFirstPage] = useState([]);
  const [secondPage, setSecondPage] = useState([]);
  const [thirdPage, setThirdPage] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // const [petPics, setPetPics] = useState([]);
  // const [wildlifePics, setWildlifePics] = useState([]);
  const [progress, setProgress] = useState(0);
  const thisUser = React.useContext(UserContext);
  const me = thisUser.name;
  const history = useHistory();

  return (
    <div className={styles.album}>
      <QuickButtons />
      <Tabs defaultActiveKey="misc">
        <Tab id="miscTab" eventKey="misc" title="Main">
          <MainPage />
        </Tab>
        <Tab id="petTab" eventKey="pets" title="Pets">
          PETS
        </Tab>
        <Tab id="wildlifeTab" eventKey="wildlife" title="Wildlife">
          <WildlifePage />
        </Tab>
      </Tabs>
    </div>
  );
}
