import React from 'react';
import { SponserImg } from '../../data/SponserImages';
import styles from './Styles/Sponser.module.scss';

const SponserCard = ({ image }) => {
  return (
    <div className={styles.sponser_card}>
      <img src={image.image} className={styles.SponserCard_image} alt={image.title} />
    </div>
  );
};

const Sponsered = () => {
  return (
    <>
    
     <div className={styles.sponser_title}>our { }
                 <span className={styles.sponser_title2}>Sponsors</span>
      </div>
      <div className={styles.bottom_line}></div>
    <div className={styles.sponser_container}>
    <div className={styles.sponser_all}>
      {SponserImg.map((image, index) => (
        <div key={index}>
          <SponserCard image={image} />
        </div>
      ))}
    </div>
    </div>
    </>
  );
};

export default Sponsered;
