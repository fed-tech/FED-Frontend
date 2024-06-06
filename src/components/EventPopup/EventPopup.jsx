import React, { useState, useEffect } from 'react';
import styles from './EventPopup.module.scss';
import eventData from '../../data/EventCards.json';

const EventPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEventOngoing, setIsEventOngoing] = useState(false);
  const [eventImage, setEventImage] = useState('');

  useEffect(() => {
    // Fetch data from the JSON file
    const currentEvent = eventData.find(event => event.IsEventOngoing === "true");
    if (currentEvent) {
      setIsEventOngoing(true);
      setEventImage(currentEvent.imageURL);

      // Show the popup after a delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      // Cleanup the timer
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

    // Cleanup the scroll lock class on unmount or when isEventOngoing changes
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

export default EventPopup;
