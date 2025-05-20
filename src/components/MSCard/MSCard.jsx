import React from "react";
import styles from "./style/MSCard.module.scss";

const MSCard = ({ headerCover, logo, title, subtitle, description, link }) => (
  <div className={styles.fedCard}>
    <img className={styles.fedCard__headerCover} src={headerCover} alt="Header Cover" />
    <div className={styles.fedCard__logoWrap}>
      <img src={logo} alt="Logo" />
    </div>
    <div className={styles.fedCard__body}>
      <div className={styles.fedCard__title}>{title}</div>
      <div className={styles.fedCard__subtitle}>{subtitle}</div>
      <div className={styles.fedCard__descWrapper}>
        <div className={styles.fedCard__desc}>{description}</div>
      </div>
      <div className={styles.fedCard__knowMoreBtn}>
        <a href={link} target="_blank" rel="noopener noreferrer">Know More</a>
      </div>
    </div>
  </div>
);

export default MSCard;
