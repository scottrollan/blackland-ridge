import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import useMessages from './hooks/useMessages';
import $ from 'jquery';
import Navbar from './components/shared/Navbar';
import Authentication from './pages/Authentication';
import Loading from './components/shared/Loading';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Directory from './pages/Directory';
import Profile from './components/Profile';
import MyProfile from './pages/MyProfile';
import Messages from './pages/Messages';
import styles from './App.module.scss';
import fadeStyles from './components/FadeInMessage.module.scss';

export const UserContext = React.createContext();
export const MessagesContext = React.createContext();

const App = () => {
  const thisUser = useAuth();
  let theseMessages = useMessages();
  const [showLogin, setShowLogin] = React.useState(false);

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
        <MessagesContext.Provider value={theseMessages}>
          <Router>
            <Navbar loginShow={(trueFalse) => setShowLogin(trueFalse)} />
            <Switch>
              <Route path="/" exact component={Home}></Route>
              <Route path="/calendar" component={Calendar}></Route>
              <Route path="/directory" component={Directory}></Route>
              <Route path="/myProfile" component={MyProfile}></Route>
              <Route path="/messages" component={Messages}></Route>
            </Switch>
          </Router>

          <Loading />
          <Profile />
          <Authentication show={showLogin} thisUser={thisUser} />
        </MessagesContext.Provider>
      </UserContext.Provider>
    </div>
  );
};

export default App;
