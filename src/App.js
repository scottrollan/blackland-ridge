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
    missingAddress,
  } = useAuth();

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

      <Loading />
      <UserContext.Provider value={thisUser}>
        <Authentication user={thisUser} />
        <Profile
          // show={isNewUser || missingAddress}
          show={missingAddress}
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
