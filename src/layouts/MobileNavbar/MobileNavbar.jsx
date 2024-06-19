import { useState } from "react";
import {NavLink, Link, useLocation ,useNavigate} from "react-router-dom";
import style from "./styles/MobileNavbar.module.scss";
import Headroom from "react-headroom";
import { FiMenu } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineLogout } from "react-icons/md";
import defaultImg from '../../assets/images/defaultImg.jpg';
import AuthContext from '../../store/AuthContext';
import { useContext } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();




  const handleLogout = () => {
    console.log(authCtx);
    navigate('/Login');
    authCtx.logout(); 
    console.log(authCtx); 

  
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

  return (
    <Headroom>
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
            {isOpen ? <RxCross2 size={25} /> : <FiMenu size={25} />}
          </div>
        </div>

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
          <li className={style.navLink}>
            <Link
              to="/"
              style={{ color: isActive("/") ? "#FF8A00" : "white" }}
              onClick={handleLinkClick}
            >
              Home
            </Link>
          </li>
          <li className={style.navLink}>
            <Link
              to="/Events"
              style={{ color: isActive("/Events") ? "#FF8A00" : "white" }}
              onClick={handleLinkClick}
            >
              Events
            </Link>
          </li>
          <li className={style.navLink}>
            <Link
              to="/Social"
              style={{ color: isActive("/Social") ? "#FF8A00" : "white" }}
              onClick={handleLinkClick}
            >
              Social
            </Link>
          </li>
          <li className={style.navLink}>
            <Link
              to="/Team"
              style={{ color: isActive("/Team") ? "#FF8A00" : "white" }}
              onClick={handleLinkClick}
            >
              Team
            </Link>
          </li>
        
            {authCtx.isLoggedIn ? (
              <>
                <button className={style.mobilesignup} onClick={handleLogout}>
                <MdOutlineLogout size={25} /> Logout
                </button>
              </>
            ) : (
              <a href="/Login">
              <button className={style.mobilesignup}>
              Login/Sign up
              </button>
              </a>
            )}
        
        </ul>

        {/* {isOpen && <div className={style.blurBackground}></div>} */}
      </nav>
    </Headroom>
  );
}
