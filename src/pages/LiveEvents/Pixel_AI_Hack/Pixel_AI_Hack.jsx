import { useContext, useEffect, useState } from "react";
import { api } from "../../../services/index.jsx";
import AuthContext from "../../../context/AuthContext.jsx";
import { motion } from "framer-motion";
import { Element } from "react-scroll";
import { useInView } from "react-intersection-observer";
import styles from "./styles/Pixel_AI_Hack.module.scss";
import Hero from "../../../sections/LiveEvents/Pixel_AI_Hack/Hero/Hero.jsx"; 
import Sponsor from "../../../sections/LiveEvents/Pixel_AI_Hack/Sponsor/Sponsor.jsx";
import Attend from "../../../sections/LiveEvents/Pixel_AI_Hack/Attend/Attend.jsx";
import ChatBot from "../../../features/ChatBot/ChatBot.jsx";
import Accordion from "../../../components/LiveEvents/Accordian/Accordian.jsx";
import Faqs from "../../../sections/LiveEvents/Pixel_AI_Hack/Faqs/Faqs.jsx";
import LiveInsights from "../../../sections/LiveEvents/Pixel_AI_Hack/LiveInsights/LiveInsights.jsx";
import TeamPage from "../../../sections/LiveEvents/Pixel_AI_Hack/TeamPage/TeamPage.jsx";

function Pixel_AI_Hack() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const authCtx = useContext(AuthContext);
  const [eventName, setEventName] = useState("");
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [isRegisteredInRelatedEvents, setIsRegisteredInRelatedEvents] =
    useState(false);

  const { ref: teamImageRef, inView: teamImageInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/api/form/getAllForms");
        if (response.status === 200) {
          const fetchedEvents = response.data.events;
          const sortedEvents = fetchedEvents.sort((a, b) => {
            // Extract priority and event dates
            const priorityA = parseInt(a.info.eventPriority, 10);
            const priorityB = parseInt(b.info.eventPriority, 10);
            const dateA = new Date(a.info.eventDate);
            const dateB = new Date(b.info.eventDate);
            const titleA = a.info.eventTitle || "";
            const titleB = b.info.eventTitle || "";

            // compare by priority (lower priority first)
            if (priorityA !== priorityB) {
              return priorityA - priorityB;
            }

            // If priorities are the same, compare by date (earliest date first)
            if (dateA.getTime() !== dateB.getTime()) {
              return dateA.getTime() - dateB.getTime();
            }

            // If both priority and date are the same, compare alphabetically by title
            return titleA.localeCompare(titleB);
          });

          // Separate ongoing and past events
          const ongoing = sortedEvents.filter(
            (event) => !event.info.isEventPast
          );

          // Set state with the sorted events
          setOngoingEvents(ongoing);
        } else {
          console.error("Error fetching events:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const eventWithNullRelated = ongoingEvents.find(
      (event) => event.info.relatedEvent === "null"
    );

    // Store the event's name or title for display
    const eventName = eventWithNullRelated
      ? eventWithNullRelated.info.eventTitle
      : "";
    setEventName(eventName);
  }, [ongoingEvents]);

  useEffect(() => {
    const registeredEventIds = authCtx.user.regForm || [];
    "Registered Events", registeredEventIds;

    const relatedEventIds = ongoingEvents
      .map((event) => event.info.relatedEvent) // Extract relatedEvent IDs
      .filter((id) => id !== null && id !== undefined && id !== "null") // Filter out null, undefined, and 'null'
      .filter((id, index, self) => self.indexOf(id) === index); // Remove duplicates

    // console.log("Related Event IDs", relatedEventIds);

    let isRegisteredInRelatedEvents = false;
    if (registeredEventIds.length > 0 && relatedEventIds.length > 0) {
      isRegisteredInRelatedEvents = relatedEventIds.some((relatedEventId) =>
        registeredEventIds.includes(relatedEventId)
      );
    }

    if (isRegisteredInRelatedEvents) {
      setIsRegisteredInRelatedEvents(true);
    }
  }, [ongoingEvents, authCtx.user.regForm]);

  return (
    <div className={styles.body}>
      <Hero
        ongoingEvents={ongoingEvents}
        isRegisteredInRelatedEvents={isRegisteredInRelatedEvents}
        eventName={eventName}
      />
      <Sponsor />
      <LiveInsights 
        ongoingEvents={ongoingEvents}
        isRegisteredInRelatedEvents={isRegisteredInRelatedEvents}
        eventName={eventName}
      />
      <Attend />
      <Faqs />
      <TeamPage />
      <div>
        <ChatBot />
        
      </div>
    </div>
  );
}

export default Pixel_AI_Hack;
