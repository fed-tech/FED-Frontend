import { useState } from "react";
import styles from "./styles/ViewEvent.module.scss";
import Button from "../../../../Core/Button";

import AddEventForm from "../../Form/EventForm/AddEventForm";
import EventCard from "../../../../../components/Event/EventCards/pastEvents/PastEvents";

function ViewEvent () {

  const [activepage, setactivepage] = useState("View Events");

  return (
    <>
      <div className={styles.container}>

        <div className={styles.buttonContainer}>
          <Button
            onClick={() => {
              setactivepage("View Events");
            }}
            variant={activepage === "View Events" ? "primary" : "secondary"}
          >
            View Events
          </Button>
          <Button
            variant={activepage === "Add Event" ? "primary" : "secondary"}
            onClick={() => {
              setactivepage("Add Event");
            }}
            style={{
              backgroundColor: "#44444455",
              borderColor: "#44444455",
            }}
          >
            Add Event
          </Button>
        </div>

        <form className={styles.form}>

          {activepage === "Add Event" ? (
            <AddEventForm />
          ) : (
            <div className={styles.eventList}>
              <EventCard />
            </div>
          )}

        </form>

      </div>
    </>
  );
}

export default ViewEvent;
