import React, { useState, useEffect } from 'react';
import styles from './styles/LiveEventPopup.module.scss';
import eventData from '../../../../data/EventCards.json';

let popupCount = 0;

const LiveEventPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEventOngoing, setIsEventOngoing] = useState(false);
  const [eventImage, setEventImage] = useState('');

  useEffect(() => {
    const currentEvent = eventData.find(event => event.IsEventOngoing === "true");
    if (currentEvent && popupCount === 0) {
      setIsEventOngoing(true);
      setEventImage(currentEvent.imageURL);

      const timer = setTimeout(() => {
        setIsVisible(true);
        popupCount++;
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setIsEventOngoing(false);
    }
  }, []);

  useEffect(() => {
    if (isEventOngoing) {
      if (isVisible) {
        document.body.classList.add(styles.lockScroll);
      } else {
        document.body.classList.remove(styles.lockScroll);
      }
    }

    return () => {
      document.body.classList.remove(styles.lockScroll);
    };
  }, [isVisible, isEventOngoing]);

  const closePopup = () => {
    setIsVisible(false);
  };

  return (
    <>
      {isEventOngoing && (
        <div className={`${styles.popup} ${isVisible ? styles.fadeIn : ''}`}>
          <div className={styles.popupContent}>
            <button className={styles.closeButton} onClick={closePopup}>×</button>
            <a href="#"><img src={eventImage} alt="Event" /></a>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveEventPopup;
