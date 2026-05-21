import React, { useEffect, useState } from 'react';
import SponserImg from '../../../data/Sponser.json';
import styles from './styles/Sponser.module.scss';
import SkeletonCard from '../../../layouts/Skeleton/Sponser/Sponser';
import { Blurhash } from 'react-blurhash';

const Sponser = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const SponserCard = ({ image }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    return (
      <div className={styles.sponser_card}>
        {!isImageLoaded && (
          <Blurhash
            hash="LEG8_%els7NgM{M{RiNI*0IVog%L"
            width="100%"
            height="100%"
            resolutionX={32}
            resolutionY={32}
            punch={1}
            className={styles.SponserCard_blurhash}
          />
        )}
        <img
          src={image.image}
          alt="Sponsor logo"
          className={styles.SponserCard_image}
          onLoad={() => setIsImageLoaded(true)}
          style={{ opacity: isImageLoaded ? 1 : 0 }}
        />
      </div>
    );
  };

  return (
    <section className={styles.sponser_section}>
      <div className={styles.sponser_heading}>
        <p className={styles.kicker}>Partnership Ecosystem</p>
        <h2 className={styles.sponser_title}>
          Our <span>Sponsors</span>
        </h2>
        <div className={styles.bottom_line}></div>
      </div>

      {/* Top Track */}
      <div className={styles.marquee}>
        <div className={`${styles.marquee_track} ${styles.forward}`}>
          {[...SponserImg, ...SponserImg].map((image, index) =>
            loading ? (
              <SkeletonCard key={`top-${index}`} />
            ) : (
              <SponserCard key={`top-${index}`} image={image} />
            )
          )}
        </div>
      </div>

      {/* Bottom Track (reverse direction) */}
      <div className={`${styles.marquee} ${styles.second_row}`}>
        <div className={`${styles.marquee_track} ${styles.reverse}`}>
          {[...SponserImg.slice().reverse(), ...SponserImg.slice().reverse()].map((image, index) =>
            loading ? (
              <SkeletonCard key={`bottom-${index}`} />
            ) : (
              <SponserCard key={`bottom-${index}`} image={image} />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Sponser;