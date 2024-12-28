import React, { useContext, useEffect, useState } from "react";
import { Element } from "react-scroll";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../../context/AuthContext";
import styles from "./styles/Hero.module.scss";
import { parse, differenceInMilliseconds } from "date-fns";
import { Alert, MicroLoading } from "../../../../microInteraction";

function Hero({ ongoingEvents, eventName }) {
  const authCtx = useContext(AuthContext);
  const [alert, setAlert] = useState(null);
  const [remainingTime, setRemainingTime] = useState("");
  const [info, setInfo] = useState({});
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);
  const navigate = useNavigate();
  const [isMicroLoading, setIsMicroLoading] = useState(false);
  const [relatedEventId, setRelatedEventId] = useState(null);
  const [btnTxt, setBtnTxt] = useState("Loading...");

  // Display alerts using Alert component
  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
      setAlert(null);
    }
  }, [alert]);


  const calculateRemainingTime = () => {
    try {
      if (!info.regDateAndTime) return;

      const regStartDate = parse(
        info.regDateAndTime,
        "MMMM do yyyy, h:mm:ss a",
        new Date()
      );
      const now = new Date();

      const timeDifference = differenceInMilliseconds(regStartDate, now);

      if (timeDifference <= 0) {
        setRemainingTime(null);
        setBtnTxt("REGISTER NOW");
        return;
      }

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
      const seconds = Math.floor((timeDifference / 1000) % 60);

      const remaining =
        days > 0
          ? `${days} day${days > 1 ? "s" : ""} left`
          : `${hours}h ${minutes}m ${seconds}s`;

      setRemainingTime(remaining);
      setBtnTxt(remaining);
    } catch (error) {
      console.error("Date parsing error:", error);
      setRemainingTime(null);
    }
  };

  
  useEffect(() => {
    const ongoingInfo = ongoingEvents.find(
      (e) => e.info.relatedEvent === "null"
    )?.info;

    setInfo(ongoingInfo);
    setIsRegistrationClosed(ongoingInfo?.isRegistrationClosed || false);

    const relatedId = ongoingEvents.find(
      (e) => e.info.relatedEvent === "null"
    )?.id;
    setRelatedEventId(relatedId);

    if (ongoingInfo?.regDateAndTime) {
      calculateRemainingTime();
      const intervalId = setInterval(calculateRemainingTime, 1000);
      return () => clearInterval(intervalId);
    }
  }, [ongoingEvents]);

  const handleButtonClick = () => {
    if (isRegistrationClosed) return;

    if (!authCtx.isLoggedIn) {
      setIsMicroLoading(true);
      sessionStorage.setItem("prevPage", window.location.pathname);
      navigate("/login");
    } else {
      handleForm();
    }
  };

  const handleForm = () => {
    if (authCtx.isLoggedIn) {
      setIsMicroLoading(true);

      if (authCtx.user.access !== "USER" && authCtx.user.access !== "ADMIN") {
        setTimeout(() => {
          setIsMicroLoading(false);
          setAlert({
            type: "info",
            message: "Team Members are not allowed to register for the Event",
            position: "bottom-right",
            duration: 3000,
          });
        }, 1500);
        return;
      }

      if (authCtx.user.regForm?.includes(relatedEventId)) {
        setAlert({
          type: "info",
          message: "You have already registered for this event",
          position: "bottom-right",
          duration: 3000,
        });
        setIsMicroLoading(false);
        return;
      }

      navigate(`/Events/${relatedEventId}/Form`);
    }
  };


  useEffect(() => {
    const updateButtonText = () => {
      setIsMicroLoading(true);
      setTimeout(() => {
        if (isRegistrationClosed) {
          setBtnTxt("CLOSED");
        } else if (!authCtx.isLoggedIn) {
          setBtnTxt(remainingTime || "REGISTER NOW");
        } else if (authCtx.user.access !== "USER") {
          setBtnTxt("ALREADY MEMBER");
        } else if (authCtx.user.regForm?.includes(relatedEventId)) {
          setBtnTxt("ALREADY REGISTERED");
        } else {
          setBtnTxt(remainingTime || "REGISTER NOW");
        }
        setIsMicroLoading(false);
      });
    };

    updateButtonText();
  }, [
    isRegistrationClosed,
    authCtx.isLoggedIn,
    authCtx.user?.access,
    authCtx.user?.regForm,
    relatedEventId,
    remainingTime,
  ]);

  return (
    <div className={styles.hero}>
      <div className={styles.circle}></div>
      <div className={styles.circle2}></div>
      <Element name="p">
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ perspective: 1000 }}
        >
          <p className={styles.head}>FED PRESENTS</p>
        </motion.div>
      </Element>
      <Element name="img">
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ perspective: 1000 }}
        >
          <img
            src="https://cdn.prod.website-files.com/663d1907e337de23e83c30b2/676919ef6caf6de8079c286a_image%20(44).png"
            alt="Hero"
          />
        </motion.div>
      </Element>
      <div className={styles.text}>
        <p>Code, Collaborate, Conquer: Your GSoC Journey Starts Here!</p>
        <button
          onClick={handleButtonClick}
          disabled={
            isMicroLoading ||
            isRegistrationClosed ||
            btnTxt === "CLOSED" ||
            btnTxt === "ALREADY REGISTERED" ||
            btnTxt === "ALREADY MEMBER" ||
            btnTxt === `${remainingTime}`
          }
          style={{
            cursor:
              isRegistrationClosed ||
              btnTxt === "CLOSED" ||
              btnTxt === "ALREADY REGISTERED" ||
              btnTxt === "ALREADY MEMBER" ||
              btnTxt === `${remainingTime}`
                ? "not-allowed"
                : "pointer",
          }}
        >
          {isMicroLoading ? <MicroLoading color="#38ccff" /> : btnTxt}
        </button>
      </div>
      <Alert />
    </div>
  );
}

export default Hero;
