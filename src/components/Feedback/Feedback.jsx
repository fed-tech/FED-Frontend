import React, { useRef } from 'react';
import { feedbackEach } from '../../data/feedback';
import styles from './Styles/Feedback.module.scss';
import quoteImg from "../../data/images/quote.png";

const FeedbackCard = ({ quote }) => {
  return (
    <div className={styles['feedback-card']}>
      <p className={styles['feedback-text']}>{quote.quote}</p>
      <p className={styles['feedback-author']}>{quote.title}</p>
      <p className={styles['feedback-ev']}>{quote.post}</p>
    </div>
  );
};

const Feedback = () => {
  const feedbackContainerRef = useRef(null);

  const scrollLeft = () => {
    feedbackContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    feedbackContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className={styles['feedback-container']}>
      <img className={styles['upQuote']} src={quoteImg} alt="To Fed" />
        <div className={styles.heading}>
      <h2>FEEDBACK ON <span className={styles.highlight}>US</span></h2>
      <div className={styles.bottom_line}></div>
      </div>
      <div className={styles.feedbacks} ref={feedbackContainerRef}>
        {feedbackEach.map((quote, index) => (
          <FeedbackCard key={index} quote={quote} />
        ))}
      </div>
      <div className={styles['button-container']}>
        <button className={styles['scroll-button']} onClick={scrollLeft}>Left</button>
        <button className={styles['scroll-button']} onClick={scrollRight}>Right</button>
      </div>
      <img className={styles['downQuote']} src={quoteImg} alt="To Fed" />
    </div>
  );
};

export default Feedback;
