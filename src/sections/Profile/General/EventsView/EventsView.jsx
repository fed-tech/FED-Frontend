import { useContext, useEffect, useState } from "react";
import styles from "./styles/EventsView.module.scss";
import AuthContext from "../../../../context/AuthContext";
// import eventsData from "../../../../data/FormData.json";
import { Link } from "react-router-dom";
import { api } from "../../../../services";
import { ComponentLoading, MicroLoading } from "../../../../microInteraction";
import { accessOrCreateEventByFormId } from "../../Admin/Form/CertificatesForm/tools/certificateTools.js";

const Events = () => {
  const authCtx = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [certMap, setCertMap] = useState({});
  const [loadingCerts, setLoadingCerts] = useState(true);

  const viewPath = "/profile/Events";
  const analyticsPath = "/profile/events/Analytics";

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
          console.error("Error fetching event data:", response.data.message);
          setError({
            message:
              "Sorry for the inconvenience, we are having issues fetching your Events",
          });
        }
      } catch (error) {
        setError({
          message:
            "Sorry for the inconvenience, we are having issues fetching your Events",
        });
        console.error("Error fetching team members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventsData();
  }, [authCtx.user.email]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await api.post(
          "/api/certificate/sendCertificatesAndEvents",
          {
            email: authCtx.user.email,
          },
          {
            headers: { Authorization: `Bearer ${authCtx.token}` },
          }
        );
        if (response.status === 200) {
          setCertificates(response.data.certandevent);
        }
      } catch (err) {
        console.error("Error fetching certificates:", err);
      }
    };

    fetchCertificates();
  }, [authCtx.user.email]);

  const getCertificateForEvent = async (eventId) => {
    const eid = await accessOrCreateEventByFormId(eventId, authCtx.token);
    const found = certificates.find((item) => item.cert.eventId == eid.id);
    return found ? found.cert : null;
  };

  const sortEventsByDate = (events) => {
    return events.sort(
      (a, b) => new Date(b.info.eventDate) - new Date(a.info.eventDate)
    );
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString)
      .toLocaleDateString("en-GB", options)
      .replace(/\//g, "-");
  };

  useEffect(() => {
    const fetchAllCerts = async () => {
      setLoadingCerts(true);
      const map = {};
      if (events.length > 0) {
        for (const event of events) {
          const cert = await getCertificateForEvent(event.id, authCtx.token);
          if (cert) {
            const link = `/verify/certificate?id=${cert.id}`;
            map[event.id] = link;
          }
        }
      }
      setCertMap(map);
      setLoadingCerts(false);
    };

    if (events.length > 0 && certificates.length > 0) {
      fetchAllCerts();
    } else if (events.length > 0 && !isLoading) {
      setLoadingCerts(false);
    }
  }, [events, certificates]);

  return (
    <div className={styles.participatedEvents}>
      <div className={styles.proHeading}>
        {authCtx.user.access !== "USER" ? (
          <h3 className={styles.headInnerText}>
            <span>Events</span> Timeline
          </h3>
        ) : (
          <h3 className={styles.headInnerText}>
            <span>Participated</span> Events
          </h3>
        )}
        <div className={styles.countBadge}>{events.length} events</div>
      </div>

      {isLoading ? (
        <ComponentLoading />
      ) : (
        <>
          {error && <div className={styles.error}>{error.message}</div>}

          <div className={styles.tableCard}>
            <div className={styles.timelineLine} />
            <div className={styles.tables}>
            {events.length > 0 ? (
              <table className={styles.eventsTable}>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Details</th>
                    {authCtx.user.access === "USER" && <th>Certificate</th>}
                    {(analyticsAccessRoles.includes(authCtx.user.access) ||
                      authCtx.user.email == "srex@fedkiit.com") && (
                      <th>Registrations</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr key={event._id || event.id} className={styles.row}>
                      <td className={styles.eventNameCell}>
                        <span className={styles.rowDot} />
                        {event.info.eventTitle}
                      </td>
                      <td className={styles.eventDateCell}>
                        {formatDate(event.info.eventDate)}
                      </td>

                      {/* View Event Details - accessible to all */}
                      <td>
                        <Link to={`${viewPath}/${event.id}`}>
                          <button className={styles.viewButton}>View</button>
                        </Link>
                      </td>

                      {/* Certificate - only for USERS */}
                      {authCtx.user.access === "USER" && (
                        <td>
                          {loadingCerts ? (
                            <div className={styles.loadingContainer}>
                              <MicroLoading />
                            </div>
                          ) : certMap[event.id] ? (
                            <Link
                              to={certMap[event.id]}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <button className={styles.viewButton}>
                                View
                              </button>
                            </Link>
                          ) : (
                            <button
                              className={styles.viewButton}
                              disabled
                              title="Certificate has not been issued yet"
                            >
                              Not Issued
                            </button>
                          )}
                        </td>
                      )}

                      {/* Analytics - only for admins and specific roles */}
                      {(analyticsAccessRoles.includes(authCtx.user.access) ||
                        authCtx.user.email === "srex@fedkiit.com") && (
                        <td>
                          <Link to={`${analyticsPath}/${event.id}`}>
                            <button className={styles.viewButton}>View</button>
                          </Link>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={styles.noEvents}>Not participated in any Events</p>
            )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Events;