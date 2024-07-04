import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import style from "./styles/EventCard.module.scss";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import Share from "../../ShareContainer/Share";
import shareOutline from "../../../assets/images/shareOutline.svg";
import groupIcon from "../../../assets/images/groups.svg";
import rupeeIcon from "../../../assets/images/rupeeIcon.svg";
import { CiLock } from "react-icons/ci";
import { PiClockCountdownDuotone } from "react-icons/pi";

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
  } = props;

  const { info } = data;

  const [isOpen, setOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");
  const [btnTxt, setBtnTxt] = useState("Register Now");

  useEffect(() => {
    AOS.init({ duration: 2000 });
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
    if (info.registrationClosed) {
      setBtnTxt("Closed");
    } else if (!remainingTime) {
      setBtnTxt("Register Now");
    } else {
      setBtnTxt(remainingTime);
    }
  }, [info.registrationClosed, remainingTime]);

  const handleShare = () => {
    setOpen(!isOpen);
  };

  const handleCloseShare = () => {
    setOpen(false);
  };

  // const url = window.location.href;
  const url = "ssssssssssssssssssssssssssssssssssssss";

  return (
    <>
      <div className={style.card} style={customStyles.card} data-aos="fade-up">
        <div className={style.backimg} style={customStyles.backimg} onClick={onOpen}>
          <img srcSet={info.imageURL} className={style.img} style={customStyles.img} alt="Event" />
          <div className={style.date} style={customStyles.date}>{formattedDate}</div>
          {type === "ongoing" && showShareButton && (
            <div className={style.share} style={customStyles.share} onClick={handleShare}>
              <img className={style.shareIcon} style={customStyles.shareIcon} src={shareOutline} alt="Share" />
            </div>
          )}
        </div>
        <div className={style.backbtn} style={customStyles.backbtn}>
          <div className={style.eventname} style={customStyles.eventname}>
            {info.eventName}
            {type === "ongoing" && (
              <p>
                <img src={groupIcon} alt="Group" />
                Team size: {info.minSize}{"-"}{info.maxSize} {" || "}
                <div className={style.price} style={customStyles.price}>
                  {info.eventPrice ? (
                    <p style={customStyles.eventnamep}>
                      <img src={rupeeIcon} alt="Rupee" />
                      {info.eventPrice}
                    </p>
                  ) : (
                    <p style={{ color: "inherit" }}>Free</p>
                  )}
                </div>
              </p>
            )}
          </div>
          {type === "ongoing" && showRegisterButton && (
            <div>
              <button
                className={style.registerbtn}
                style={{
                  ...customStyles.registerbtn,
                  cursor: btnTxt === "Register Now" ? "pointer" : "not-allowed",
                }}
                disabled={btnTxt === "Closed"}
              >
                {btnTxt === "Closed" ? (
                  <>
                    Closed <CiLock style={{ marginLeft: "5px" }} />
                  </>
                ) : (
                  <>
                    {remainingTime ? (
                      <>
                        <PiClockCountdownDuotone /> {btnTxt}
                      </>
                    ) : (
                      <Link to={'/Events/'+data.id+"/Form"}><div>{btnTxt}</div></Link>
                   
                    )}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        <div className={style.backtxt} style={customStyles.backtxt}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className={style.EventDesc} style={customStyles.EventDesc}>{info.description}</div>
            <Link to={modalpath + data.id}>
              <span onClick={handleCloseShare} className={style.seeMore} style={{
                ...customStyles.seeMore,
                marginLeft: "auto",
                whiteSpace: "nowrap"
              }}>
                See More...
              </span>
            </Link>
          </div>
          {additionalContent && <div>{additionalContent}</div>}
        </div>
      </div>
      {isOpen && type === "ongoing" && <Share onClose={handleShare} urlpath={url + "/" + data.id} />}
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
};

EventCard.defaultProps = {
  customStyles: {},
  showShareButton: true,
  showRegisterButton: true,
  additionalContent: null,
};

export default EventCard;
