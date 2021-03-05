import React, { useContext } from 'react';
import { UserContext } from '../../App';
import { LoginContext } from '../../App';
import { Link } from 'react-router-dom';
import Zillow from '../../assets/zillow.png';
import styles from './NavBar.module.scss';

export default function NavDropdownItems({ collapseNavbar }) {
  const thisUser = useContext(UserContext);
  const setLoginPopup = useContext(LoginContext);
  return (
    <div>
      <Link
        to="/"
        className="dropdown-item"
        onClick={() => collapseNavbar()}
        style={{ display: thisUser ? 'inherit' : 'none' }}
      >
        Message Board
      </Link>
      <Link
        to="/directory"
        className="dropdown-item"
        onClick={() => collapseNavbar()}
        style={{ display: thisUser ? 'inherit' : 'none' }}
      >
        Neighbor Directory
      </Link>
      <Link
        to="/album"
        className="dropdown-item"
        onClick={() => collapseNavbar()}
        style={{ display: thisUser ? 'inherit' : 'none' }}
      >
        Photo Albums
      </Link>
      <a
        href="https://www.zillow.com/homes/for_sale/?searchQueryState=%7B%22usersSearchTerm%22%3A%2230067%22%2C%22mapBounds%22%3A%7B%22west%22%3A-84.43712215325927%2C%22east%22%3A-84.42454795739745%2C%22south%22%3A33.94546877093187%2C%22north%22%3A33.95742995262041%7D%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22ah%22%3A%7B%22value%22%3Atrue%7D%7D%2C%22isListVisible%22%3Atrue%2C%22mapZoom%22%3A16%2C%22customRegionId%22%3A%2275aa25f873X1-CReejk073xunpa_wtbvq%22%7D"
        target="_blank"
        rel="noopener noreferrer"
        className="dropdown-item"
        onClick={() => collapseNavbar()}
      >
        Homes by <img src={Zillow} alt="Zillow" className={styles.zillow} />
      </a>
      <Link
        to="/payDues"
        className="dropdown-item"
        onClick={() => collapseNavbar()}
        style={{ display: thisUser ? 'inherit' : 'none' }}
      >
        Pay Your Dues
      </Link>
      {/* <NavDropdown.Divider /> */}
      <Link
        to="/referrals"
        className="dropdown-item"
        onClick={() => collapseNavbar()}
      >
        Business Referrals
      </Link>
      <div
        className="dropdown-item"
        style={{ display: thisUser ? 'none' : 'inherit' }}
        onClick={() => setLoginPopup.showLoginPopup()}
      >
        Login For More
      </div>
    </div>
  );
}
