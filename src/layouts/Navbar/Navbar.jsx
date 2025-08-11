import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineLogout } from "react-icons/md";
import AuthContext from "../../context/AuthContext";
import styles from "./styles/Navbar.module.scss";
import logo from "../../assets/images/Logo/logo.svg";
import defaultImg from "../../assets/images/defaultImg.jpg";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [navbarHeight, setNavbarHeight] = useState("90px");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeLink, setActiveLink] = useState("/");
  const lastScrollY = useRef(0);
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
    const isOmegaActive = activeLink === "/omega";

useEffect(() => {
    if (isOmegaActive) {
      document.body.style.backgroundColor = "#000000";
    } else {
      document.body.style.backgroundColor = "";
    }

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [isOmegaActive]);


  // const handleScroll = () => {
  //   if (window.scrollY > lastScrollY.current) {
  //     setIsVisible(false);
  //   } else {
  //     setIsVisible(true);
  //   }

  //   if (isMobile) {
  //     setIsMobile(false);
  //     setNavbarHeight("80px");
  //   }

  //   lastScrollY.current = window.scrollY;
  // };

const SCROLL_THRESHOLD = 5;

const handleScroll = () => {
  const currentScrollY = window.scrollY;

  if (Math.abs(currentScrollY - lastScrollY.current) > SCROLL_THRESHOLD) {
    if (currentScrollY === 0) {
      setIsVisible(true);
    } else if (currentScrollY > lastScrollY.current) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    lastScrollY.current = currentScrollY;
  }
};

useEffect(() => {
  const forceNavbarVisible = () => {
    if (window.scrollY === 0) {
      setIsVisible(true);
    }
  };

  window.addEventListener("scroll", forceNavbarVisible);

  return () => {
    window.removeEventListener("scroll", forceNavbarVisible);
  };
}, []);

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
    let currentPath = location.pathname;
    if (/\/omega|\/omega|\/omega|\/omega/i.test(currentPath)) {
      currentPath = "/omega"; // Normalize omega path
    }
    setActiveLink(currentPath);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobile(!isMobile);
    setNavbarHeight(!isMobile ? "500vw" : "90px");
  };

  const closeMobileMenu = () => {
    setIsMobile(false);
    setNavbarHeight("90px");
  };

  const handleLogout = () => {
    authCtx.logout();
    navigate("/");
    closeMobileMenu();
  };

  useEffect(() => {
    const handleNavbarBlur = () => {
      const navbarElements = document.getElementsByClassName(styles.navbar);
      const blurValue = window.scrollY > 0 ? "blur(20px)" : "none";
      Array.from(navbarElements).forEach(
        (element) => (element.style.backdropFilter = blurValue)
      );
    };

    window.addEventListener("scroll", handleNavbarBlur);
    return () => {
      window.removeEventListener("scroll", handleNavbarBlur);
    };
  }, []);
 

  return (
    <nav
      className={`${styles.navbar} ${
        isVisible ? styles.visible : styles.hidden
      }`}
    >
      <div className={styles.navbarContent} style={{ height: navbarHeight }}>
        <div className={styles.mobNav}>
          <div
            className={`${styles.menuToggle} ${isMobile ? styles.active : ""}`}
            onClick={toggleMobileMenu}
          >
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
          <NavLink to="/">
            <div className={styles.logo_text}></div>
          </NavLink>
        </div>

        <ul
          className={`${styles.navLinks} ${isMobile ? styles.active : ""} ${
            authCtx.isLoggedIn ? styles.loggedIn : ""
          }`}
        >
          {authCtx.isLoggedIn && windowWidth <= 768 && (
            <NavLink
              to="/profile"
              className="LinkStyle"
              onClick={closeMobileMenu}
            >
              <div className={styles.profileImgdiv}>
                <img
                  src={authCtx.user.img || defaultImg}
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
                className={`${styles.link} ${
                  activeLink === "/" ? styles.activeLink : ""
                } ${activeLink === "/omega" ? styles.omegaHover : ""}`}
                onClick={closeMobileMenu}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Events"
                className={`${styles.link} ${
                  activeLink === "/Events" ? styles.activeLink : ""
                } ${activeLink === "/omega" ? styles.omegaHover : ""}`}
                onClick={closeMobileMenu}
              >
                Event
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/omega"
                className={`${styles.linkomega} ${
                  activeLink === "/omega" ? styles.activeLink : ""
                } ${activeLink === "/omega" ? styles.omegaHover : ""}`}
                onClick={closeMobileMenu}
              >
                Omega
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Social"
                className={`${styles.link} ${
                  activeLink === "/Social" ? styles.activeLink : ""
                } ${activeLink === "/omega" ? styles.omegaHover : ""}`}
                onClick={closeMobileMenu}
              >
                Social
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Team"
                className={`${styles.link} ${
                  activeLink === "/Team" ? styles.activeLink : ""
                } ${activeLink === "/omega" ? styles.omegaHover : ""}`}
                onClick={closeMobileMenu}
              >
                Team
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Blog"
                className={`${styles.link} ${
                  activeLink === "/Blog" ? styles.activeLink : ""
                } ${activeLink === "/Gsoc" ? styles.gsocHover : ""}`}
                onClick={closeMobileMenu}
              >
                Blogs
              </NavLink>
            </li>
          </div>

          {authCtx.isLoggedIn ? (
            windowWidth <= 768 ? (
              <button
                className={`${styles.authButton} ${
                  isOmegaActive ? styles.omegaButton : ""
                }`}
                onClick={handleLogout}
              >
                Logout <MdOutlineLogout size={25} />
              </button>
            ) : (
              <NavLink
                to="/profile"
                className="LinkStyle"
                onClick={closeMobileMenu}
              >
                <div className={styles.profileImgdiv}>
                  <img
                    src={authCtx.user.img || defaultImg}
                    alt="Profile"
                    className={styles.profileImg}
                  />
                </div>
              </NavLink>
            )
          ) : (
            <NavLink to="/Login" onClick={closeMobileMenu}>
              <button
                className={`${styles.authButton} ${
                  activeLink === "/omega" ? styles.omegaButton : ""
                }`}
              >
                Login
              </button>
            </NavLink>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;