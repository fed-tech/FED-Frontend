// eslint-disable-next-line no-unused-vars
import React from 'react';

import style from './styles/Event.module.scss';
import eventData from '../../../data/eventData.json';
import PastEvents from '../../../components/Event/EventCards/pastEvents/PastEvents';
import OngoingEvent from '../../../components/Event/EventCards/ongoingEvents/OngoingEvent';
// eslint-disable-next-line no-unused-vars
import PastPage from './pastPage';


const Eventc = () => {

  const ongoingEvents = eventData.filter(event => event.ongoingEvent);
  const pastEvents = eventData.filter(event => !event.ongoingEvent);

  return (
    <div className={style.main}>
      <div className={style.whole}>
        <div className={style.eventwhole}>
          <div className={style.eventcard}>
            <div className={style.name}>
              <p>Ongoing</p>
              <h3>Events</h3>
            </div>
            <div className={style.cardsout}>
              <div className={style.cardsin}>
                {ongoingEvents.map((event, index) => (
                  <div key={index}>
                    <OngoingEvent data={event} />
                  </div>
                ))}
              </div>
            </div> 
          </div>


          <div className={style.pasteventcard}>
            <div className={style.name}>
              <p>Past</p>
              <h3>Events</h3>
            </div>
            <div className={style.outcard}>
              <div className={style.cardone}>
                {pastEvents.map((event, index) => (
                  <div key={index}>
                    <PastEvents data={event} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={style.bottom}>
          <button className={style.seeall}>See all</button>
        </div>

        <div className={style.circle}></div>
        <div className={style.circleone}></div>
        <div className={style.circletwo}></div>
        <div className={style.circlethree}></div>
      </div>
    </div>
  );
};

export default Eventc;
