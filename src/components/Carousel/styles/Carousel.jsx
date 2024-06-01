import React, { useState, useEffect } from "react";
import styles from "./styles/Carousel.module.scss";

function Carousel({ images }) {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  let timeOut = null;

  useEffect(() => {
    if (autoPlay) {
      timeOut = setTimeout(() => {
        slideRight();
      }, 2500);
    }
    return () => clearTimeout(timeOut);
  }, [current, autoPlay]);

  const slideRight = () => {
    setCurrent((prevCurrent) => (prevCurrent === images.length - 1 ? 0 : prevCurrent + 1));
  };


  return (
    <div className={styles.carousel_outer}>
      <div
        className={styles.carousel}
        onMouseEnter={() => {
          setAutoPlay(false);
          clearTimeout(timeOut);
        }}
        onMouseLeave={() => {
          setAutoPlay(true);
        }}
      >
        <div className={styles.carousel_wrapper}>
          {images.map((image, index) => (
            <div
              key={index}
              className={
                index === current
                  ? `${styles.carousel_card} ${styles.carousel_card_active}`
                  : styles.carousel_card
              }
            >
              <img className={styles.card_image} src={image.image} alt={image.title} />
              <div className={styles.card_overlay}>
                <h2 className={styles.card_title}>{image.title}</h2>
              </div>
            </div>
          ))}

          <div className={styles.carousel_pagination}>
            {images.map((_, index) => (
              <div
                key={index}
                className={
                  index === current
                    ? `${styles.pagination_dot} ${styles.pagination_dot_active}`
                    : styles.pagination_dot
                }
                onClick={() => setCurrent(index)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carousel;
