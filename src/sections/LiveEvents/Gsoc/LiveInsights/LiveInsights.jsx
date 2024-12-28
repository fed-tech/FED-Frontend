import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../../context/AuthContext";
import styles from "./styles/LiveInsights.module.scss";
import { parse, differenceInMilliseconds } from "date-fns";
import { Alert, MicroLoading } from "../../../../microInteraction";

function Card2({ img }) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 50, scale: 0.5 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className={styles.card_img2}>
        <img src="https://cdn.prod.website-files.com/645fbc01f38b6fb6255c240c/676dd558d2026a8428f83ded_image-removebg-preview%20(3).png" alt="GSOC" />
      </div>
    </motion.div>
  );
}

function Card({ img }) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 50, scale: 0.5 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className={styles.card_img}>
        <img
          src="https://cdn.prod.website-files.com/645fbc01f38b6fb6255c240c/676dd6757e773446d895f1c4_gsoc%202025.png"
          alt="GSOC"
        />
      </div>
    </motion.div>
  );
}

function LiveInsights({ ongoingEvents, isRegisteredInRelatedEvents }) {
  const authCtx = useContext(AuthContext);
  const [alert, setAlert] = useState(null);
  const [remainingTime, setRemainingTime] = useState("");
  const [info, setInfo] = useState({});
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);
  const navigate = useNavigate();
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [navigatePath, setNavigatePath] = useState("/");
  const [isMicroLoading, setIsMicroLoading] = useState(false);
  const [btnTxt, setBtnTxt] = useState("REGISTER NOW");
  const [relatedEventId, setRelatedEventId] = useState(null);

  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
      setAlert(null); // Reset alert after displaying it
    }
  }, [alert]);

  // useEffect(() => {
  //   if (shouldNavigate) {
  //     navigate(navigatePath);
  //     setShouldNavigate(false);
  //   }
  // }, [shouldNavigate, navigatePath, navigate]);

  // useEffect(() => {
  //     const intervalId = setInterval(() => {
  //       calculateRemainingTime();
  //     }, 1000); // Update every second

  //     return () => clearInterval(intervalId);
  //   }, []);

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

    }, [ongoingEvents]);

  const calculateRemainingTime = () => {
    try {
      const regStartDate = parse(
        "December 28, 2024, 08:00:00 PM",
        "MMMM dd, yyyy, h:mm:ss a",
        new Date()
      );
      const regEndDate = parse(
        "January 9, 2025, 12:00:00 PM",
        "MMMM dd, yyyy, h:mm:ss a",
        new Date()
      );
      const now = new Date();

      if (now >= regEndDate) {
        setRemainingTime(null);
        setBtnTxt("Registration Closed");
        setIsRegistrationClosed(true);
        return;
      }

      const timeDifference = differenceInMilliseconds(regStartDate, now);

      if (now < regStartDate) {
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
      } else {
        setRemainingTime(null);
      }
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
    <div className={styles.container}>
      <div className={styles.circle}></div>
      <div className={styles.circle2}></div>
      <h1>
        GET <span className={styles.para}>LIVE</span> INSIGHTS AND INSPIRATION
      </h1>
      <div className={styles.mid}>
        <div className={styles.outerbox}>
          <Card
            src="https://cdn.prod.website-files.com/645fbc01f38b6fb6255c240c/676dd558d2026a8428f83ded_image-removebg-preview%20(3).png"
            alt="GSOC image"
          />
          <div className={styles.flex1}>
            <h2>KICK OFF YOUR JOURNEY WITH RIGHT GUIDANCE FROM GSoC ALUMNUS</h2>
            <div className={styles.mid}>
              <Card2
                src="https://cdn.prod.website-files.com/645fbc01f38b6fb6255c240c/676dd558d2026a8428f83ded_image-removebg-preview%20(3).png"
                alt="GSOC Logo"
              />
              <h2>Tailored Strategies for GSoC</h2>
            </div>
            <div className={styles.mid}>
              <Card2
                src="https://cdn.prod.website-files.com/645fbc01f38b6fb6255c240c/676dd558d2026a8428f83ded_image-removebg-preview%20(3).png"
                alt="GSOC Logo"
              />
              <h2>Real-Life Inspiration</h2>
            </div>
            <div className={styles.mid}>
              <Card2
                src="https://cdn.prod.website-files.com/645fbc01f38b6fb6255c240c/676dd558d2026a8428f83ded_image-removebg-preview%20(3).png"
                alt="GSOC Logo"
              />
              <h2>Insider Tips for Winning Proposals</h2>
            </div>
           
          </div>
        </div>
      </div>
      <div className={styles.mid}>
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

export default LiveInsights;
