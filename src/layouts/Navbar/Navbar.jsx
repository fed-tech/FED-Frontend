import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import style from "./styles/Navbar.module.scss";
import Headroom from 'react-headroom';
import logo from "../../assets/images/Logo/logo.svg";

function Navbar() {

  const [scroll, setScroll] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return(
  <Headroom>
        <nav className={style.nav}>
          <Link to="/">
            <div className={style.logo_div}>
              <img src={logo} alt="Logo" className={style.logo} />
              <div className={style.logo_text}></div>
            </div>
          </Link>

          <ul className={style.navItems}>
            <li className={style.navLink}>
              <Link to="/" style={{ color: isActive("/") ? "#FF8A00" : "white" }}>Home</Link>
            </li>
            <li className={style.navLink}>
              <Link to="/Events" style={{ color: isActive("/EventCards") ? "#FF8A00" : "white" }}>Events</Link>
            </li>
            <li className={style.navLink}>
              <Link to="/Social" style={{ color: isActive("/Social") ? "#FF8A00" : "white" }}>Social</Link>
            </li>
            <li className={style.navLink}>
              <Link to="/Team" style={{ color: isActive("/Team") ? "#FF8A00" : "white" }}>Team</Link>
            </li>
          </ul>
          <Link to="/register">
            <button className={style.authButton}>Login/Sign up</button>
          </Link>
        </nav>
    </Headroom>
  );
}

export default Navbar;