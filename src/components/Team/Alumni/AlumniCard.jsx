import React, { useState } from "react";
import styles from "./styles/AlumniCard.module.scss";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const AlumniCard = ({ name, image, social }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className={styles.Alumni}>
      <div className={styles.AlumniInner}>
        <div className={styles.AlumniFront}>
          <img
            src={image}
            alt={`Profile of ${name}`}
            className={styles.AlumniImg}
          />
          <div className={styles.AlumniInfo}>
            <h4 style={{ color: "#000" }}>{name}</h4>
          </div>
        </div>
        <div className={styles.AlumniBack}>
          <div className={styles.socialLinks}>
            {social.linkedin && (
              <a href={social.linkedin} target="_blank" rel="social">
                <FaLinkedin />
              </a>
            )}
            {social.github && (
              <a href={social.github} target="_blank" rel="social">
                <FaGithub />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniCard;
