import React from "react";
import styles from "./style/MSCard.module.scss";

const MSCard = ({ headerCover, logo, title, subtitle, description }) => (
  <div className={styles["fed-card"]}>
    <img className={styles["fed-card__header-cover"]} src={headerCover} alt="Header Cover" />
    <div className={styles["fed-card__logo-wrap"]}>
      <img src={logo} alt="Logo" />
    </div>
    <div className={styles["fed-card__body"]}>
      <div className={styles["fed-card__title"]}>{title}</div>
      <div className={styles["fed-card__subtitle"]}>{subtitle}</div>
      <div className={styles["fed-card__desc"]}>{description}</div>
    </div>
  </div>
);

export default MSCard;
