import React, { useState, useEffect, Children } from "react";
import PropTypes from "prop-types";
import { Blurhash } from "react-blurhash";
import styles from "./styles/Carousel.module.scss";
import CarouselSkeleton from "../../layouts/Skeleton/Carousel/Carousel";

function Carousel({ children, images, showSkeleton = true }) {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const contentCount = images ? images.length : Children.count(children);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!autoPlay || isLoading) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [current, autoPlay, isLoading]);

  const handleNext = () => {
    setCurrent((prev) => (prev === contentCount - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? contentCount - 1 : prev - 1));
  };

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  if (isLoading && showSkeleton) {
    return <CarouselSkeleton />;
  }

  return (
    <div
      className={styles.carousel_outer}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <div className={styles.carousel}>
        {images
          ? images.map((image, index) => {
              const offset = (index - current + contentCount) % contentCount;

              return (
                <div
                  key={index}
                  className={`${styles.card} ${
                    offset === 0
                      ? styles.active
                      : offset === 1
                      ? styles.layerOne
                      : offset === 2
                      ? styles.layerTwo
                      : styles.hidden
                  }`}
                >
                  <div className={styles.imageWrapper}>
                    {!loadedImages[index] && (
                      <Blurhash
                        hash="LEG8_%els7NgM{M{RiNI*0IVog%L"
                        width="100%"
                        height="100%"
                        resolutionX={32}
                        resolutionY={32}
                        punch={1}
                      />
                    )}
                    <img
                      src={image.image}
                      alt={`Slide ${index + 1}`}
                      onLoad={() => handleImageLoad(index)}
                      className={styles.image}
                    />
                  </div>
                </div>
              );
            })
          : Children.map(children, (child, index) => (
              <div key={index} className={styles.card}>
                {child}
              </div>
            ))}
      </div>

      <div className={styles.controls}>
        <button onClick={handlePrev} className={styles.modernBtn}>
          ‹
        </button>

        <div className={styles.pagination}>
          {Array.from({ length: contentCount }).map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${
                index === current ? styles.dotActive : ""
              }`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>

        <button onClick={handleNext} className={styles.modernBtn}>
          ›
        </button>
      </div>
    </div>
  );
}

Carousel.propTypes = {
  children: PropTypes.node,
  images: PropTypes.array,
  showSkeleton: PropTypes.bool,
};

export default Carousel;