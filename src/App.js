import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import $ from 'jquery';
import Navbar from './components/shared/Navbar';
import Authentication from './pages/authentication/Authentication';
import Loading from './components/shared/Loading';
import Directory from './pages/directory/Directory';
import PayDues from './pages/payDues/PayDues';
import Referrals from './pages/referrals/Referrals';
import ProfileModal from './components/ProfileModal';
import MyProfile from './pages/myProfile/MyProfile';
import Messages from './pages/messages/Messages';
import Pets from './pages/pets/Pets';
import Album from './pages/album/Album';
import styles from './App.module.scss';
import fadeStyles from './components/FadeInMessage.module.scss';

export const UserContext = createContext();
export const LoginContext = createContext();

const App = () => {
  const thisUser = useAuth();
  console.log(thisUser);
  const [showLogin, setShowLogin] = useState(false);

  const showLoginPopup = () => setShowLogin(true);
  const hideLoginPopup = () => setShowLogin(false);

  const setLoginPopup = { showLoginPopup, hideLoginPopup };

  if (thisUser) {
    $('#firebaseui-auth-container').hide();
  }

  return (
    <div className={styles.App}>
      <div className={styles.backgroundOverlay}></div>
      <div
        className={[
          `${styles.alertThis} ${fadeStyles.fade} ${fadeStyles.fadeOut}`,
        ]}
        id="alertThis"
      ></div>
      <UserContext.Provider value={thisUser}>
        <LoginContext.Provider value={setLoginPopup}>
          <Router>
            <Navbar />
            <Switch>
              <Route path="/" exact component={Messages}></Route>
              <Route path="/directory" component={Directory}></Route>
              <Route path="/myProfile" component={MyProfile}></Route>
              <Route path="/payDues" component={PayDues}></Route>
              <Route path="/referrals" component={Referrals}></Route>
              <Route path="/album" component={Album}></Route>
              <Route path="/pets" component={Pets}></Route>
            </Switch>
          </Router>

          <Loading />
          <ProfileModal />
          <Authentication show={showLogin} thisUser={thisUser} />
        </LoginContext.Provider>
      </UserContext.Provider>
    </div>
  );
};

export default App;
