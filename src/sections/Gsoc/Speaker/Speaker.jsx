import React, { useEffect, useState } from "react";
import { Element } from "react-scroll";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { parse, differenceInMilliseconds } from "date-fns";
import styles from "./styles/Speaker.module.scss";

function FedShow() {
  const [remainingTime, setRemainingTime] = useState("");
  const [btnTxt, setBtnTxt] = useState("FREE PASS");

  const { ref: refImg1, inView: inViewImg1 } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const { ref: refImg2, inView: inViewImg2 } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const { ref: refImg3, inView: inViewImg3 } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      calculateRemainingTime();
    }, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, []);

  const calculateRemainingTime = () => {
    try {
      const regStartDate = parse(
        "December 28, 2024, 10:00:00 AM",
        "MMMM dd, yyyy, h:mm:ss a",
        new Date()
      );
      const endTime = parse(
        "December 28, 2024, 2:00:00 PM",
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

  return (
    <div className={styles.fedShow}>
        
      <div className={styles.fedshowcircle}></div>
      <div className={styles.fedshowcircle2}></div>
      <Element name="p">
          <p className={styles.head}>Empowering Open Source:</p>
          <span className={styles.subHead}> Insights and Inspiration from GSoC Expert</span>
      </Element>
      <div className={styles.imageContainer}>
      <Element name="img">
        <motion.div
            ref={refImg1}
            initial={{ opacity: 0, y: -10, scale: 0.5 }}
            animate={{
            opacity: inViewImg1 ? 1 : 0,
            y: inViewImg1 ? 0 : -10,
            rotate: inViewImg1 ? 0 : 0,
            scale: inViewImg1 ? 1 : 0.5,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
            perspective: 1000,
            display: "flex",
            justifyContent: "center", 
            alignItems: "center", 
          
            }}
        >
            <img
            className={styles.imgLeft}
            src="https://cdn.prod.website-files.com/66ffb182a2a1dbe73904d0b5/67630436c26671752504862c_img1-removebg-preview.png"
            alt="Hero"
            style={{
                Width: "100%", 
                 
            }}
            />
        </motion.div>
        </Element>
          <div className={styles.info}>
            <p>
              <FaCalendarAlt className={styles.icon} size={20} /> December 28,
              2024
            </p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p>
                <FaClock className={styles.icon} /> 05:00 PM
              </p>
              <p style={{ marginLeft: "20px" }}>
                <FaMapMarkerAlt className={styles.icon} /> ONLINE
              </p>
            </div>
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
          
      </div>
      <Element name="p">
          <p className={styles.foot}>Voices of Innovation, Paths to Open Source Success!</p>
          <span className={styles.subfoot}>Inspiring Minds, Shaping the Future Together!</span>
      </Element>
    </div>
  );
}

export default FedShow;
