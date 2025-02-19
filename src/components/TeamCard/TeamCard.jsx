import React, { useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import styles from "./styles/TeamCard.module.scss";
import TeamCardSkeleton from "../../layouts/Skeleton/TeamCard/TeamCard";
import { Button } from "../Core";
import AuthContext from "../../context/AuthContext";

// Default Profile Image
import defaultProfile from "C:/FED KIIT/FED-Frontend/src/assets/images/FedLogo.png"; // Add a default image

const TeamCard = ({
  member,
  customStyles = {},
  onUpdate,
  onRemove,
}) => {
  const [showMore, setShowMore] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 500); // Show skeleton for 0.5 seconds

    return () => clearTimeout(timer);
  }, []);

  const authCtx = useContext(AuthContext);

  const isDirectorRole =
    ["PRESIDENT", "VICEPRESIDENT"].includes(member?.access) ||
    member?.access?.startsWith("DIRECTOR_");

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageError = (e) => {
    e.target.src = defaultProfile; // Replace with default image if the provided one fails to load
  };

  const handleLink = (url) => {
    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : "https://" + url;
  };

  return (
    <div className={`${styles.teamMember} ${customStyles.teamMember || ""}`}>
      {showSkeleton && <TeamCardSkeleton customStyles={customStyles} />}
      <div
        className={styles.teamMemberInner}
        style={{ display: showSkeleton ? "none" : "block" }}
      >
        <div
          className={`${styles.teamMemberFront} ${
            customStyles.teamMemberFront || ""
          }`}
        >
          <div className={styles.ImgDiv}>
            <img
              src={member?.img || defaultProfile}
              alt={`Profile of ${member?.name}`}
              className={styles.teamMemberImg}
              onLoad={handleImageLoad}
              onError={handleImageError} // If image fails, replace it
              style={{ display: isImageLoaded ? "block" : "none" }}
            />
          </div>
          <div
            className={`${styles.teamMemberInfo} ${
              customStyles.teamMemberInfo || ""
            }`}
          >
            <h4 style={{ color: "#000" }}>{member?.name}</h4>
          </div>
        </div>
        <div
          className={`${styles.teamMemberBack} ${
            customStyles.teamMemberBack || ""
          }`}
        >
          <button
            onClick={() => setShowMore(!showMore)}
            aria-expanded={showMore}
            className={`${styles.button} ${customStyles.button || ""}`}
          >
            {showMore ? "Back" : "Know More"}
          </button>
        </div>
      </div>
    </div>
  );
};

TeamCard.propTypes = {
  member: PropTypes.shape({
    name: PropTypes.string,
    img: PropTypes.string,
    access: PropTypes.string,
  }).isRequired,
  customStyles: PropTypes.object,
  onUpdate: PropTypes.func,
  onRemove: PropTypes.func,
};

export default TeamCard;
