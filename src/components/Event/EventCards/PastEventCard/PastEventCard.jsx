import React from 'react';
import EventCard from './styles/PastEventCard.module.scss'; 
import PastEventModal from '../../../../features/Modals/Event/EventModal/PastEventCardModal';

const PastEvents = ({ data, isActive, onOpen, onClose }) => {
  return (
    <>
    <div className={EventCard.card} data-aos="fade-up">
      {data && (
        <>
          <div className={EventCard.backimg} onClick={onOpen}>
            <img srcSet={data.imageURL} className={EventCard.img} alt="Event" />
            <div className={EventCard.date}>{data.eventDate}</div>
            <div className={EventCard.paid}>{data.eventType}</div>
          </div>
          <div className={EventCard.backtxt}>
            {data.eventDescription} <span onClick={onOpen}>See More...</span>
          </div>
         
        </>
      )}
    </div>
    {isActive && <PastEventModal onClose={onClose} data={data} />}
    </>
  );
};

export default PastEvents;
