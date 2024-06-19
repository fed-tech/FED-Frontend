import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from "react-router-dom";
import style from "./styles/Navbar.module.scss";
import Headroom from 'react-headroom';
import logo from "../../assets/images/Logo/logo.svg";
import defaultImg from "../../assets/images/defaultImg.jpg"; 
import AuthContext from '../../store/AuthContext';
import { useContext } from 'react';

function Navbar() {
  const [scroll, setScroll] = useState(false);
  const location = useLocation();
  const authCtx = useContext(AuthContext);
  console.log(authCtx);

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

  return (
    <Headroom>
      <nav className={`${style.nav} ${scroll ? style.scrolled : ''}`}>
        <Link to="/">
          <div className={style.logo_div}>
            <img src={logo} alt="Logo" className={style.logo} />
            <div className={style.logo_text}></div>
          </div>
        </Link>

        <ul className={style.navItems}>
          <li className={style.navLink}>
            <NavLink to="/" isActive={() => isActive("/")} activeStyle={{ color: "#FF8A00" }}>Home</NavLink>
          </li>
          <li className={style.navLink}>
            <NavLink to="/Events" isActive={() => isActive("/Events")} activeStyle={{ color: "#FF8A00" }}>Events</NavLink>
          </li>
          <li className={style.navLink}>
            <NavLink to="/Social" isActive={() => isActive("/Social")} activeStyle={{ color: "#FF8A00" }}>Social</NavLink>
          </li>
          <li className={style.navLink}>
            <NavLink to="/Team" isActive={() => isActive("/Team")} activeStyle={{ color: "#FF8A00" }}>Team</NavLink>
          </li>
        </ul>

        {authCtx.isLoggedIn ? (
          <NavLink to="/profile" className="LinkStyle">
            <img
              src={authCtx.user.pic || defaultImg}
              alt="Profile"
              className={style.profileImg}
            />
          </NavLink>
        ) : (
          <a href="/Login">
            <button className={style.authButton}>Login/Sign up</button>
          </a>
        )}

      </nav>
    </Headroom>
  );
}

export default Navbar;
