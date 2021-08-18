import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import useProfiles from './hooks/useProfiles';
import useChats from './hooks/useChats';
import $ from 'jquery';
import Navbar from './components/shared/Navbar';
import Authentication from './pages/authentication/Authentication';
import Loading from './components/shared/Loading';
import Directory from './pages/directory/Directory';
import PayDues from './pages/payDues/PayDues';
import KidsForHire from './pages/kidsForHire/KidsForHire';
import Referrals from './pages/referrals/Referrals';
import ProfileModal from './components/ProfileModal';
import MyProfile from './pages/myProfile/MyProfile';
import Messages from './pages/messages/Messages';
import Pets from './pages/pets/Pets';
import Album from './pages/album/Album';
import styles from './App.module.scss';

export const UserContext = createContext();
export const LoginContext = createContext();
export const ProfilesContext = createContext();
export const ChatsContext = createContext();
export const UnreadContext = createContext();

const App = () => {
  const thisUser = useAuth();
  const theseProfiles = useProfiles();
  const fromChats = useChats();
  const theseChats = fromChats[0];
  const unreadAlerts = fromChats[1];
  const [showLogin, setShowLogin] = useState(false);
  const [unread, setUnread] = useState([...unreadAlerts]);

  const showLoginPopup = () => setShowLogin(true);
  const hideLoginPopup = () => setShowLogin(false);

  const setLoginPopup = { showLoginPopup, hideLoginPopup };

  if (thisUser) {
    $('#firebaseui-auth-container').hide();
  }
  React.useEffect(() => {
    setUnread([...unreadAlerts]);
  }, [unreadAlerts]);

  return (
    <div className={styles.App}>
      <div className={styles.backgroundOverlay}></div>
      <div className={styles.alertThis}></div>
      <UserContext.Provider value={thisUser}>
        <LoginContext.Provider value={setLoginPopup}>
          <ProfilesContext.Provider value={theseProfiles}>
            <ChatsContext.Provider value={theseChats}>
              <UnreadContext.Provider value={unread}>
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
                    <Route path="/kidsForHire" component={KidsForHire}></Route>
                  </Switch>
                </Router>

                <Loading />
                <ProfileModal />
                <Authentication
                  show={showLogin}
                  thisUser={thisUser}
                  hide={hideLoginPopup}
                />
              </UnreadContext.Provider>
            </ChatsContext.Provider>
          </ProfilesContext.Provider>
        </LoginContext.Provider>
      </UserContext.Provider>
    </div>
  );
};

export default App;
