import React, { useState, useEffect } from 'react';
import styles from './EventPopup.module.scss';

const EventPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the popup after a slight delay to trigger the animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Delay in milliseconds

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsVisible(false);
  };

  return (
    <div className={`${styles.popup} ${isVisible ? styles.fadeIn : ''}`}>
      <div className={styles.popupContent}>
        <button className={styles.closeButton} onClick={closePopup}>×</button>
        <p>This is a popup message.</p>
      </div>
    </div>
  );
};

export default EventPopup;
