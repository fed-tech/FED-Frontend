/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react';
// import EventCardModal2 from '../features/styles/EventCardModal2.module.scss';
import EventCardModal2 from '../EventModal/styles/EventCardModal2.module.scss';
import { X } from 'lucide-react';

// eslint-disable-next-line react/prop-types
const PastEventModal = ({ onClose, data }) => {
   console.log(data);

  return (
    <div className={EventCardModal2.card}>
      {data && (
        <>
          <div className={EventCardModal2.backimg}>
            <img srcSet={data.imageURL} className={EventCardModal2.img} />
            <div className={EventCardModal2.date}>{data.eventDate}</div>
            <div className={EventCardModal2.paid}>{data.eventType}</div>
          </div>
          <button className={EventCardModal2.closeModal} onClick={onClose}>
            <X />
          </button>
          <div className={EventCardModal2.backbtn}>
            <div className={EventCardModal2.eventname}>
              {data.eventName}
              <p>Team size: 2-4</p>
            </div>
            <div className={EventCardModal2.registerbtn}>
              <button disabled className={EventCardModal2.regbtn}>
                Registration Closed
              </button>
            </div>
          </div>
          <div className={EventCardModal2.backtxt}>{data.eventDescription}</div>
        </>
      )}
    </div>
  );
};

export default PastEventModal;
