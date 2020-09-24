import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import $ from 'jquery';
import Navbar from './components/shared/Navbar';
import Authentication from './pages/Authentication';
import Loading from './components/shared/Loading';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Directory from './pages/Directory';
import Profile from './components/Profile';
import MyProfile from './pages/MyProfile';
import styles from './App.module.scss';

export const UserContext = React.createContext();

const App = () => {
  const thisUser = useAuth();
  const [showLogin, setShowLogin] = React.useState(false);

  if (thisUser) {
    $('#firebaseui-auth-container').hide();
  }

  return (
    <div className={styles.App}>
      <div className={styles.backgroundOverlay}></div>

      <UserContext.Provider value={thisUser}>
        <Router>
          <Navbar loginShow={(trueFalse) => setShowLogin(trueFalse)} />
          <Switch>
            <Route path="/" exact component={Home}></Route>
            <Route path="/calendar" component={Calendar}></Route>
            <Route path="/directory" component={Directory}></Route>
            <Route path="/myProfile" component={MyProfile}></Route>
          </Switch>
        </Router>

        <Loading />
        <Profile />
        <Authentication show={showLogin} thisUser={thisUser} />
      </UserContext.Provider>
    </div>
  );
};

export default App;
