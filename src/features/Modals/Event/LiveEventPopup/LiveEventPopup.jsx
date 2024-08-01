import { useState, useEffect } from 'react';
import axios from 'axios';
import { Blurhash } from 'react-blurhash';
import styles from './styles/LiveEventPopup.module.scss';
import eventData from '../../../../data/eventData.json';

let popupCount = 0;

const LiveEventPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEventOngoing, setIsEventOngoing] = useState(false);
  const [eventImage, setEventImage] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);


  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // const response = await axios.get('/api/form/getAllForms');
        // const fetchedEvents = response.data;
        const events = eventData;

        const currentEvent = events.find(event => event.ongoingEvent);
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
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
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
            <a href="/Events">
              {!isImageLoaded && (
                <Blurhash
                  hash="L6AcVvDi56n$C,T0IUbF{K-pNG%M"
                  width={600} // here change will be done...adjust as needed
                  height={350} // adjust as needed
                  resolutionX={32}
                  resolutionY={32}
                  punch={1}
                />
              )}
              <img
                src={eventImage}
                alt="Event"
                style={{ display: isImageLoaded ? 'block' : 'none' }}
                onLoad={() => setIsImageLoaded(true)}
              />
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveEventPopup;
