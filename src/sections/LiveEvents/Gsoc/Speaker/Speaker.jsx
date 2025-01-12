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
        "January 10, 2025, 07:00:00 PM",
        "MMMM dd, yyyy, h:mm:ss a",
        new Date()
      );
      const endTime = parse(
        "January 10, 2025, 09:00:00 PM",
        "MMMM dd, yyyy, h:mm:ss a",
        new Date()
      );
      const now = new Date();

      if (now >= endTime) {
        setRemainingTime(null);
        setBtnTxt("ENDED");
        return;
      } else if (now >= regStartDate) {
        setRemainingTime(null);
        setBtnTxt("LIVE");
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
            style={{
              perspective: 1000,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",

            }}
          >
            <img
              className={styles.imgLeft}
              src="https://cdn.prod.website-files.com/663d1907e337de23e83c30b2/677b6c158dd2c944d2ea4a85_updated%20ankit.png"
              alt="Hero"
              style={{
                Width: "100%",

              }}
            />
          </motion.div>

        </Element>
        <div className={styles.info}>
          <Element name="p">
            <p className={styles.head}>EMPOWERING</p>
            <p className={styles.subhead}>OPEN SOURCE</p>
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
            <div className={styles.speaker}>
            <img
              className={styles.imgMobile}
              src="https://cdn.prod.website-files.com/663d1907e337de23e83c30b2/677b6c158dd2c944d2ea4a85_updated%20ankit.png"
              alt="Hero"
              
            />
            
            </div>
          </motion.div>
          
          </Element>
            <img className={styles.evelogo} src="https://cdn.prod.website-files.com/663d1907e337de23e83c30b2/6764f973ef9bcf3a5445d7b6_Screenshot%202024-12-20%20102739.png" alt=""
              height={120}
            />
            <center><img className={styles.mobLogo} src="https://cdn.prod.website-files.com/663d1907e337de23e83c30b2/6764f973ef9bcf3a5445d7b6_Screenshot%202024-12-20%20102739.png" alt=""
              height={120}
          /></center>
          </Element>
          <div className={styles.date}>
          
            <p>
              <FaCalendarAlt className={styles.icon} size={20} /> January 10,
              2025
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p>
                <FaClock className={styles.icon} /> 07:00 PM
              </p>
              <p style={{ marginLeft: "20px" }}>
                <FaMapMarkerAlt className={styles.icon} /> ONLINE
              </p>
            </div>
          </div>
          <div className={styles.speakbtn}>
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

      </div>
      {/* <Element name="p">
        <p className={styles.foot}>Voices of Innovation, Paths to Open Source Success!</p>
        <span className={styles.subfoot}>Inspiring Minds, Shaping the Future Together!</span>
      </Element> */}
    </div>
  );
}

export default FedShow;
