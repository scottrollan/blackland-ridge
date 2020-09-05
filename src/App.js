import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Navbar from './components/shared/Navbar';
import Authentication from './pages/Authentication';
// import Loading from './components/shared/Loading';
import Home from './pages/Home';
import NotHome from './pages/NotHome';
import styles from './App.module.scss';
import $ from 'jquery';
import { Button } from 'react-bootstrap';
import * as db from './firestore';

export const UserContext = React.createContext();

const App = () => {
  const { thisUser, isLoggedIn } = useAuth();

  const logMeOut = () => {
    $('#authentication').css('display', 'flex');
    db.signOut();
  };

  return (
    <div className={styles.App}>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} user={thisUser} />
        <Switch>
          <UserContext.Provider value={thisUser}>
            <Route path="/" exact component={Home}></Route>
            <Route path="/notHome" component={NotHome}></Route>
          </UserContext.Provider>
        </Switch>
      </Router>
      <Button
        id="loginBtn"
        className={styles.loginBtn}
        onClick={() => logMeOut()}
      >
        Logout
      </Button>
      {/* <Loading loading={loading} /> */}
      <Authentication user={thisUser} isLoggedIn={isLoggedIn} />
    </div>
  );
};

export default App;
