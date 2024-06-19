import PastEvents from '../../components/Event/EventCards/PastEventCard/PastEventCard';
import style from './styles/pastPage.module.scss';
import eventData from '../../data/eventData.json';



const PastPage = () => {
  const pastEvents = eventData.filter(event => !event.ongoingEvent);
    return(
      <div className={style.main}>
      <div className={style.whole}>
        <div className={style.eventwhole}>

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

        <div className={style.circle}></div>
        <div className={style.circleone}></div>
        <div className={style.circletwo}></div>
        <div className={style.circlethree}></div>
      </div>
    </div>
  );
}

export default PastPage