import React, { useEffect, useState } from "react";
import { Element } from "react-scroll";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { parse, differenceInMilliseconds } from "date-fns";
import fedShowImg from "../../../assets/images/fedShow.svg";
import styles from "./styles/FedShow.module.scss";

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
        "August 25, 2024, 10:00:00 AM",
        "MMMM dd, yyyy, h:mm:ss a",
        new Date()
      );
      const endTime = parse(
        "August 25, 2024, 2:00:00 PM",
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
            style={{ perspective: 1000 }}
          >
            <img
              className={styles.imgLeft}
              src="https://uploads-ssl.webflow.com/645fbc01f38b6fb6255c240c/66c1446130125423df86f7a3_image_2024-08-18_06-15-12.png"
              alt="Hero"
            />
          </motion.div>
        </Element>
        <Element name="p">
          <p className={styles.head}>WHERE IDEAS MEET</p>
          <span className={styles.subHead}>INNOVATION</span>
          <motion.div
            ref={refImg2}
            initial={{ opacity: 0, y: -10, scale: 0.5 }}
            animate={{
              opacity: inViewImg2 ? 1 : 0,
              y: inViewImg2 ? 0 : -10,
              rotate: inViewImg2 ? 0 : 0,
              scale: inViewImg2 ? 1 : 0.5,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ perspective: 1000 }}
          >
            <div className={styles.showName}>
              <img
                className={styles.imgRight2}
                src={fedShowImg}
                alt="FED Show"
              />
            </div>
          </motion.div>

          <div className={styles.info}>
            <p>
              <FaCalendarAlt className={styles.icon} size={20} /> August 25,
              2024
            </p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p>
                <FaClock className={styles.icon} /> 10:00 AM
              </p>
              <p style={{ marginLeft: "20px" }}>
                <FaMapMarkerAlt className={styles.icon} /> Campus - 14
              </p>
            </div>
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
        </Element>
        <Element name="img">
          <motion.div
            ref={refImg3}
            initial={{ opacity: 0, y: -10, scale: 0.5 }}
            animate={{
              opacity: inViewImg3 ? 1 : 0,
              y: inViewImg3 ? 0 : -10,
              rotate: inViewImg3 ? 0 : 0,
              scale: inViewImg3 ? 1 : 0.5,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ perspective: 1000 }}
          >
            <img
              className={styles.imgRight}
              src="https://uploads-ssl.webflow.com/645fbc01f38b6fb6255c240c/66c144619c2cf228fd915e28_image_2024-08-18_06-15-39.png"
              alt="Hero"
            />

            <img
              className={styles.mobileFedShowImg}
              src="https://uploads-ssl.webflow.com/663d1907e337de23e83c30b2/66c2330cdc17d5b6d4bb5a0d_Screenshot%202024-08-18%20231413.png"
              alt=""
            />
          </motion.div>
        </Element>
      </div>
    </div>
  );
}

export default FedShow;
