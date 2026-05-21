import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiBell, FiChevronDown, FiLogOut, FiMenu, FiUser, FiX } from "react-icons/fi";
import AuthContext from "../../../context/AuthContext";
import styles from "./styles/Topbar.module.scss";
import logo from "../../../assets/images/Logo/logo.svg";
import defaultImg from "../../../assets/images/defaultImg.jpg";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Event", to: "/Events" },
  { label: "Social", to: "/Social" },
  { label: "Team", to: "/Team" },
  { label: "Blogs", to: "/Blog" },
];

const Topbar = ({
  isSidebarOpen = false,
  onToggleSidebar,
  showSidebarToggle = false,
}) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [animatingLink, setAnimatingLink] = useState(null);
  const menuRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const onOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileNavOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    authCtx.logout();
    navigate("/");
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.leftCluster}>
        <button
          type="button"
          className={`${styles.iconButton} ${styles.mobileMenuButton}`}
          aria-label={
            showSidebarToggle
              ? isSidebarOpen
                ? "Close menu"
                : "Open menu"
              : isMobileNavOpen
              ? "Close navigation"
              : "Open navigation"
          }
          onClick={() => {
            if (showSidebarToggle) {
              onToggleSidebar?.();
            } else {
              setMobileNavOpen((prev) => !prev);
            }
          }}
        >
          {showSidebarToggle ? (
            isSidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />
          ) : isMobileNavOpen ? (
            <FiX size={18} />
          ) : (
            <FiMenu size={18} />
          )}
        </button>
        <NavLink to="/" className={styles.brand}>
          <img src={logo} alt="FED logo" className={styles.brandLogo} />
          <span className={styles.brandText}>FED</span>
        </NavLink>
      </div>

      <nav
        ref={navRef}
        className={`${styles.navLinks} ${
          !showSidebarToggle && isMobileNavOpen ? styles.mobileNavOpen : ""
        }`}
      >
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""} ${
                animatingLink === link.to ? styles.linkRoll : ""
              }`
            }
            onClick={() => {
              setAnimatingLink(link.to);
              setMobileNavOpen(false);
              window.setTimeout(() => {
                setAnimatingLink((prev) => (prev === link.to ? null : prev));
              }, 420);
            }}
          >
            <span className={styles.navLabel}>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.actions}>
        {authCtx.isLoggedIn ? (
          <>
            {/* <button type="button" className={styles.iconButton} aria-label="Notifications">
              <FiBell size={18} />
            </button> */}
            <div className={styles.userMenuWrap} ref={menuRef}>
              <button
                type="button"
                className={styles.userMenu}
                aria-label="Profile menu"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <img src={authCtx.user.img || defaultImg} alt="Profile" className={styles.userAvatar} />
                <FiChevronDown size={16} />
              </button>

              {isMenuOpen && (
                <div className={styles.dropdown}>
                  <NavLink to="/profile" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
                    <FiUser size={15} />
                    <span>Profile</span>
                  </NavLink>
                  <button type="button" className={styles.dropdownItem} onClick={handleLogout}>
                    <FiLogOut size={15} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <NavLink to="/Login" className={styles.authButton}>
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Topbar;
