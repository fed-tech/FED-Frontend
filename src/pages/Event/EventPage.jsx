import { useState, useEffect, useContext, useCallback } from "react";
import styles from "./styles/EventPage.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { MdGroups } from "react-icons/md";
import { IoIosLock, IoMdInformationCircleOutline } from "react-icons/io";
import { PiClockCountdownDuotone, PiCalendarCheckDuotone, PiMapPinAreaDuotone, PiQuestionDuotone } from "react-icons/pi";
import { FaUser, FaRupeeSign, FaMicrophoneAlt } from "react-icons/fa";
import AuthContext from "../../context/AuthContext";
import "react-loading-skeleton/dist/skeleton.css";
import { Blurhash } from "react-blurhash";
import {
  MicroLoading,
  Alert,
  ComponentLoading,
} from "../../microInteraction";
import { api } from "../../services";
import { parse, differenceInMilliseconds } from "date-fns";
import shareOutline from "../../assets/images/shareOutline.svg";
import Share from "../../features/Modals/Event/ShareModal/ShareModal";
import ReactMarkdown from "react-markdown";

const EventPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const authCtx = useContext(AuthContext);

  const [remainingTime, setRemainingTime] = useState("");
  const [btnTxt, setBtnTxt] = useState("Register Now");
  const [isMicroLoading, setIsMicroLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [navigatePath, setNavigatePath] = useState("/");
  const [isLoading, setIsLoading] = useState(true);
  const [info, setInfo] = useState({});
  const [data, setData] = useState({});
  const [isRegisteredInRelatedEvents, setIsRegisteredInRelatedEvents] =
    useState(false);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isOpenShare, setIsOpenShare] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get("/api/form/getAllForms");
        if (response.status === 200) {
          const fetchedEvents = response.data.events;
          const ongoing = fetchedEvents.filter(
            (event) => !event.info.isEventPast,
          );
          setOngoingEvents(ongoing);

          const eventData = response.data?.events.find((e) => e.id === eventId);
          setData(eventData);
          setInfo(eventData?.info || {});

          if (eventData?.info) {
            updateMetaTags(eventData.info);
          }
        } else {
          setAlert({
            type: "error",
            message:
              "There was an error fetching event details. Please try again.",
            position: "bottom-right",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setAlert({
          type: "error",
          message: "There was an error fetching event form. Please try again.",
          position: "bottom-right",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (shouldNavigate) {
      navigate(navigatePath);
      setShouldNavigate(false);
    }
  }, [shouldNavigate, navigatePath, navigate]);

  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
      setAlert(null);
    }
  }, [alert]);

  const calculateRemainingTime = useCallback(() => {
    const regStartDate = parse(
      info.regDateAndTime,
      "MMMM do yyyy, h:mm:ss a",
      new Date(),
    );
    const now = new Date();
    const timeDifference = differenceInMilliseconds(regStartDate, now);

    if (timeDifference <= 0) {
      setRemainingTime(null);
      return;
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDifference / 1000) % 60);

    let remaining;
    if (days > 0) {
      remaining = `${days} day${days > 1 ? "s" : ""} left`;
    } else {
      remaining = [
        hours > 0 ? `${hours}h ` : "",
        minutes > 0 ? `${minutes}m ` : "",
        seconds > 0 ? `${seconds}s` : "",
      ]
        .join("")
        .trim();
    }
    setRemainingTime(remaining);
  }, [info.regDateAndTime]);

  useEffect(() => {
    if (info.regDateAndTime) {
      calculateRemainingTime();
      const intervalId = setInterval(calculateRemainingTime, 1000);
      return () => clearInterval(intervalId);
    }
  }, [info.regDateAndTime, calculateRemainingTime]);

  useEffect(() => {
    if (info.isRegistrationClosed || info.isEventPast) {
      setBtnTxt("Closed");
    } else if (remainingTime) {
      if (authCtx.user?.access === "USER") {
        setBtnTxt("Locked");
      }
      setBtnTxt(remainingTime);
    } else {
      setBtnTxt("Register Now");
    }
  }, [
    info.isRegistrationClosed,
    info.isEventPast,
    remainingTime,
    authCtx.user?.access,
  ]);

  useEffect(() => {
    const registeredEventIds = authCtx.user?.regForm || [];
    const relatedEventIds = ongoingEvents
      .map((event) => event.info.relatedEvent)
      .filter((id) => id !== null && id !== undefined && id !== "null")
      .filter((id, index, self) => self.indexOf(id) === index);

    let isRegRelated = false;
    if (registeredEventIds.length > 0 && relatedEventIds.length > 0) {
      isRegRelated = relatedEventIds.some((relatedEventId) =>
        registeredEventIds.includes(relatedEventId),
      );
    }
    if (isRegRelated) {
      setIsRegisteredInRelatedEvents(true);
    }
  }, [ongoingEvents, authCtx.user?.regForm]);

  useEffect(() => {
    if (authCtx.isLoggedIn && authCtx.user?.regForm) {
      if (info.isRegistrationClosed) {
        setBtnTxt("Closed");
      }
      if (isRegisteredInRelatedEvents) {
        if (data?.info?.relatedEvent === "null") {
          if (authCtx.user.regForm.includes(data.id))
            setBtnTxt("Already Registered");
        } else {
          if (authCtx.user.regForm.includes(data?.id)) {
            setBtnTxt("Already Registered");
          } else {
            if (remainingTime) setBtnTxt(remainingTime);
            else if (data?.info?.isRegistrationClosed) setBtnTxt("Closed");
            else setBtnTxt("Register Now");
          }
        }
      } else {
        if (data?.info?.relatedEvent === "null") {
          if (authCtx.user.regForm.includes(data.id))
            setBtnTxt("Already Registered");
          else {
            if (remainingTime) setBtnTxt(remainingTime);
            else if (data?.info?.isRegistrationClosed) setBtnTxt("Closed");
            else setBtnTxt("Register Now");
          }
        } else {
          if (authCtx.user.access === "USER") {
            if (data?.info?.isRegistrationClosed) setBtnTxt("Closed");
            else setBtnTxt("Locked");
          }
        }
      }
    }
  }, [
    authCtx.isLoggedIn,
    authCtx.user?.regForm,
    authCtx.user?.access,
    data,
    info.isRegistrationClosed,
    info.isEventPast,
    isRegisteredInRelatedEvents,
    remainingTime,
  ]);

  const handleShare = () => setIsOpenShare(!isOpenShare);

  const handleForm = () => {
    if (authCtx.isLoggedIn) {
      setIsMicroLoading(true);
      if (authCtx.user.access !== "USER" && authCtx.user.access !== "ADMIN") {
        setTimeout(() => {
          setIsMicroLoading(false);
          setBtnTxt("Already Member");
        }, 1000);
        setAlert({
          type: "info",
          message: "Team Members are not allowed to register for the Event",
          position: "bottom-right",
          duration: 3000,
        });
      } else {
        setNavigatePath("/Events/" + data?.id + "/Form");
        setTimeout(() => setShouldNavigate(true), 3000);
        setTimeout(() => setIsMicroLoading(false), 3000);
        setAlert({
          type: "info",
          message: "Opening Event Registration Form",
          position: "bottom-right",
          duration: 3000,
        });
      }
    } else {
      setIsMicroLoading(true);
      sessionStorage.setItem("prevPage", window.location.pathname);
      setNavigatePath("/login");
      setTimeout(() => setShouldNavigate(true), 3000);
      setTimeout(() => setIsMicroLoading(false), 3000);
    }
  };

  const getFormattedDate = () => {
    if (!info.eventDate) return "";
    const date = new Date(info.eventDate);
    const day = date.getDate();
    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    return `${day}${getOrdinalSuffix(day)} ${date.toLocaleDateString("en-GB", { month: "long" })} ${date.getFullYear()}`;
  };

  const updateMetaTags = (eventInfo) => {
    document.title = `${eventInfo.eventTitle || "Event"} | FED KIIT`;
    const MetaSet = (name, content) => {
      let element =
        document.head.querySelector(`meta[property="${name}"]`) ||
        document.head.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        if (name.startsWith("og:")) element.setAttribute("property", name);
        else element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };
    MetaSet(
      "description",
      eventInfo.eventdescription?.slice(0, 160) || "Event at FED KIIT",
    );
    MetaSet("og:title", eventInfo.eventTitle);
    MetaSet("og:description", eventInfo.eventdescription?.slice(0, 160));
    MetaSet("og:image", eventInfo.eventImg);
    MetaSet("og:url", window.location.href);
    MetaSet("og:type", "website");

    // Structured JSON-LD Scheme
    let scriptEle = document.querySelector("#event-schema");
    if (!scriptEle) {
      scriptEle = document.createElement("script");
      scriptEle.id = "event-schema";
      scriptEle.type = "application/ld+json";
      document.head.appendChild(scriptEle);
    }
    scriptEle.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Event",
      name: eventInfo.eventTitle,
      startDate: eventInfo.eventDate,
      description: eventInfo.eventdescription,
      image: eventInfo.eventImg,
      location: {
        "@type": "Place",
        name: "KIIT University",
      },
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <ComponentLoading
          customStyles={{
            width: "100%",
            height: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </div>
    );
  }

  if (!data) return <div className={styles.notFound}>Event not found</div>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroSection}>
        <div className={styles.heroImageWrapper}>
          {!imageLoaded && (
            <Blurhash
              hash="LEG8_%els7NgM{M{RiNI*0IVog%L"
              width="100%"
              height="100%"
              resolutionX={32}
              resolutionY={32}
              punch={1}
            />
          )}
          {info.eventImg ? (
            <img
              src={info.eventImg}
              className={styles.heroImage}
              style={{ display: imageLoaded ? "block" : "none" }}
              alt={info.eventTitle}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              <PiCalendarCheckDuotone size={60} color="rgba(255,255,255,0.1)" />
              <p>Event Visuals Coming Soon</p>
            </div>
          )}
          <div className={styles.heroBadges}>
            <div className={styles.dateBadge}>{getFormattedDate()}</div>
            {info.ongoingEvent && (
              <div className={styles.shareBadge} onClick={handleShare}>
                <img src={shareOutline} alt="Share" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <div className={styles.headerArea}>
            <h1 className={styles.eventTitle}>{info.eventTitle}</h1>
            <div className={styles.eventMeta}>
              {info.participationType === "Team" ? (
                <span className={styles.metaItem}>
                  <MdGroups size={20} color="#f97507" />
                  <span>
                    Team size: {info.minTeamSize} - {info.maxTeamSize}
                  </span>
                </span>
              ) : (
                <span className={styles.metaItem}>
                  <FaUser size={14} color="#f97507" />
                  <span>Individual</span>
                </span>
              )}
              <span className={styles.divider}>|</span>
              <span className={styles.metaItem}>
                <FaRupeeSign size={16} color="#f97507" />
                <span>{info.eventAmount || "Free"}</span>
              </span>
            </div>
          </div>

          <div className={styles.section}>
            <h2>
              <IoMdInformationCircleOutline /> About the Event
            </h2>
            <div className={styles.richText}>
              {info.eventdescription ? (
                <ReactMarkdown>{info.eventdescription}</ReactMarkdown>
              ) : (
                <>
                  <p>Welcome to our flagship event! Detailed descriptions and the official timeline for this session will be updated shortly by the organizing team.</p>
                  <p>In the meantime, gear up for an immersive experience filled with keynotes from industry leaders, hands-on technical workshops, and exclusive networking opportunities. This event is designed to push the boundaries of innovation and bring together the brightest minds under one roof. Stay tuned for more major announcements regarding our speaker lineup and interactive sessions!</p>
                </>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h2>
              <PiCalendarCheckDuotone /> Schedule & Agenda
            </h2>
            <div className={styles.agendaGrid}>
              <div className={styles.agendaItem}>
                <div className={styles.time}>10:00 AM</div>
                <div className={styles.event}>Opening Ceremony</div>
              </div>
              <div className={styles.agendaItem}>
                <div className={styles.time}>11:30 AM</div>
                <div className={styles.event}>Keynote Session</div>
              </div>
              <div className={styles.agendaItem}>
                <div className={styles.time}>01:00 PM</div>
                <div className={styles.event}>Networking Lunch</div>
              </div>
              <div className={styles.agendaItem}>
                <div className={styles.time}>02:30 PM</div>
                <div className={styles.event}>Hands-on Workshop</div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>
              <FaMicrophoneAlt /> Speakers & Hosts
            </h2>
            <div className={styles.speakersGrid}>
              <div className={styles.speakerCard}>
                <div className={styles.speakerAvatar}>
                  <FaUser size={30} />
                </div>
                <div className={styles.speakerInfo}>
                  <h3>To be announced</h3>
                  <p>Expert Speaker</p>
                </div>
              </div>
              <div className={styles.speakerCard}>
                <div className={styles.speakerAvatar}>
                  <FaUser size={30} />
                </div>
                <div className={styles.speakerInfo}>
                  <h3>FED Team</h3>
                  <p>Event Hosts</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>
              <PiQuestionDuotone /> Frequently Asked Questions
            </h2>
            <div className={styles.faqList}>
              <details className={styles.faqItem}>
                <summary>How can I register for this event?</summary>
                <p>You can register by clicking the &quot;Register Now&quot; button in the sidebar. Make sure you are logged in to your FED account to proceed with the booking.</p>
              </details>
              <details className={styles.faqItem}>
                <summary>Is there any registration fee?</summary>
                <p>{info.eventAmount ? `The registration fee for this event is ₹${info.eventAmount}. Payments can be made securely through our integrated gateway.` : "This event is completely free of cost for all KIIT students and registered club members."}</p>
              </details>
              <details className={styles.faqItem}>
                <summary>Will I receive a certificate of participation?</summary>
                <p>Yes, all attendees verified at the venue will receive an official e-certificate sent to their registered email address within 7 working days after the event concludes.</p>
              </details>
              <details className={styles.faqItem}>
                <summary>Do I need to carry my laptop?</summary>
                <p>For technical workshops and hackathons, carrying a fully charged laptop is highly recommended. Power outlets will be stationed across the venue.</p>
              </details>
              <details className={styles.faqItem}>
                <summary>Are food and refreshments provided?</summary>
                <p>Yes, light snacks and beverages will be provided during the scheduled networking breaks. Attendees are also welcome to utilize the campus cafeterias during lunch hours.</p>
              </details>
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.stickyCTA}>
            <div className={styles.ctaHeader}>
              <h3>Registration</h3>
              <p>Secure your spot now before it&apos;s too late!</p>
            </div>

            <div className={styles.eventQuickDetails}>
              <div className={styles.detailItem}>
                <PiCalendarCheckDuotone size={24} color="#f42b03" />
                <div>
                  <strong>Date</strong>
                  <span>{getFormattedDate()}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <PiMapPinAreaDuotone size={24} color="#f42b03" />
                <div>
                  <strong>Location</strong>
                  <span>KIIT University</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <FaRupeeSign size={22} color="#f42b03" />
                <div>
                  <strong>Ticket Price</strong>
                  <span>{info.eventAmount || "Free"}</span>
                </div>
              </div>
            </div>

            <button
              className={`${styles.registerBtn} ${
                btnTxt === "Register Now"
                  ? styles.activeBtn
                  : styles.disabledBtn
              }`}
              onClick={handleForm}
              disabled={
                btnTxt === "Closed" ||
                btnTxt === "Already Registered" ||
                btnTxt === "Already Member" ||
                btnTxt === "Locked" ||
                btnTxt === remainingTime
              }
            >
              {btnTxt === "Closed" ? (
                <>
                  Closed <IoIosLock size={18} />
                </>
              ) : btnTxt === "Already Registered" ? (
                "Already Registered"
              ) : btnTxt === "Locked" ? (
                <>
                  Locked <IoIosLock size={18} />
                </>
              ) : isMicroLoading ? (
                <MicroLoading />
              ) : (
                <>
                  {remainingTime ? (
                    <>
                      <PiClockCountdownDuotone size={18} /> {btnTxt}
                    </>
                  ) : btnTxt === "Already Member" ? (
                    "Already Member"
                  ) : (
                    "Register Now"
                  )}
                </>
              )}
            </button>

            {info.ongoingEvent && (
              <button className={styles.secondaryShareBtn} onClick={handleShare}>
                <img src={shareOutline} alt="Share" /> Share this Event
              </button>
            )}
          </div>

          <div className={styles.locationInfo}>
            <div className={styles.locationItem}>
              <strong>Venue</strong>
              <p>{info.venue || "KIIT University, Bhubaneswar"}</p>
            </div>
            <div className={styles.locationItem}>
              <strong>Address</strong>
              <p>{info.address || "Patia, Bhubaneswar, Odisha 751024"}</p>
            </div>
          </div>

          <div className={styles.hostedByCard}>
            <p className={styles.hostedTitle}>Organized By</p>
            <div className={styles.hostProfile}>
              <div className={styles.hostAvatar}>
                <img src="https://uploads-ssl.webflow.com/629d87f593841156e4e0d9a4/62eeaa9927e6aea4ff13590e_FedLogo.png" alt="FED Logo" />
              </div>
              <div className={styles.hostDetails}>
                <strong>FED KIIT</strong>
                <span>Federation of Entrepreneurship Development</span>
              </div>
            </div>
          </div>

          <div className={styles.guidelinesCard}>
            <h4><IoMdInformationCircleOutline size={20} color="#f42b03" /> Important Notes</h4>
            <ul>
              <li>Please carry your KIIT Student ID card for entry.</li>
              <li>Arrive at least 15 minutes before the scheduled time.</li>
              <li>Registration is mandatory for all attendees.</li>
            </ul>
          </div>
        </div>
      </div>

      {isOpenShare && (
        <Share onClose={handleShare} urlpath={window.location.href} />
      )}
      <Alert />
    </div>
  );
};

export default EventPage;
