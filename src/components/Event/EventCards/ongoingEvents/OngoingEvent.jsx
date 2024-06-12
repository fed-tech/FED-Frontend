/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import EventCard from '../styles/ongoingEvent.module.scss';
import OngoingEventModal from '../../../../features/Modals/Event/EventModal/ongoingEventModal';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { IoIosShareAlt } from "react-icons/io";

const OngoingEvent = ({ data }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  if (!data) return null;

  return (
    <div className={EventCard.card} data-aos="fade-up">
      <div className={EventCard.backimg}>
        <img srcSet={data.imageURL} className={EventCard.img} alt="Event" />
        <div className={EventCard.date}>{data.eventDate}</div>
        <div className={EventCard.paid}>{data.eventType}</div>
        <div className={EventCard.share}>Share <IoIosShareAlt /></div>
      </div>
      <div className={EventCard.backbtn}>
        <div className={EventCard.eventname}>
          {data.eventName}
          <p>Team size: 2-4</p>
        </div>
        <div className={EventCard.registerbtn}>
          <button className={EventCard.regbtn}>Register Now</button>
        </div>
      </div>
      <div className={EventCard.backtxt}>
        {data.eventDescription} <span onClick={() => setShowModal(true)}>See More...</span>
        {showModal && <OngoingEventModal onClose={() => setShowModal(false)} data={data} />}
      </div>
    </div>
  );
};

export default OngoingEvent;
