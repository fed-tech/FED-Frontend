import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdOutlineLogout } from "react-icons/md";
import AuthContext from '../../context/AuthContext';
import styles from "./styles/Navbar.module.scss";
import logo from "../../assets/images/Logo/logo.svg";
import defaultImg from "../../assets/images/defaultImg.jpg";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [navbarHeight, setNavbarHeight] = useState("80px");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeLink, setActiveLink] = useState("/");
  const lastScrollY = useRef(0);
  const authCtx = useContext(AuthContext);
  const location = useLocation(); // Hook to get the current location

  const handleScroll = () => {
    if (window.scrollY > lastScrollY.current) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    if (isMobile) {
      setIsMobile(false);
      setNavbarHeight("80px");
    }

    lastScrollY.current = window.scrollY;
  };

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  useEffect(() => {
    setActiveLink(location.pathname); // Update active link based on current location
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobile(!isMobile);
    setNavbarHeight(!isMobile ? "500vw" : "80px");
  };

  const closeMobileMenu = () => {
    setIsMobile(false);
    setNavbarHeight("80px");
  };

  const handleLogout = () => {
    authCtx.logout();
    closeMobileMenu();
  };

  return (
    <nav className={`${styles.navbar} ${isVisible ? styles.visible : styles.hidden}`}>
      <div className={styles.navbarContent} style={{ height: navbarHeight }}>
        <div className={styles.mobNav}>
          <div className={`${styles.menuToggle} ${isMobile ? styles.active : ""}`} onClick={toggleMobileMenu}>
            {isMobile ? (
              <div className={styles.cross}>
                <div className={styles.crossBar}></div>
                <div className={styles.crossBar}></div>
              </div>
            ) : (
              <>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
              </>
            )}
          </div>
          <div className={styles.logo_text}></div>
        </div>

        <ul className={`${styles.navLinks} ${isMobile ? styles.active : ""} ${authCtx.isLoggedIn ? styles.loggedIn : ""}`}>
          {authCtx.isLoggedIn && windowWidth <= 768 && (
            <NavLink to="/profile" className="LinkStyle" onClick={closeMobileMenu}>
              <div className={styles.profileImgdiv}>
                <img
                  src={authCtx.user.pic || defaultImg}
                  alt="Profile"
                  className={styles.profileImg}
                />
              </div>
            </NavLink>
          )}

          <NavLink to="/" className={styles.logoLink} onClick={closeMobileMenu}>
            <div className={styles.logo_div}>
              <img src={logo} alt="Logo" className={styles.logo} />
              <div className={styles.logo_text}></div>
            </div>
          </NavLink>

          <div className={styles.navItems}>
            <li>
              <NavLink
                to="/"
                className={activeLink === "/" ? `${styles.link} ${styles.activeLink}` : styles.link}
                onClick={closeMobileMenu}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Events"
                className={activeLink === "/Events" ? `${styles.link} ${styles.activeLink}` : styles.link}
                onClick={closeMobileMenu}
              >
                Event
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Social"
                className={activeLink === "/Social" ? `${styles.link} ${styles.activeLink}` : styles.link}
                onClick={closeMobileMenu}
              >
                Social
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Team"
                className={activeLink === "/Team" ? `${styles.link} ${styles.activeLink}` : styles.link}
                onClick={closeMobileMenu}
              >
                Team
              </NavLink>
            </li>
          </div>

          {authCtx.isLoggedIn ? (
            windowWidth <= 768 ? (
              <button className={styles.authButton} onClick={handleLogout}>Logout <MdOutlineLogout size={25} /></button>
            ) : (
              <NavLink to="/profile" className="LinkStyle" onClick={closeMobileMenu}>
                <div className={styles.profileImgdiv}>
                  <img
                    src={authCtx.user.pic || defaultImg}
                    alt="Profile"
                    className={styles.profileImg}
                  />
                </div>
              </NavLink>
            )
          ) : (
            <NavLink to="/Login" onClick={closeMobileMenu}>
              <button className={styles.authButton}>Login</button>
            </NavLink>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
