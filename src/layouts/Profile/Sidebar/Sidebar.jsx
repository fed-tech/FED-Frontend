import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { TbUserEdit } from "react-icons/tb";
import { SlCalender } from "react-icons/sl";
import { SiReacthookform } from "react-icons/si";
import AuthContext from "../../../context/AuthContext";
import styles from "./styles/Sidebar.module.scss";

import defaultImg from "../../../assets/images/defaultImg.jpg";
import camera from "../../../assets/images/camera.svg";
import { EditImage } from "../../../features";

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
    navigate("/Login");
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
        onClick={() => handleChange("Event")}
        style={{
          background: activepage === "Event" ? "var(--primary)" : "transparent",
          WebkitBackgroundClip: activepage === "Event" ? "text" : "initial",
          backgroundClip: activepage === "Event" ? "text" : "initial",
          color: activepage === "Event" ? "transparent" : "inherit",
        }}
      >
        <SlCalender
          size={17}
          style={{
            color: activepage === "Event" ? "#FF8A00" : "white",
            marginRight: "10px",
          }}
        />{" "}
        Event
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
        Form
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
        Members
      </div>
    </>
  );

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.profile}>
          <div
            style={{ width: "auto", position: "relative", cursor: "pointer" }}
            onClick={() => handleChange("Profile")}
          >
            <img
              src={imagePrv || authCtx.user.pic || defaultImg}
              alt="Profile"
              className={styles.profilePhoto}
            />
            {selectedFile && (
              <EditImage
                selectedFile={selectedFile}
                closeModal={closeModal}
                setimage={setImage}
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
            <p className={styles.name}>{handleName()}</p>
            <p className={styles.role}>{designation}</p>
          </div>
        </div>
        <div className={styles.menu}>
          {designation === "Admin" && renderAdminMenu()}
          {designation !== "Admin" && (
            <div
              onClick={() => handleChange("Event")}
              style={{ color: activepage === "Event" ? "#FF8A00" : "white" }}
            >
              <SlCalender size={17} style={{ marginRight: "10px" }} /> Event
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
