/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import shareOutline from "../../assets/images/shareOutline.svg";
import Share from "../../features/Modals/Event/ShareModal/ShareModal";
import { MdGroups, MdArrowBackIos, MdLocationOn, MdCalendarToday, MdAccessTime } from "react-icons/md";
import { FaUser, FaRupeeSign } from "react-icons/fa";
import { PiClockCountdownDuotone } from "react-icons/pi";
import { IoIosLock } from "react-icons/io";
import AuthContext from "../../context/AuthContext";
import { Blurhash } from "react-blurhash";
import { Alert } from "../../microInteraction";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { api } from "../../services";
import { parse, differenceInMilliseconds } from "date-fns";

const EventDetailPage = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const navigate = useNavigate();
    const [remainingTime, setRemainingTime] = useState("");
    const [btnTxt, setBtnTxt] = useState("Register Now");
    const authCtx = useContext(AuthContext);
    const [alert, setAlert] = useState(null);
    const { eventId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [info, setInfo] = useState({});
    const [data, setData] = useState({});
    const [isRegisteredInRelatedEvents, setIsRegisteredInRelatedEvents] = useState(false);
    const [pastEvents, setPastEvents] = useState([]);
    const [ongoingEvents, setOngoingEvents] = useState([]);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isShareOpen, setShareOpen] = useState(false);

    // Fetch event data
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get("/api/form/getAllForms");
                if (response.status === 200) {
                    const fetchedEvents = response.data.events;
                    const ongoing = fetchedEvents.filter((event) => !event.info.isEventPast);
                    const past = fetchedEvents.filter((event) => event.info.isEventPast);
                    setOngoingEvents(ongoing);
                    setPastEvents(past);
                    const eventData = fetchedEvents.find((e) => e.id === eventId);
                    setData(eventData);
                    setInfo(eventData?.info || {});
                } else {
                    setAlert({ type: "error", message: "Error fetching event details.", position: "bottom-right", duration: 3000 });
                }
            } catch (error) {
                console.error("Error fetching event:", error);
                setAlert({ type: "error", message: "Error fetching event details.", position: "bottom-right", duration: 3000 });
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    useEffect(() => {
        if (alert) {
            const { type, message, position, duration } = alert;
            Alert({ type, message, position, duration });
            setAlert(null);
        }
    }, [alert]);

    useEffect(() => {
        if (info.regDateAndTime) {
            calculateRemainingTime();
            const intervalId = setInterval(calculateRemainingTime, 1000);
            return () => clearInterval(intervalId);
        }
    }, [info.regDateAndTime]);

    const dateStr = info.eventDate;
    const date = new Date(dateStr);
    const day = date.getDate();
    const getOrdinalSuffix = (d) => {
        if (d > 3 && d < 21) return "th";
        switch (d % 10) { case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th"; }
    };
    const formattedDate = `${day}${getOrdinalSuffix(day)} ${date.toLocaleDateString("en-GB", { month: "long" })} ${date.getFullYear()}`;

    const calculateRemainingTime = () => {
        const regStartDate = parse(info.regDateAndTime, "MMMM do yyyy, h:mm:ss a", new Date());
        const timeDifference = differenceInMilliseconds(regStartDate, new Date());
        if (timeDifference <= 0) { setRemainingTime(null); return; }
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDifference / 1000) % 60);
        setRemainingTime(days > 0 ? `${days} day${days > 1 ? "s" : ""} left` : [hours > 0 ? `${hours}h ` : "", minutes > 0 ? `${minutes}m ` : "", seconds > 0 ? `${seconds}s` : ""].join("").trim());
    };

    useEffect(() => {
        if (info.isRegistrationClosed || info.isEventPast) { setBtnTxt("Closed"); }
        else if (remainingTime) { setBtnTxt(authCtx.user.access === "USER" ? "Locked" : remainingTime); }
        else { setBtnTxt("Register Now"); }
    }, [info.isRegistrationClosed, remainingTime]);

    useEffect(() => {
        const registeredEventIds = authCtx.user.regForm || [];
        const relatedEventIds = ongoingEvents.map((e) => e.info.relatedEvent).filter((id) => id && id !== "null").filter((id, i, s) => s.indexOf(id) === i);
        if (registeredEventIds.length > 0 && relatedEventIds.length > 0) {
            if (relatedEventIds.some((id) => registeredEventIds.includes(id))) setIsRegisteredInRelatedEvents(true);
        }
    }, [ongoingEvents, authCtx.user.regForm]);

    useEffect(() => {
        if (authCtx.isLoggedIn && authCtx.user.regForm) {
            if (info.isRegistrationClosed) { setBtnTxt("Closed"); return; }
            if (authCtx.user.regForm.includes(data?.id)) { setBtnTxt("Already Registered"); return; }
            if (data?.info?.relatedEvent !== "null" && authCtx.user.access === "USER") {
                setBtnTxt(data?.info?.isRegistrationClosed ? "Closed" : "Locked"); return;
            }
            setBtnTxt(remainingTime ? remainingTime : data?.info?.isRegistrationClosed ? "Closed" : "Register Now");
        }
    }, [authCtx.isLoggedIn, authCtx.user.regForm, data, info.isRegistrationClosed, isRegisteredInRelatedEvents, remainingTime]);

    const handleForm = () => {
        if (authCtx.isLoggedIn) {
            if (authCtx.user.access !== "USER" && authCtx.user.access !== "ADMIN") {
                setBtnTxt("Already Member");
                setAlert({ type: "info", message: "Team Members are not allowed to register for the Event", position: "bottom-right", duration: 3000 });
            } else {
                navigate("/Events/" + data?.id + "/Register");
            }
        } else {
            sessionStorage.setItem("prevPage", window.location.pathname);
            navigate("/login");
        }
    };

    // Parse schedule from description if it contains schedule data
    const parseSchedule = () => {
        if (!info.schedule) return [];
        try { return typeof info.schedule === "string" ? JSON.parse(info.schedule) : info.schedule; }
        catch { return []; }
    };
    const schedule = parseSchedule();

    const url = window.location.href;
    const isDisabled = ["Closed", "Already Registered", "Already Member", "Locked"].includes(btnTxt) || btnTxt === remainingTime;

    return (
        <>
            <div style={pageStyle}>
                <div style={innerPageWrapperStyle}>
                    <button style={backBtnStyle} onClick={() => navigate(-1)}>
                        <MdArrowBackIos size={14} /> Back to Events
                    </button>

                    {isLoading ? (
                        <SkeletonTheme baseColor="#141414" highlightColor="#1f1f1f" duration={1.6}>
                            <div style={containerStyle}>
                                <div style={leftColStyle}>
                                    <div style={bannerWrapStyle}>
                                        <Skeleton height="100%" width="100%" borderRadius={20} />
                                    </div>
                                    <div style={titleContainerStyle}>
                                        <Skeleton height={36} width="58%" />
                                        <div style={metaRowStyle}>
                                            <Skeleton height={28} width={140} borderRadius={24} />
                                            <Skeleton height={28} width={120} borderRadius={24} />
                                        </div>
                                    </div>
                                    <div style={sectionStyle}>
                                        <Skeleton height={22} width="38%" />
                                        <Skeleton height={2} width="60%" />
                                        <Skeleton count={5} height={16} />
                                    </div>
                                    <div style={sectionStyle}>
                                        <Skeleton height={22} width="34%" />
                                        <Skeleton height={2} width="55%" />
                                        <Skeleton count={4} height={18} />
                                    </div>
                                </div>
                                <div style={rightColStyle}>
                                    <div style={regPanelStyle}>
                                        <Skeleton height={26} width="60%" />
                                        <Skeleton count={3} height={14} />
                                        <div style={regInfoWrapStyle}>
                                            <Skeleton height={16} width="80%" />
                                            <Skeleton height={16} width="70%" />
                                            <Skeleton height={16} width="75%" />
                                        </div>
                                        <Skeleton height={48} borderRadius={12} />
                                        <Skeleton height={36} borderRadius={12} />
                                    </div>
                                </div>
                            </div>
                        </SkeletonTheme>
                    ) : !data ? (
                        <div style={{ color: "white", textAlign: "center", marginTop: "4rem", fontSize: "1.2rem" }}>Event not found.</div>
                    ) : (
                        <div style={containerStyle}>
                            {/* LEFT COLUMN */}
                            <div style={leftColStyle}>
                                {/* Banner */}
                                <div style={bannerWrapStyle}>
                                    {!imageLoaded && (
                                        <Blurhash hash="LEG8_%els7NgM{M{RiNI*0IVog%L" width="100%" height="100%" resolutionX={32} resolutionY={32} punch={1} style={{ borderRadius: "16px", position: "absolute", top: 0, left: 0 }} />
                                    )}
                                    <img
                                        src={info.eventImg}
                                        style={{ ...bannerImgStyle, opacity: imageLoaded ? 1 : 0 }}
                                        alt={info.eventTitle}
                                        onLoad={() => setImageLoaded(true)}
                                    />
                                    <div style={bannerOverlayStyle}></div>
                                    <div style={dateBadgeStyle}>{formattedDate}</div>
                                    {info.ongoingEvent && (
                                        <div style={shareBtnStyle} onClick={() => setShareOpen(p => !p)}>
                                            <img src={shareOutline} alt="Share" style={{ width: "20px", height: "20px" }} />
                                        </div>
                                    )}
                                </div>

                                {/* Event Title Row */}
                                <div style={titleContainerStyle}>
                                    <h1 style={titleStyle}>{info.eventTitle}</h1>
                                    <div style={metaRowStyle}>
                                        {info.participationType === "Team" ? (
                                            <span style={metaChipStyle}><MdGroups color="#f97507" size={20} /> Team: {info.minTeamSize}-{info.maxTeamSize}</span>
                                        ) : (
                                            <span style={metaChipStyle}><FaUser color="#f97507" size={14} /> Individual</span>
                                        )}
                                        <span style={metaChipStyle}>
                                            {info.eventAmount ? <><FaRupeeSign color="#f97507" size={14} />{info.eventAmount}</> : <span style={{ color: "#f97507", fontWeight: "600" }}>Free Event</span>}
                                        </span>
                                    </div>
                                </div>

                                {/* About Section */}
                                <div style={sectionStyle}>
                                    <div style={sectionHeaderStyle}>
                                        <h2 style={sectionTitleStyle}>About the Event</h2>
                                    </div>
                                    <div style={dividerStyle} />
                                    <p style={descStyle}>
                                        {info.eventdescription
                                            ? info.eventdescription.split("\n").map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)
                                            : "Detailed description for this event will be updated shortly."}
                                    </p>
                                </div>

                                {/* Schedule Section */}
                                {schedule.length > 0 && (
                                    <div style={sectionStyle}>
                                        <div style={sectionHeaderStyle}>
                                            <h2 style={sectionTitleStyle}>Schedule &amp; Agenda</h2>
                                        </div>
                                        <div style={dividerStyle} />
                                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                            {schedule.map((item, i) => (
                                                <div key={i} style={scheduleItemStyle}>
                                                    <span style={scheduleTimeStyle}>{item.time}</span>
                                                    <div style={scheduleItemDividerStyle}></div>
                                                    <span style={{ color: "#e8e8e8", fontSize: "1rem" }}>{item.title || item.event}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Location Section */}
                                {info.eventLocation && (
                                    <div style={sectionStyle}>
                                        <div style={sectionHeaderStyle}>
                                            <h2 style={sectionTitleStyle}>Location</h2>
                                        </div>
                                        <div style={dividerStyle} />
                                        <div style={locationStyle}>
                                            <div style={iconCircleStyle}><MdLocationOn color="#f97507" size={24} /></div>
                                            <span style={{ color: "#cfcfcf", fontSize: "1.05rem", lineHeight: "1.5" }}>{info.eventLocation}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Date & Time Section */}
                                {info.eventTime && (
                                    <div style={sectionStyle}>
                                        <div style={sectionHeaderStyle}>
                                            <h2 style={sectionTitleStyle}>Date &amp; Time</h2>
                                        </div>
                                        <div style={dividerStyle} />
                                        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
                                            <div style={locationStyle}>
                                                <div style={iconCircleStyle}><MdCalendarToday color="#f97507" size={20} /></div>
                                                <span style={{ color: "#cfcfcf", fontSize: "1.05rem" }}>{formattedDate}</span>
                                            </div>
                                            <div style={locationStyle}>
                                                <div style={iconCircleStyle}><MdAccessTime color="#f97507" size={22} /></div>
                                                <span style={{ color: "#cfcfcf", fontSize: "1.05rem" }}>{info.eventTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT COLUMN — Registration Panel */}
                            <div style={rightColStyle}>
                                <div style={regPanelStyle}>
                                    <h3 style={regPanelTitleStyle}>Registration</h3>
                                    <p style={regPanelSubStyle}>
                                        {btnTxt === "Already Registered"
                                            ? "You've already registered for this event!"
                                            : btnTxt === "Closed"
                                                ? "Registration for this event is now closed."
                                                : btnTxt === "Locked"
                                                    ? "Complete prerequisites to unlock registration."
                                                    : remainingTime
                                                        ? `Registration opens in ${remainingTime}`
                                                        : "Don't miss out on this event. Secure your spot now!"}
                                    </p>

                                    <div style={regInfoWrapStyle}>
                                        <div style={regInfoRowStyle}>
                                            <MdCalendarToday color="#f97507" size={18} />
                                            <span style={{ color: "#cfcfcf", fontSize: "0.95rem" }}>{formattedDate}</span>
                                        </div>
                                        {info.eventTime && (
                                            <div style={regInfoRowStyle}>
                                                <MdAccessTime color="#f97507" size={18} />
                                                <span style={{ color: "#cfcfcf", fontSize: "0.95rem" }}>{info.eventTime}</span>
                                            </div>
                                        )}
                                        {info.eventLocation && (
                                            <div style={regInfoRowStyle}>
                                                <MdLocationOn color="#f97507" size={18} />
                                                <span style={{ color: "#cfcfcf", fontSize: "0.95rem" }}>{info.eventLocation}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div style={regDividerStyle} />

                                    <button
                                        style={{
                                            ...regBtnStyle,
                                            opacity: isDisabled ? 0.6 : 1,
                                            cursor: isDisabled ? "not-allowed" : "pointer"
                                        }}
                                        onClick={handleForm}
                                        disabled={isDisabled}
                                    >
                                        {btnTxt === "Closed" ? (
                                            <><span>Closed</span><IoIosLock size={20} /></>
                                        ) : btnTxt === "Already Registered" ? (
                                            <span>Already Registered</span>
                                        ) : btnTxt === "Locked" ? (
                                            <><span>Locked</span><IoIosLock size={20} /></>
                                        ) : remainingTime ? (
                                            <><PiClockCountdownDuotone size={20} /><span>{btnTxt}</span></>
                                        ) : (
                                            <span>Register Now</span>
                                        )}
                                    </button>

                                    {/* Participation type badge */}
                                    <div style={participationBadgeStyle}>
                                        {info.participationType === "Team" ? (
                                            <><MdGroups color="#f97507" size={22} /><span>Team Event ({info.minTeamSize}-{info.maxTeamSize} members)</span></>
                                        ) : (
                                            <><FaUser color="#f97507" size={16} /><span>Individual Event</span></>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isShareOpen && <Share onClose={() => setShareOpen(p => !p)} urlpath={url} />}
                    <Alert />
                </div>
            </div>
        </>
    );
};

// ─── Inline Styles ────────────────────────────────────────────────────────────

const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#0c0c0c",
    padding: "clamp(20px, 3vw, 40px) 5%",
    fontFamily: "'Segoe UI', Roboto, Helvetica, sans-serif",
    color: "#e8e8e8",
};

const innerPageWrapperStyle = {
    maxWidth: "1440px",
    margin: "0 auto",
    width: "100%",
};

const backBtnStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#161616",
    border: "1px solid #2a2a2a",
    color: "#c9c9c9",
    padding: "10px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500",
    marginBottom: "clamp(20px, 4vw, 32px)",
    transition: "all 0.2s ease",
};

const containerStyle = {
    display: "flex",
    gap: "clamp(24px, 4vw, 40px)",
    width: "100%",
    alignItems: "flex-start",
    flexWrap: "wrap",
};

const leftColStyle = {
    flex: "1 1 60%",
    minWidth: "280px", // Allows mobile screens to shrink naturally while wrapping
    display: "flex",
    flexDirection: "column",
    gap: "clamp(24px, 4vw, 32px)",
};

const rightColStyle = {
    flex: "1 1 320px", 
    position: "sticky",
    top: "32px",
};

const bannerWrapStyle = {
    position: "relative",
    borderRadius: "20px",
    overflow: "hidden",
    background: "#1a1a1a",
    width: "100%",
    height: "clamp(250px, 40vw, 450px)", // Fluid height based on screen size
    border: "1px solid #2a2a2a",
};

const bannerImgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "opacity 0.4s ease-in-out",
};

const bannerOverlayStyle = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    background: "linear-gradient(to top, rgba(12,12,12,0.9) 0%, transparent 100%)",
    pointerEvents: "none",
};

const dateBadgeStyle = {
    position: "absolute",
    top: "16px",
    left: "16px",
    background: "rgba(10, 10, 10, 0.85)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "24px",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    fontWeight: "600",
    border: "1px solid rgba(255,255,255,0.15)",
    zIndex: 2,
};

const shareBtnStyle = {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "rgba(10, 10, 10, 0.85)",
    backdropFilter: "blur(10px)",
    padding: "10px",
    borderRadius: "50%",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    transition: "background 0.2s ease",
};

const titleContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "0 8px",
};

const titleStyle = {
    color: "#ffffff",
    fontSize: "clamp(1.75rem, 5vw, 2.5rem)", // Fluid typography
    fontWeight: "800",
    lineHeight: "1.2",
    margin: 0,
    letterSpacing: "-0.5px",
};

const metaRowStyle = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
};

const metaChipStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#161616",
    border: "1px solid #2a2a2a",
    color: "#e8e8e8",
    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
    fontWeight: "500",
    padding: "8px 16px",
    borderRadius: "24px",
};

const sectionStyle = {
    background: "#121212",
    border: "1px solid #2a2a2a",
    borderRadius: "20px",
    padding: "clamp(20px, 4vw, 32px)", // Fluid padding
};

const sectionHeaderStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
};

const sectionTitleStyle = {
    color: "#ffffff",
    fontSize: "clamp(1.2rem, 3vw, 1.4rem)",
    fontWeight: "700",
    margin: 0,
};

const dividerStyle = {
    height: "2px",
    background: "linear-gradient(90deg, #f97507 0%, rgba(249, 117, 7, 0.1) 50%, transparent 100%)",
    marginBottom: "24px",
    borderRadius: "2px",
    width: "60%",
};

const descStyle = {
    color: "#cfcfcf",
    fontSize: "1.05rem",
    lineHeight: "1.8",
    margin: 0,
};

const scheduleItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    borderRadius: "12px",
    padding: "16px 20px",
    background: "#181818",
    border: "1px solid #2a2a2a",
    flexWrap: "wrap", // Helps text not overflow on very small screens
};

const scheduleTimeStyle = {
    color: "#f97507",
    fontWeight: "700",
    fontSize: "0.95rem",
    minWidth: "90px",
};

const scheduleItemDividerStyle = {
    width: "1px",
    height: "24px",
    background: "#333",
    display: "block",
};

const locationStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
};

const iconCircleStyle = {
    background: "#1c140d",
    border: "1px solid rgba(249, 117, 7, 0.2)",
    padding: "10px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "44px",
};

// Registration Panel
const regPanelStyle = {
    background: "#121212",
    borderRadius: "20px",
    padding: "clamp(20px, 4vw, 32px)",
    border: "1px solid #2a2a2a",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
};

const regPanelTitleStyle = {
    color: "#ffffff",
    fontSize: "1.6rem",
    fontWeight: "800",
    margin: 0,
};

const regPanelSubStyle = {
    color: "#a0a0a0",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    margin: 0,
};

const regInfoWrapStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "#181818",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #2a2a2a",
};

const regInfoRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
};

const regDividerStyle = {
    height: "1px",
    background: "#2a2a2a",
    margin: "8px 0",
};

const regBtnStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #f97507 0%, #d86200 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "700",
    transition: "all 0.3s ease",
    boxShadow: "none", // Removed glow animation shadow here
};

const participationBadgeStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    color: "#a0a0a0",
    fontSize: "0.9rem",
    fontWeight: "500",
    padding: "14px",
    background: "#161616",
    borderRadius: "12px",
    border: "1px dashed #333",
    marginTop: "8px",
};

export default EventDetailPage;
