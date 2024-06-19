/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import EventCardModal from './styles/OngoingEventCardModal.module.scss';
import { X } from 'lucide-react';

const OngoingEventModal = ({ onClose, data }) => {
 

  return (
    <div className={EventCardModal.modalOverlay}>
      {data && (
        <>
      <div className={EventCardModal.card}>
        <button className={EventCardModal.closeModal} onClick={onClose}><X /></button>
        <div className={EventCardModal.backimg}>
          <img srcSet={data.imageURL} className={EventCardModal.img} alt="Event" />
          <div className={EventCardModal.date}>{data.eventDate}</div>
          <div className={EventCardModal.paid}>{data.eventType}</div>
        </div>
        <div className={EventCardModal.backbtn}>
          <div className={EventCardModal.eventname}>
            {data.eventName}
            <p>Team size: 2-4</p>
          </div>
          <div className={EventCardModal.registerbtn}>
            <button className={EventCardModal.regbtn}>Register Now</button>
          </div>
        </div>
        <div className={EventCardModal.backtxt}>{data.eventDescription}</div>
      </div>
      </>
      )}
    </div>
  );
};

export default OngoingEventModal;
