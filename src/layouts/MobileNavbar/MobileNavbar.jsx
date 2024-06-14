
  
import React, { useState } from 'react';
import style from './styles/MobileViewNavbar.module.scss';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { byPrefixAndName } from '@awesome.me/kit-KIT_CODE/icons';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={style.nav}>
      <div className={style.mobile}>
        <div className={style.img}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8a723ff2a5558303e924c50f292f82cb2d54f7fbdbc1f67d588b9a73daaf2c16?apiKey=e259011a0b7e4d6e8e6cd8c4440eea14&"
            alt="Logo"
            className={style.logo}
          />
        </div>
        <div className={style.icon} onClick={toggleMenu}>
          ☰
          {/* <FontAwesomeIcon icon="fa-solid fa-bars" /> */}
        </div>
      </div>

      <ul className={`${style.navItems} ${isOpen ? style.open : ''}`}>
        <div className={style.profile}></div>
        <div className={style.name}>Avinash Pandey</div>
        <li className={style.navLink}>Home</li>
        <li className={style.navLink}>Events</li>
        <li className={style.navLink}>Social</li>
        <li className={style.navLink}>Team</li>
        <button className={style.mobilesignup}>Login/Sign up</button>
      </ul>
      <button className={style.authButton}>Login/Sign up</button>
    </nav>
  );
}