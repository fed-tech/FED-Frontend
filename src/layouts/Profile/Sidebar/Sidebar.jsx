import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { TbUserEdit } from "react-icons/tb";
import { SlCalender } from "react-icons/sl";
import { SiC, SiReacthookform } from "react-icons/si";
import { GrCertificate } from 'react-icons/gr';
import AuthContext from "../../../context/AuthContext";
import styles from "./styles/Sidebar.module.scss";

import defaultImg from "../../../assets/images/defaultImg.jpg";
import camera from "../../../assets/images/camera.svg";
import { EditImage } from "../../../features";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Sidebar = ({ activepage, handleChange }) => {
  const [designation, setDesignation] = useState("");
  const authCtx = useContext(AuthContext);
  const [imagePrv, setimagePrv] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const imgRef = useRef(null);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const access = authCtx.user.access;
    if (access === "ADMIN") {
      setDesignation("Admin");
    } else if (access === "ALUMNI") {
      setDesignation("Alumni");
    } else if (access === "USER") {
      setDesignation("User");
    } else {
      setDesignation("Member");
    }
  }, [authCtx.user.access]);

  const handleLogout = () => {
    navigate("/");
    authCtx.logout();
  };

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

  const renderAdminMenu = () => (
    <>
      <div
        onClick={() => handleChange("Events")}
        style={{
          background: activepage === "Events" ? "var(--primary)" : "transparent",
          WebkitBackgroundClip: activepage === "Events" ? "text" : "initial",
          backgroundClip: activepage === "Events" ? "text" : "initial",
          color: activepage === "Events" ? "transparent" : "inherit",
        }}
      >
        <SlCalender
          size={17}
          style={{
            color: activepage === "events" ? "#FF8A00" : "white",
            marginRight: "10px",
          }}
        />{" "}
        <NavLink to="/profile/events">Event</NavLink>
      </div>

      <div
        onClick={() => handleChange("Form")}
        style={{
          background: activepage === "Form" ? "var(--primary)" : "transparent",
          WebkitBackgroundClip: activepage === "Form" ? "text" : "initial",
          backgroundClip: activepage === "Form" ? "text" : "initial",
          color: activepage === "Form" ? "transparent" : "inherit",
        }}
      >
        <SiReacthookform
          size={17}
          style={{
            color: activepage === "Form" ? "#FF8A00" : "white",
            marginRight: "10px",
          }}
        />{" "}
        <Link to={"/profile/Form"}>Form</Link>
      </div>

  {/* certificate link */}
      <div
        onClick={() => handleChange("Certificate")}
        style={{
          background: activepage === "Certificate" ? "var(--primary)" : "transparent",
          WebkitBackgroundClip: activepage === "Certificate" ? "text" : "initial",
          backgroundClip: activepage === "Certificate" ? "text" : "initial",
          color: activepage === "Certificate" ? "transparent" : "inherit",
        }}
      >
        <GrCertificate
          size={17}
          style={{
            color: activepage === "Certificate" ? "#FF8A00" : "white",
            marginRight: "10px",
          }}
        />{" "}
        <Link to={"/profile/certificates"}>Certificate</Link>
      </div>


      <div
        onClick={() => handleChange("Members")}
        style={{
          background:
            activepage === "Members" ? "var(--primary)" : "transparent",
          WebkitBackgroundClip: activepage === "Members" ? "text" : "initial",
          backgroundClip: activepage === "Members" ? "text" : "initial",
          color: activepage === "Members" ? "transparent" : "inherit",
          marginLeft: "-6px",
        }}
      >
        <TbUserEdit
          size={17}
          style={{
            color: activepage === "Members" ? "#FF8A00" : "white",
            marginRight: "10px",
          }}
        />{" "}
        <Link to={"/profile/members"}> Members</Link>
      </div>
    </>
  );

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.profile}>
          {/* <NavLink to={'/profile'}> */}
          <div
            style={{ width: "auto", position: "relative", cursor: "pointer" }}
            onClick={() => handleChange("Profile")}
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
            {authCtx.user.access !== "USER" && (
              <>
                <div
                  style={{ position: "absolute", bottom: "5px", right: "5px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    imgRef.current?.click();
                  }}
                >
                  <img src={camera} alt="camera" />
                </div>
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
          {designation === "Admin" && renderAdminMenu()}
          {designation !== "Admin" && (
  <div
    onClick={() => handleChange("events")}
    style={{ color: activepage === "events" ? "#FF8A00" : "white" }}
  >
    <NavLink to={"/profile/events"}>
      <SlCalender size={17} style={{ marginRight: "10px" }} /> Event
    </NavLink>
  </div>
)}

          <div
            onClick={handleLogout}
            style={{ color: activepage === "Logout" ? "#FF8A00" : "white" }}
          >
            <MdLogout size={17} style={{ marginRight: "9px" }} /> Logout
          </div>
        </div>
        <div className={styles.divider} />
      </div>
    </>
  );
};

export default Sidebar;
