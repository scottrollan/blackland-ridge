import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Navbar from './components/shared/Navbar';
import Authentication from './pages/Authentication';
import Loading from './components/shared/Loading';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Directory from './pages/Directory';
import Profile from './components/Profile';
import styles from './App.module.scss';

export const UserContext = React.createContext();

const App = () => {
  const [showLogin, setShowLogin] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  const thisUser = useAuth();

  React.useEffect(() => {
    if (
      thisUser &&
      (!thisUser.address ||
        thisUser.address === '' ||
        !thisUser.name ||
        thisUser.name === '')
    ) {
      setShowProfile(true);
      // window.location.reload();
    }
  }, []);

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
          </Switch>
        </Router>

        <Loading />
        <Profile />
        <Authentication show={showLogin} />
      </UserContext.Provider>
    </div>
  );
};

export default App;
