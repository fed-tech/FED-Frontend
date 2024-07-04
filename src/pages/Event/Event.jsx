import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import style from "./styles/Event.module.scss";
// import eventData from "../../data/eventData.json";
import EventCard from"../../components/Event/EventCards/EventCard"
import ring from "../../assets/images/ring.svg";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Padding } from "@mui/icons-material";
import FormData from "../../data/FormData.json"

const Event = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // console.log(FormData);
  const{events}=FormData;

  // const ongoingEvents = eventData.filter((event) => event.ongoingEvent);
  // const pastEvents = eventData.filter((event) => !event.ongoingEvent);

  const ongoingEvents=events.filter((event)=>event.info.ongoingEvent)
  const pastEvents=events.filter((event)=>!event.info.ongoingEvent)
  

  const customStyles = {
    eventname: {
      fontSize: "1.2rem",
    },
    registerbtn: {
      width: "8rem",
      fontSize:".721rem"

    },
    eventnamep: {
      fontSize: "0.7rem",
    },
  };

  return (
    <div className={style.main}>
      <div style={{ display: "flex" }}>
        <div className={style.line}></div>
        <div className={style.eventwhole}>
          {ongoingEvents.length>0 &&
          <div className={style.eventcard}>
            <div className={style.name}>
              <img className={style.ring1} src={ring} alt="ring" />
              <span className={style.w1}>Ongoing</span>
              <span className={style.w2}>Events</span>
            </div>
            <div className={style.cardsin}>
              {ongoingEvents.map((event, index) => (
                <div style={{ height: "auto", width: "22rem" }} key={index}>
                  <EventCard
                    data={event}
                    onOpen={() => console.log("Event opened")}
                    type="ongoing"
                    customStyles={customStyles}
                    modalpath='/Events/'
                  />
                </div>
              ))}
            </div>
          </div>
}

          <div className={style.pasteventcard} style={{marginTop:ongoingEvents.length>0?"6rem":"1rem"}}>
            <div className={style.name}>
              <img className={style.ring2} src={ring} alt="ring" />
              <span className={style.w1}>Past</span>
              <span className={style.w2}>Events</span>
            </div>
            <div className={style.cardone}>
              {pastEvents.map((event, index) => (
                <div style={{ height: "auto", width: "22rem" }} key={index}>
                  <EventCard
                    data={event}
                    type="past"
                    customStyles={customStyles}
                    modalpath='/Events/pastEvents/'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={style.bottom}>
        <Link to="/Events/pastEvents">
          <button className={style.seeall}>
            See all <MdKeyboardArrowRight />
          </button>
        </Link>
      </div>

      <div className={style.circle}></div>
      <div className={style.circleleft}></div>
      <div className={style.circleone}></div>
      <div className={style.circletwo}></div>
      <div className={style.circlethree}></div>
    </div>
  );
};

export default Event;
