import React, { useContext, useEffect, useRef, useState } from "react";
import { TbUserEdit } from "react-icons/tb";
import { SlCalender } from "react-icons/sl";
import { SiReacthookform } from "react-icons/si";
import { FaRegNewspaper, FaCertificate } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import AuthContext from "../../../context/AuthContext";
import styles from "./styles/Sidebar.module.scss";

import defaultImg from "../../../assets/images/defaultImg.jpg";
import camera from "../../../assets/images/camera.svg";
import { EditImage } from "../../../features";
import { NavLink } from "react-router-dom";

const Sidebar = ({ activepage, handleChange, isMobileOpen, closeMobileSidebar }) => {
  const [designation, setDesignation] = useState("");
  const authCtx = useContext(AuthContext);
  const [imagePrv, setimagePrv] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const imgRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const access = authCtx.user.access;
    const email = authCtx.user.email; // Assuming email is available in authCtx.user
    
    if (email === "attendance@fedkiit.com") {
      setDesignation("Attendance Only");
    } else if (access === "ADMIN") {
      setDesignation("Admin");
    } else if (access === "ALUMNI") {
      setDesignation("Alumni");
    } else if (access === "USER") {
      setDesignation("User");
    } else {
      setDesignation("Member");
    }
  }, [authCtx.user.access, authCtx.user.email]);

  const handleName = () => {
    const maxLength = 20;
    const name = authCtx.user.name || "";
    return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setOpenModal(true);
  };

  const closeModal = () => {
    setSelectedFile(null);
    setOpenModal(false);
  };

  const setImage = (url) => {
    setimagePrv(url);
  };

  const activeKey = String(activepage || "").toLowerCase();
  const isActive = (...keys) => keys.some((key) => key.toLowerCase() === activeKey);

  const handleMenuSelect = (page) => {
    handleChange(page);
    if (window.innerWidth <= 768) {
      closeMobileSidebar?.();
    }
  };

  const renderMenuItem = ({ label, to, page, Icon, activeKeys = [] }) => {
    const itemActive = isActive(page, ...activeKeys);
    return (
      <div
        className={`${styles.menuItem} ${itemActive ? styles.menuItemActive : ""}`}
        onClick={() => handleMenuSelect(page)}
      >
        <NavLink to={to} className={styles.menuLink}>
          <Icon size={17} className={styles.menuIcon} />
          <span>{label}</span>
        </NavLink>
      </div>
    );
  };

  // Check if user is attendance-only
  const isAttendanceOnly = authCtx.user.email === "attendance@fedkiit.com";

  // Modified: Now shows Attendance instead of Blogs in mobile view
  const renderBlogMenu = () => {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      return renderMenuItem({
        label: "Attendance",
        to: "/profile/attendance",
        page: "Attendance",
        Icon: LuClipboardList,
      });
    }

    return renderMenuItem({
      label: "Blogs",
      to: "/profile/BlogForm",
      page: "Blogs",
      Icon: FaRegNewspaper,
    });
  };

  const renderAdminMenu = () => (
    <>
      {renderMenuItem({
        label: "Event",
        to: "/profile/events",
        page: "Events",
        Icon: SlCalender,
        activeKeys: ["events"],
      })}
      {renderMenuItem({
        label: "Form",
        to: "/profile/Form",
        page: "Form",
        Icon: SiReacthookform,
      })}
      {renderMenuItem({
        label: "Members",
        to: "/profile/members",
        page: "Members",
        Icon: TbUserEdit,
      })}
      {renderMenuItem({
        label: "Attendance",
        to: "/profile/attendance",
        page: "Attendance",
        Icon: LuClipboardList,
      })}
    </>
  );

  // Render attendance-only menu
  const renderAttendanceOnlyMenu = () =>
    renderMenuItem({
      label: "Attendance",
      to: "/profile/attendance",
      page: "Attendance",
      Icon: LuClipboardList,
    });

  const renderCertificateMenu = () =>
    renderMenuItem({
      label: "Certificates",
      to: "/profile/certificates",
      page: "Certificates",
      Icon: FaCertificate,
    });

  const renderProfileDetailsMenu = () =>
    renderMenuItem({
      label: "Profile Details",
      to: "/profile",
      page: "Profile",
      Icon: FiUser,
    });

  return (
    <>
      <aside className={`${styles.sidebar} ${isMobileOpen ? styles.mobileOpen : ""}`}>
        <div className={styles.profile}>
          <div
            style={{ width: "auto", position: "relative", cursor: "pointer" }}
            onClick={() => handleMenuSelect("Profile")}
          >
            <NavLink to={"/profile"}>
              <img
                src={authCtx.user.img || imagePrv || defaultImg}
                alt="Profile"
                className={styles.profilePhoto}
              />
            </NavLink>

            {selectedFile && (
              <EditImage
                selectedFile={selectedFile}
                closeModal={closeModal}
                setimage={setImage}
                updatePfp={true}
                setFile={setSelectedFile}
              />
            )}
            {authCtx.user.access !== "USER" && !isAttendanceOnly && (
              <>
                <button
                  type="button"
                  className={styles.cameraBtn}
                  style={{ position: "absolute", bottom: "5px", right: "5px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    imgRef.current?.click();
                  }}
                >
                  <img src={camera} alt="camera" />
                </button>
                <input
                  style={{
                    display: "none",
                  }}
                  type="file"
                  ref={imgRef}
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>

          <div className={styles.profileInfo}>
            <NavLink to={"/profile"}>
              <p className={styles.name}>{handleName()}</p>
            </NavLink>
            <p className={styles.role}>{designation}</p>
          </div>
        </div>
        
        <div className={styles.menu}>
          {renderProfileDetailsMenu()}
          {isAttendanceOnly ? (
            // Show only Attendance menu for attendance@fedkiit.com
            renderAttendanceOnlyMenu()
          ) : (
            // Original menu logic for other users
            <>
              {designation === "Admin" && renderAdminMenu()}
              {(designation === "Admin" ||
                authCtx.user.access === "SENIOR_EXECUTIVE_CREATIVE") &&
                renderBlogMenu()}
              {designation !== "Admin" && (
                renderMenuItem({
                  label: "Event",
                  to: "/profile/events",
                  page: "events",
                  Icon: SlCalender,
                  activeKeys: ["Events"],
                })
              )}
              {authCtx.user.access !== "USER" && renderCertificateMenu()}
            </>
          )}
          
        </div>
        <div className={styles.divider} />
      </aside>
    </>
  );
};

export default Sidebar;
