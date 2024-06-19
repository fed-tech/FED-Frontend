import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Link, useLocation } from "react-router-dom";
import style from "./styles/Navbar.module.scss";
import Headroom from 'react-headroom';
import logo from "../../assets/images/Logo/logo.svg";
import defaultImg from "../../assets/images/defaultImg.jpg"; 
import AuthContext from '../../store/AuthContext';

function Navbar() {
  const [scroll, setScroll] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const location = useLocation();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const links = document.querySelectorAll(`.${style.navLink} a`);
    
    const handleMouseOver = (event) => {
      setHoveredLink(event.target);
    };

    const handleMouseOut = () => {
      setHoveredLink(null);
    };

    links.forEach(link => {
      link.addEventListener('mouseover', handleMouseOver);
      link.addEventListener('mouseout', handleMouseOut);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('mouseover', handleMouseOver);
        link.removeEventListener('mouseout', handleMouseOut);
      });
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
            <NavLink 
              to="/" 
              style={{ 
                color: isActive("/") ? "#FF8A00" : hoveredLink && hoveredLink.href.endsWith('/') ? "#FF8A00" : "white"
              }}
            >Home</NavLink>
          </li>
          <li className={style.navLink}>
            <NavLink 
              to="/Events" 
              style={{ 
                color: isActive("/Events") ? "#FF8A00" : hoveredLink && hoveredLink.href.endsWith('/Events') ? "#FF8A00" : "white"
              }}
            >Events</NavLink>
          </li>
          <li className={style.navLink}>
            <NavLink 
              to="/Social" 
              style={{ 
                color: isActive("/Social") ? "#FF8A00" : hoveredLink && hoveredLink.href.endsWith('/Social') ? "#FF8A00" : "white"
              }}
            >Social</NavLink>
          </li>
          <li className={style.navLink}>
            <NavLink 
              to="/Team" 
              style={{ 
                color: isActive("/Team") ? "#FF8A00" : hoveredLink && hoveredLink.href.endsWith('/Team') ? "#FF8A00" : "white"
              }}
            >Team</NavLink>
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
