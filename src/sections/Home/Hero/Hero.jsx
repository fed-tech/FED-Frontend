import React, { useEffect, useState } from "react";
import styles from "./styles/Hero.module.scss";
import CarouselImg from "../../../data/Carousel.json";
import { Carousel } from "../../../components";
import heroBgImage from "../../../assets/images/herobgimage.png";

const titles = [
  "Entrepreneurship.",
  "Innovation.",
  "Leadership.",
  "Collaboration.",
  "Community.",
  "Impact.",
  "Opportunity.",
  "Development.",
  "Transformation.",
  "Inspiration.",
  "Motivation.",
];

function Hero() {
  const [currentTitle, setCurrentTitle] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const title = titles[titleIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setCurrentTitle(title.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else {
        setCurrentTitle(title.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }

      if (!isDeleting && charIndex === title.length) {
        setTimeout(() => setIsDeleting(true), 800);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setTitleIndex((prev) => (prev + 1) % titles.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, titleIndex]);

  return (
    <section
      className={styles.main}
      style={{ "--hero-bg-image": `url(${heroBgImage})` }}
    >
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heading}>
            Nurturing Innovative & Creative Strategies{" "}
            <span className={styles.dynamicText}>{currentTitle}</span>
          </h1>

          <p className={styles.subtext}>
            Inspiring visionaries towards cultivating excellence and guiding
            future generations toward sustainable growth.
          </p>
        </div>

        <div className={styles.heroMedia}>
          <Carousel images={CarouselImg} />
        </div>
      </div>
    </section>
  );
}

export default Hero;
