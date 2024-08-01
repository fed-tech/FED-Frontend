import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import style from "./styles/EventCard.module.scss";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link, useNavigate } from "react-router-dom";
import Share from "../../features/Modals/Event/ShareModal/ShareModal";
import shareOutline from "../../assets/images/shareOutline.svg";
import groupIcon from "../../assets/images/groups.svg";
import rupeeIcon from "../../assets/images/rupeeIcon.svg";
import { PiClockCountdownDuotone } from "react-icons/pi";
import { IoIosLock } from "react-icons/io";
import { Button } from "../Core";
import AuthContext from "../../context/AuthContext";
import EventCardSkeleton from "../../layouts/Skeleton/EventCard/EventCardSkeleton";
import { Blurhash } from "react-blurhash";
import { Alert, MicroLoading } from "../../microInteraction";

const EventCard = (props) => {
  const {
    data,
    onOpen,
    type,
    modalpath,
    customStyles = {},
    showShareButton = true,
    showRegisterButton = true,
    additionalContent,
    aosDisable,
    onEdit,
    enableEdit,
    isLoading,
  } = props;

  const { info } = data;
  const authCtx = useContext(AuthContext);
  const [isOpen, setOpen] = useState(false);
  const [isHovered, setisHovered] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");
  const [btnTxt, setBtnTxt] = useState("Register Now");
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isMicroLoading, setIsMicroLoading] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [navigatePath, setNavigatePath] = useState("/");
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (shouldNavigate) {
      navigate(navigatePath);
      setShouldNavigate(false); // Reset state after navigation
    }
  }, [shouldNavigate, navigatePath, navigate]);

  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
      setAlert(null); // Reset alert after displaying it
    }
  }, [alert]);

  useEffect(() => {
    if (aosDisable) {
      AOS.init({ disable: true });
    } else {
      AOS.init({ duration: 2000 });
    }
  }, [aosDisable]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 2000); // Show skeleton for 2 seconds

    return () => clearTimeout(timer);
  }, []);

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

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th"; // Handles 4-20
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

  const dayWithSuffix = day + getOrdinalSuffix(day);
  const month = date.toLocaleDateString("en-GB", { month: "long" });

  const formattedDate = `${dayWithSuffix} ${month}`;

  const calculateRemainingTime = () => {
    const regStartDate = new Date(info.regDateAndTime);
    const now = new Date();
    const timeDifference = regStartDate - now;

    if (timeDifference <= 0) {
      setRemainingTime(null);
      return;
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDifference / 1000) % 60);

    const remaining = [
      days > 0 ? `${days}d ` : "",
      hours > 0 ? `${hours}h ` : "",
      minutes > 0 ? `${minutes}m ` : "",
      seconds > 0 ? `${seconds}s` : "",
    ].join("");

    setRemainingTime(remaining.trim());
  };

  useEffect(() => {
    if (info.isRegistrationClosed) {
      setBtnTxt("Closed");
    } else if (!remainingTime) {
      setBtnTxt("Register Now");
    } else {
      setBtnTxt(remainingTime);
    }
  }, [info.isRegistrationClosed, remainingTime]);

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      const isRegistered = authCtx.user.regForm.includes(data.id);
      if (isRegistered) {
        setBtnTxt("Already Registered");
      }
    }
  }, [authCtx.isLoggedIn, authCtx.user.regForm, btnTxt, navigate, data.id]);

  const handleShare = () => {
    setOpen(!isOpen);
  };

  const handleCloseShare = () => {
    setOpen(false);
  };

  const handleForm = () => {
    if (authCtx.isLoggedIn) {
      setIsMicroLoading(true);
      if (authCtx.user.access !== "USER") {
        setTimeout(() => {
          setIsMicroLoading(false);
          setBtnTxt("Already Member");
        }, 1500);
        // setAlert({
        //   type: "info",
        //   message: "Team Members are not allowed to register for the Event",
        //   position: "bottom-right",
        //   duration: 3000,
        // });
      } else {
        setNavigatePath("/Events/" + data._id + "/Form");
        setTimeout(() => {
          setShouldNavigate(true);
        }, 1000);

        setTimeout(() => {
          setIsMicroLoading(false);
        }, 3000);
      }
    } else {
      setIsMicroLoading(true);
      sessionStorage.setItem("prevPage", window.location.pathname);
      setNavigatePath("/login");

      setTimeout(() => {
        setShouldNavigate(true);
      }, 1000);

      setTimeout(() => {
        setIsMicroLoading(false);
      }, 3000);
    }
  };

  const url = window.location.href;

  if (isLoading || showSkeleton) {
    return <EventCardSkeleton />;
  }

  return (
    <>
      <div
        onMouseEnter={() => setisHovered(true)}
        onMouseLeave={() => setisHovered(false)}
        className={style.card}
        style={customStyles.card}
        data-aos={aosDisable ? "" : "fade-up"}
      >
        <div
          className={style.backimg}
          style={customStyles.backimg}
          onClick={onOpen}
        >
          {!imageLoaded && (
            <Blurhash
              hash="L6AcVvDi56n$C,T0IUbF{K-pNG%M"
              width={"100%"}
              height={200}
              resolutionX={32}
              resolutionY={32}
              punch={1}
            />
          )}
          <img
            srcSet={info.eventImg}
            className={style.img}
            style={{
              ...customStyles.img,
              display: imageLoaded ? "block" : "none",
            }}
            alt="Event"
            onLoad={() => setImageLoaded(true)}
          />
          <div className={style.date} style={customStyles.date}>
            {formattedDate}
          </div>
          {type === "ongoing" && showShareButton && (
            <div
              className={style.share}
              style={customStyles.share}
              onClick={handleShare}
            >
              <img
                className={style.shareIcon}
                style={customStyles.shareIcon}
                src={shareOutline}
                alt="Share"
              />
            </div>
          )}
        </div>
        <div className={style.backbtn} style={customStyles.backbtn}>
          <div className={style.eventname} style={customStyles.eventname}>
            {info.eventTitle}
            {type === "ongoing" && (
              <p>
                <img src={groupIcon} alt="Group" />
                <span style={{ color: "white", paddingRight: "5px" }}>
                  Team size:
                </span>{" "}
                {info.minTeamSize}
                {"-"}
                {info.maxTeamSize} {" | "}
                <div className={style.price} style={customStyles.price}>
                  {info.eventAmount ? (
                    <p style={customStyles.eventnamep}>
                      <img src={rupeeIcon} alt="Rupee" />
                      {info.eventAmount}
                    </p>
                  ) : (
                    <p style={{ color: "inherit", 
                                
                    }}>Free</p>
                  )}
                </div>
              </p>
            )}
          </div>
          {type === "ongoing" && showRegisterButton && (
            <div style={{ fontSize: ".9rem", color: "white" }}>
              <button
                className={style.registerbtn}
                style={{
                  ...customStyles.registerbtn,
                  cursor: btnTxt === "Register Now" ? "pointer" : "not-allowed",
                }}
                onClick={handleForm}
                disabled={
                  btnTxt === "Closed" ||
                  btnTxt === "Already Registered" ||
                  btnTxt === "Already Member"
                }
              >
                {btnTxt === "Closed" ? (
                  <>
                    <div style={{ fontSize: "0.9rem" }}>Closed</div>{" "}
                    <IoIosLock
                      alt=""
                      style={{ marginLeft: "0px", fontSize: "1rem" }}
                    />
                  </>
                ) : btnTxt === "Already Registered" ? (
                  <>
                    <div style={{ fontSize: "0.9rem" }}>Registered</div>{" "}
                  </>
                ) : isMicroLoading ? (
                  <div style={{ fontSize: "0.9rem" }}>
                    <MicroLoading />
                  </div>
                ) : (
                  <>
                    {remainingTime ? (
                      <>
                        <PiClockCountdownDuotone /> {btnTxt}
                      </>
                    ) : btnTxt === "Already Member" ? (
                      <>
                        <div style={{ fontSize: "0.9rem" }}>Already Member</div>{" "}
                      </>
                    ) : (
                      <div style={{ fontSize: "0.9rem" }}>Register Now</div>
                    )}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        <div className={style.backtxt} style={customStyles.backtxt}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className={style.EventDesc} style={customStyles.EventDesc}>
              {info.eventdescription}
            </div>
            <Link to={modalpath + data._id}>
              <span
                onClick={handleCloseShare}
                className={style.seeMore}
                style={{
                  ...customStyles.seeMore,
                  marginLeft: "auto",
                  whiteSpace: "nowrap",
                  height: "fit-content",
                }}
              >
                See More
              </span>
            </Link>
          </div>
          {additionalContent && <div>{additionalContent}</div>}
        </div>
      </div>
      {isOpen && type === "ongoing" && (
        <Share onClose={handleShare} urlpath={url + "/" + data._id} />
      )}
      {enableEdit && isHovered && authCtx.user.access === "ADMIN" && (
        <div
          onMouseEnter={() => setisHovered(true)}
          onMouseLeave={() => setisHovered(false)}
          className={style.hovered}
        >
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (onEdit) {
                authCtx.eventData = data;
                onEdit();
              }
            }}
            variant="secondary"
          >
            Edit Event
          </Button>
          <Button variant="secondary">Delete Event</Button>
        </div>
      )}
      <Alert />
    </>
  );
};

EventCard.propTypes = {
  data: PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  modalpath: PropTypes.string.isRequired,
  customStyles: PropTypes.object,
  showShareButton: PropTypes.bool,
  showRegisterButton: PropTypes.bool,
  additionalContent: PropTypes.node,
  aosDisable: PropTypes.bool,
  onEdit: PropTypes.func,
  enableEdit: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
};

export default EventCard;
