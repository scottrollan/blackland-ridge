import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Navbar from './components/shared/Navbar';
import Authentication from './pages/Authentication';
import Loading from './components/shared/Loading';
import Home from './pages/Home';
import NotHome from './pages/NotHome';
import styles from './App.module.scss';

export const UserContext = React.createContext();

const App = () => {
  const { thisUser, loading, isLoggedIn } = useAuth();

  return (
    <div className={styles.App}>
      <Router>
        <Navbar
          isLoggedIn={isLoggedIn}
          userName={thisUser ? thisUser.displayName : null}
        />
        <Switch>
          <UserContext.Provider value={thisUser}>
            <Route path="/" exact component={Home}></Route>
            <Route path="/notHome" component={NotHome}></Route>
          </UserContext.Provider>
        </Switch>
      </Router>
      <Loading loading={loading} />
      <Authentication user={(thisUser, isLoggedIn)} />
    </div>
  );
};

export default App;
