import style from './styles/pastPage.module.scss';
// import eventData from '../../data/eventData.json';
import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import EventCard from '../../components/Event/EventCards/EventCard';
import FormData from "../../data/FormData.json"



const PastPage = () => {


  useEffect(()=>{
    window.scrollTo(0,0);
  },[]);

  const{events}=FormData;
  const pastEvents=events.filter((event)=>!event.info.ongoingEvent)
    return(
      <div className={style.main}>
          <Link to={'/Events'}>
          <div className={style.ArrowBackIcon}>
            <ArrowBackIcon />
          </div>
        </Link>
      <div className={style.whole}>
        <div className={style.eventwhole}>

          <div className={style.pasteventCard}>
            <div className={style.name}>
            <span className={style.w1}>Past</span>
            <span className={style.w2}>Events</span>
            </div>
            <div className={style.Outcard}>
              <div className={style.cardone}>
                {pastEvents.map((event, index) => (
                  <div style={{height: "auto", width: "22rem"}} key={index}>
                    <EventCard
                    data={event}
                    type="past"
                    // customStyles={customStyles}
                    modalpath='/pastEvents/'
                  />

                  
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={style.circle}></div>
        <div className={style.circleone}></div>
        <div className={style.circletwo}></div>
        <div className={style.circlethree}></div>
      </div>
    </div>
  );
}

export default PastPage