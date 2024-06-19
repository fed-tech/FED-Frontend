import { useState, useContext } from "react";
import { motion } from 'framer-motion';
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import style from "./styles/MobileNavbar.module.scss";
import Headroom from "react-headroom";
import { FiMenu } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineLogout } from "react-icons/md";
import defaultImg from '../../assets/images/defaultImg.jpg';
import AuthContext from '../../store/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/Login');
    authCtx.logout();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    if (isOpen) {
      toggleMenu();
    }
  };

  const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <Headroom>
      <nav className={style.nav}>
        <div className={style.mobile}>
          <div className={`${style.logoContainer} ${isOpen ? style.blur : ""}`}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8a723ff2a5558303e924c50f292f82cb2d54f7fbdbc1f67d588b9a73daaf2c16?apiKey=e259011a0b7e4d6e8e6cd8c4440eea14&"
              alt="Logo"
              className={style.logo}
            />
          </div>
          <div className={style.icon} onClick={toggleMenu}>
            {isOpen ? <RxCross2 size={25} /> : <FiMenu size={25} />}
          </div>
        </div>

        {isOpen && (
          <div className={style.listbody}>
            <ul className={`${style.navItems} ${isOpen ? style.open : ""}`}>
              {authCtx.isLoggedIn && (
                <>
                  <NavLink to="/profile" className="LinkStyle">
                    <img
                      src={authCtx.user.pic || defaultImg}
                      alt="Profile"
                      className={style.profileImg}
                    />
                  </NavLink>
                  <div className={style.name}>{authCtx.user.name}</div>
                </>
              )}
              <motion.li
                className={style.navLink}
                initial="hidden"
                animate="visible"
                variants={variants}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link
                  to="/"
                  style={{ color: isActive("/") ? "#FF8A00" : "white" }}
                  onClick={handleLinkClick}
                >
                  Home
                </Link>
              </motion.li>
              <motion.li
                className={style.navLink}
                initial="hidden"
                animate="visible"
                variants={variants}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link
                  to="/Events"
                  style={{ color: isActive("/Events") ? "#FF8A00" : "white" }}
                  onClick={handleLinkClick}
                >
                  Events
                </Link>
              </motion.li>
              <motion.li
                className={style.navLink}
                initial="hidden"
                animate="visible"
                variants={variants}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link
                  to="/Social"
                  style={{ color: isActive("/Social") ? "#FF8A00" : "white" }}
                  onClick={handleLinkClick}
                >
                  Social
                </Link>
              </motion.li>
              <motion.li
                className={style.navLink}
                initial="hidden"
                animate="visible"
                variants={variants}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  to="/Team"
                  style={{ color: isActive("/Team") ? "#FF8A00" : "white" }}
                  onClick={handleLinkClick}
                >
                  Team
                </Link>
              </motion.li>
              {authCtx.isLoggedIn ? (
                <motion.button
                  className={style.mobilesignup}
                  onClick={handleLogout}
                  initial="hidden"
                  animate="visible"
                  variants={variants}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <MdOutlineLogout size={25} /> Logout
                </motion.button>
              ) : (
                <motion.a
                  href="/Login"
                  initial="hidden"
                  animate="visible"
                  variants={variants}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <button className={style.mobilesignup}>
                    Login/Sign up
                  </button>
                </motion.a>
              )}
            </ul>
          </div>
        )}
      </nav>
    </Headroom>
  );
}
