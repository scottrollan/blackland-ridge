import React, { useContext } from 'react';
import MainPage from './MainPage';
import WildlifePage from './WildlifePage';
import QuickButtons from '../../components/shared/QuickButtons';
import Footer from '../../components/shared/Footer';
import { UserContext } from '../../App';
import { Tab, Tabs } from 'react-bootstrap';
import styles from './Album.module.scss';

export default function Album() {
  const thisUser = useContext(UserContext);
  return (
    <>
      <QuickButtons />

      <div
        className={styles.album}
        style={{ display: thisUser ? 'initial' : 'none' }}
      >
        <Tabs defaultActiveKey="misc">
          <Tab id="miscTab" eventKey="misc" title="Main">
            <MainPage />
          </Tab>
          <Tab id="wildlifeTab" eventKey="wildlife" title="Wildlife">
            <WildlifePage />
          </Tab>
        </Tabs>
      </div>
      <Footer />
    </>
  );
}
