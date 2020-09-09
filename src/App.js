import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Navbar from './components/shared/Navbar';
import Authentication from './pages/Authentication';
import Loading from './components/shared/Loading';
import Home from './pages/Home';
import NotHome from './pages/NotHome';
import Profile from './components/Profile';
import styles from './App.module.scss';
import $ from 'jquery';
import { Button } from 'react-bootstrap';
import * as db from './firestore';

export const UserContext = React.createContext();

const App = () => {
  const {
    thisUser,
    userName,
    userPhoneNumber,
    userEmail,
    userAddress,
    userPhotoURL,
    isNewUser,
  } = useAuth();

  // const finishSignUp = () => {
  //   //add input from modal as user.displayName
  //   setUsernameShow(true);
  // };

  const logMeOut = () => {
    $('#authentication').css('display', 'flex');
    db.signOut();
  };

  return (
    <div className={styles.App}>
      <Router>
        <Navbar user={thisUser} userName={userName} />
        <Switch>
          <UserContext.Provider value={thisUser}>
            <Route path="/" exact component={Home}></Route>
            <Route path="/notHome" component={NotHome}></Route>
          </UserContext.Provider>
        </Switch>
      </Router>
      <Button
        id="logoutBtn"
        className={styles.loginBtn}
        onClick={() => logMeOut()}
      >
        Logout
      </Button>
      <Loading />
      <UserContext.Provider value={thisUser}>
        <Authentication user={thisUser} />
        <Profile
          show={isNewUser}
          userName={userName}
          userPhoneNumber={userPhoneNumber}
          userEmail={userEmail}
          userAddress={userAddress}
          userPhotoURL={userPhotoURL}
        />
      </UserContext.Provider>
    </div>
  );
};

export default App;
