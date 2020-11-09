import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import useMessages from './hooks/useMessages';
import $ from 'jquery';
import Navbar from './components/shared/Navbar';
import Authentication from './pages/Authentication';
import Loading from './components/shared/Loading';
import Welcome from './components/Welcome';
import Calendar from './pages/Calendar';
import Directory from './pages/Directory';
import PayDues from './pages/PayDues';
import Referrals from './pages/Referrals';
import Profile from './components/Profile';
import MyProfile from './pages/MyProfile';
import Messages from './pages/Messages';
import styles from './App.module.scss';
import fadeStyles from './components/FadeInMessage.module.scss';

export const UserContext = createContext();
export const MessagesContext = createContext();
export const LoginContext = createContext();

const App = () => {
  const thisUser = useAuth();
  let theseMessages = useMessages();
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
      <Welcome />
      <UserContext.Provider value={thisUser}>
        <MessagesContext.Provider value={theseMessages}>
          <LoginContext.Provider value={setLoginPopup}>
            <Router>
              <Navbar />
              <Switch>
                {/* <Route path="/" exact component={Home}></Route> */}
                <Route path="/" exact component={Messages}></Route>
                <Route path="/calendar" component={Calendar}></Route>
                <Route path="/directory" component={Directory}></Route>
                <Route path="/myProfile" component={MyProfile}></Route>
                <Route path="/payDues" component={PayDues}></Route>
                <Route path="/referrals" component={Referrals}></Route>
              </Switch>
            </Router>

            <Loading />
            <Profile />
            <Authentication show={showLogin} thisUser={thisUser} />
          </LoginContext.Provider>
        </MessagesContext.Provider>
      </UserContext.Provider>
    </div>
  );
};

export default App;
