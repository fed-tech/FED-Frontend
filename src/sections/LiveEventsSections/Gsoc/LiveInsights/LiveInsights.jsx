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
        <img src="https://i.ibb.co/C7vcpB8/image-4.png" alt="GSOC" />
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
          src="https://i.ibb.co/93dDdyJ/Picyard-1734689449494-deblurred.png"
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
      setShouldNavigate(false);
    }
  }, [shouldNavigate, navigatePath, navigate]);


  useEffect(() => {
      const intervalId = setInterval(() => {
        calculateRemainingTime();
      }, 1000); // Update every second
  
      return () => clearInterval(intervalId);
    }, []);
  
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
      } catch (error) {
        console.error("Date parsing error:", error);
        setRemainingTime(null);
      }
    };
  const handleButtonClick = () => {
    if (!authCtx.isLoggedIn) {
      sessionStorage.setItem("prevPage", window.location.pathname);
      setNavigatePath("/login");
      setShouldNavigate(true);
    } else {
      handleForm();
    }
  };

  const handleForm = () => {
    if (authCtx.isLoggedIn) {
      if (authCtx.user.access !== "USER" && authCtx.user.access !== "ADMIN") {
        setTimeout(() => {
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
      }
    }
  };

  const isButtonDisabled = () =>
    isMicroLoading ||
    isRegistrationClosed ||
    btnTxt === "CLOSED" ||
    btnTxt === "ALREADY REGISTERED" ||
    btnTxt === "ALREADY MEMBER" ||
    btnTxt === remainingTime;

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
            src="https://i.ibb.co/93dDdyJ/Picyard-1734689449494-deblurred.png"
            alt="GSOC image"
          />
          <div className={styles.flex1}>
            <h2>KICK OFF YOUR JOURNEY WITH RIGHT GUIDANCE FROM GSOC ALUMNI</h2>
            <div className={styles.mid}>
              <Card2
                src="https://i.ibb.co/C7vcpB8/image-4.png"
                alt="GSOC Logo"
              />
              <h2>Tailored Strategies for GSoC</h2>
            </div>
            <div className={styles.mid}>
              <Card2
                src="https://i.ibb.co/C7vcpB8/image-4.png"
                alt="GSOC Logo"
              />
              <h2>Insider Tips for Winning Proposals</h2>
            </div>
            <div className={styles.mid}>
              <Card2
                src="https://i.ibb.co/C7vcpB8/image-4.png"
                alt="GSOC Logo"
              />
              <h2>Real-Life Inspiration</h2>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.mid}>
        <button
          className={styles.registerBtn}
          disabled={
            btnTxt === "SHOW ENDED" ||
            btnTxt === "SHOW IS LIVE" ||
            btnTxt === `${remainingTime}`
          }
          style={{ cursor: "not-allowed" }}
        >
          {remainingTime ? `${remainingTime}` : btnTxt}
        </button>
      </div>
      <Alert />
    </div>
  );
}

export default LiveInsights;
