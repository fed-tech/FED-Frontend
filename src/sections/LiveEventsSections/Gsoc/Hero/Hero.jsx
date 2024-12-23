import React, { useContext, useEffect, useState } from "react";
import { Element } from "react-scroll";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../../context/AuthContext";
import styles from "./styles/Hero.module.scss";
import { parse, differenceInMilliseconds } from "date-fns";
import { Alert, MicroLoading } from "../../../../microInteraction";

function Hero({ ongoingEvents, isRegisteredInRelatedEvents, eventName }) {
  const authCtx = useContext(AuthContext);
  const [alert, setAlert] = useState(null);
  const [remainingTime, setRemainingTime] = useState("");
  const [info, setInfo] = useState({});
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);
  const navigate = useNavigate();
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [navigatePath, setNavigatePath] = useState("/");
  const [isMicroLoading, setIsMicroLoading] = useState(true);
  const [relatedEventId, setRelatedEventId] = useState(null);
  const [btnTxt, setBtnTxt] = useState("REGISTER NOW");

  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
      setAlert(null); // Reset alert after displaying it
    }
  }, [alert]);

  useEffect(() => {
    if (shouldNavigate) {
      navigate(navigatePath);
      setShouldNavigate(false); // Reset state after navigation
    }
  }, [shouldNavigate, navigatePath, navigate]);

  const handleButtonClick = () => {
    if (!authCtx.isLoggedIn) {
      setIsMicroLoading(true);
      sessionStorage.setItem("prevPage", window.location.pathname);
      setNavigatePath("/login");
      setShouldNavigate(true);
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
      } else {
        const relatedEventId = ongoingEvents.find(
          (e) => e.info.relatedEvent === "null"
        )?.id;
        if (relatedEventId) {
          setNavigatePath(`/Events/${relatedEventId}/Form`);
          setShouldNavigate(true);
        }
        setTimeout(() => {
          setIsMicroLoading(false);
        }, 3000);
      }
    }
  };

const calculateRemainingTime = () => {
    try {
      const regStartDate = parse(
        "January 3, 2025, 10:00:00 AM",
        "MMMM dd, yyyy, h:mm:ss a",
        new Date()
      );
      const endTime = parse(
        "January 3, 2025, 2:00:00 PM",
        "MMMM dd, yyyy, h:mm:ss a",
        new Date()
      );
      const now = new Date();

      if (now >= endTime) {
        setRemainingTime(null);
        setBtnTxt("SHOW ENDED");
        return;
      } else if (now >= regStartDate) {
        setRemainingTime(null);
        setBtnTxt("SHOW IS LIVE");
        return;
      }

      const timeDifference = differenceInMilliseconds(regStartDate, now);

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
      const seconds = Math.floor((timeDifference / 1000) % 60);

      let remaining = "";
      if (days > 0) {
        remaining = `${days} day${days > 1 ? "s" : ""} left`;
      } else {
        remaining = `${hours}h ${minutes}m ${seconds}s`;
      }

      setRemainingTime(remaining);
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
  }, [info?.regDateAndTime, ongoingEvents]);

  useEffect(() => {
    const updateButtonText = () => {
      if (isRegistrationClosed) {
        setIsMicroLoading(false);
        setBtnTxt("CLOSED");
      } else if (!authCtx.isLoggedIn) {
        setIsMicroLoading(false);
        setBtnTxt(remainingTime || "REGISTER NOW");
      } else {
        setIsMicroLoading(false);
        if (authCtx.user.access !== "USER") {
          setBtnTxt(remainingTime || "ALREADY MEMBER");
        } else if (isRegisteredInRelatedEvents) {
          setBtnTxt(
            authCtx.user.regForm.includes(relatedEventId)
              ? "ALREADY REGISTERED"
              : remainingTime || "REGISTER NOW"
          );
        } else {
          setBtnTxt(remainingTime || "REGISTER NOW");
        }
      }
    };

    updateButtonText();
  }, [
    isRegistrationClosed,
    authCtx.isLoggedIn,
    authCtx.user?.access,
    remainingTime,
    isRegisteredInRelatedEvents,
    relatedEventId,
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
              btnTxt === "ALREADY MEMBER"
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
