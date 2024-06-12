// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import EventCard from '../styles/pastEvent.module.scss'; // Adjust the path if necessary
import PastEventModal from '../../../../features/Modals/Event/EventModal/PastEventModal';
 // Ensure this path is correct
import AOS from 'aos';
import 'aos/dist/aos.css';

const PastEvents = ( data ) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <div className={EventCard.card} data-aos="fade-up">
      {data && (
        <>
          <div className={EventCard.backimg}>
            <img srcSet={data.data.imageURL} className={EventCard.img} />
            <div className={EventCard.date}>{data.data.eventDate}</div>
            <div className={EventCard.paid}>{data.data.eventType}</div>
          </div>
          <div className={EventCard.backtxt}>
            {data.data.eventDescription} <span onClick={() => setShowModal(true)}>See More...</span>
          </div>
          {showModal && <PastEventModal onClose={() => setShowModal(false)} data={data.data} />}
        </>
      )}
    </div>
  );
};

export default PastEvents;
