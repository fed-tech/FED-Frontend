import React, { useRef, useEffect } from 'react';
import styles from './styles/Feedback.module.scss';
import { feedbackEach } from '../../../data/feedback';
import quoteImg from "../../../assets/images/quote.png";



const Feedback = () => {
  const feedbacksRef = useRef(null);

  const FeedbackCard = ({ quote }) => {
    return (
      <div className={styles['feedback-card']}>
        <p className={styles['feedback-text']}>{quote.quote}</p>
        <p className={styles['feedback-author']}>{quote.title}</p>
        <p className={styles['feedback-ev']}>{quote.post}</p>
      </div>
    );
  };

  useEffect(() => {
    const feedbacksContainer = feedbacksRef.current;
    const handleMouseEnter = () => {
      feedbacksContainer.style.animationPlayState = 'paused'; //stop on hovering
    };
    const handleMouseLeave = () => {
      feedbacksContainer.style.animationPlayState = 'running'; 
    };

    feedbacksContainer.addEventListener('mouseenter', handleMouseEnter);
    feedbacksContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      feedbacksContainer.removeEventListener('mouseenter', handleMouseEnter);
      feedbacksContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className={styles['feedback-container']}>
      <img className={styles['upQuote']} src={quoteImg} alt="Up Quote" />
      <div className={styles.heading}>
        <h2>FEEDBACK ON <span className={styles.highlight}>US</span></h2>
        <div className={styles.bottom_line}></div>
      </div>
      <div className={styles['feedbacks-container']}>
        <div className={styles.feedbacks} ref={feedbacksRef}>
          {feedbackEach.map((quote, index) => (
            <FeedbackCard key={index} quote={quote} />
          ))}
        </div>
      </div>
      <img className={styles['downQuote']} src={quoteImg} alt="Down Quote" />
    </div>
  );
};

export default Feedback;