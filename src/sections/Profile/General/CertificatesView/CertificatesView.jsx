import { useContext, useEffect, useState } from "react";
import styles from "./styles/CertificatesView.module.scss";
import AuthContext from "../../../../context/AuthContext";
import { Link } from "react-router-dom";
import { api } from "../../../../services";
import { ComponentLoading } from "../../../../microInteraction";

const Events = () => {
  const authCtx = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const SendCertificatePath = "/profile/events/SendCertificate";
  const createCertificatesPath = "/profile/events/createCertificates";
  const viewCertificatesPath = "/profile/events/viewCertificates";

  const analyticsAccessRoles = [
    "PRESIDENT",
    "VICEPRESIDENT",
    "DIRECTOR_CREATIVE",
    "DIRECTOR_TECHNICAL",
    "DIRECTOR_MARKETING",
    "DIRECTOR_OPERATIONS",
    "DIRECTOR_SPONSORSHIP",
    "ADMIN",
  ];

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const response = await api.get("/api/form/getAllForms");
        const userEvents = authCtx.user.regForm;

        if (response.status === 200) {
          let fetchedEvents = response.data.events;

          if (authCtx.user.access !== "USER") {
            setEvents(sortEventsByDate(fetchedEvents));
          } else {
            const filteredEvents = fetchedEvents.filter((event) =>
              userEvents.includes(event.id)
            );
            setEvents(sortEventsByDate(filteredEvents));
          }
        } else {
          setError({
            message: "Sorry for the inconvenience, we are having issues fetching your Events",
          });
        }
      } catch (error) {
        setError({
          message: "Sorry for the inconvenience, we are having issues fetching your Events",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventsData();
  }, [authCtx.user.email]);

  const sortEventsByDate = (events) => {
    return events.sort(
      (a, b) => new Date(b.info.eventDate) - new Date(a.info.eventDate)
    );
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const hasAnalyticsAccess =
    analyticsAccessRoles.includes(authCtx.user.access) ||
    authCtx.user.email === "srex@fedkiit.com";

  return (
    <div className={styles.participatedEvents}>
      <div className={styles.proHeading}>
        <h3 className={styles.headInnerText}>
          {authCtx.user.access !== "USER" ? (
            <><span>Events</span> Timeline</>
          ) : (
            <><span>Participated</span> Events</>
          )}
        </h3>

        <div className={styles.countBadge}>
          {events.length} {events.length === 1 ? "Event" : "Events"}
        </div>
      </div>

      {isLoading ? (
        <ComponentLoading />
      ) : (
        <>
          {error && <div className={styles.error}>{error.message}</div>}

          <div className={styles.tableCard}>
            {events.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.eventsTable}>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Certificates</th>
                      {hasAnalyticsAccess && (
                        <>
                          <th>Manage Mail</th>
                          <th>Create / Edit</th>
                        </>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {events.map((event) => (
                      <tr key={event._id || event.id}>
                        <td className={styles.eventNameCell} data-label="Event">
                          {event.info.eventTitle}
                        </td>

                        <td className={styles.eventDateCell} data-label="Date">
                          {formatDate(event.info.eventDate)}
                        </td>

                        <td data-label="Certificates">
                          <Link to={`${viewCertificatesPath}/${event.id}`}>
                            <button className={styles.primaryButton}>View</button>
                          </Link>
                        </td>

                        {hasAnalyticsAccess && (
                          <td data-label="Manage Mail">
                            <Link to={`${SendCertificatePath}/${event.id}`}>
                              <button className={styles.secondaryButton}>Manage</button>
                            </Link>
                          </td>
                        )}

                        {hasAnalyticsAccess && (
                          <td data-label="Create / Edit">
                            <Link to={`${createCertificatesPath}/${event.id}`}>
                              <button className={styles.secondaryButton}>Edit</button>
                            </Link>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No events found.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Events;