import React from 'react';
import MainPage from './MainPage';
import PetsPage from './PetsPage';
import WildlifePage from './WildlifePage';
import QuickButtons from '../../components/shared/QuickButtons';
import { Tab, Tabs } from 'react-bootstrap';
import styles from './Album.module.scss';

export default function Album() {
  return (
    <div className={styles.album}>
      <QuickButtons />
      <Tabs defaultActiveKey="misc">
        <Tab id="miscTab" eventKey="misc" title="Main">
          <MainPage />
        </Tab>
        <Tab id="wildlifeTab" eventKey="wildlife" title="Wildlife">
          <WildlifePage />
        </Tab>
        <Tab id="petTab" eventKey="pets" title="Pet Resgistry">
          <PetsPage />
        </Tab>
      </Tabs>
    </div>
  );
}
