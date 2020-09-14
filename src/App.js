import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Navbar from './components/shared/Navbar';
import Authentication from './pages/Authentication';
import Loading from './components/shared/Loading';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Profile from './components/Profile';
import styles from './App.module.scss';

export const UserContext = React.createContext();

const App = () => {
  const thisUser = useAuth();
  return (
    <div className={styles.App}>
      <div className={styles.backgroundOverlay}></div>

      <UserContext.Provider value={thisUser}>
        <Router>
          <Navbar />
          <Switch>
            <Route path="/" exact component={Home}></Route>
            <Route path="/calendar" component={Calendar}></Route>
          </Switch>
        </Router>

        <Loading />
        <Profile
          show={thisUser.isAnonymous || thisUser.profileComplete ? false : true}
        />
        <Authentication />
      </UserContext.Provider>
    </div>
  );
};

export default App;
