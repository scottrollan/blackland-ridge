import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Navbar from './components/shared/Navbar';
import Authentication from './pages/Authentication';
import Loading from './components/shared/Loading';
import Home from './pages/Home';
import NotHome from './pages/NotHome';
import styles from './App.module.scss';

const App = () => {
  const { thisUser, loading, userName } = useAuth();

  return (
    <div className={styles.App}>
      <Router>
        <Navbar userName={userName} />

        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/notHome" component={NotHome}></Route>
        </Switch>
      </Router>
      <Loading loading={loading} />
      <Authentication user={thisUser} />
    </div>
  );
};

export default App;
