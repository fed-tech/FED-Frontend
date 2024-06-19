import React, { useState } from 'react';
import styles from './styles/MemberCard.module.scss';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const MemberCard = ({ name, image, social, title, role, know }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className={styles.teamMember}>
      <div className={styles.teamMemberInner}>
        <div className={styles.teamMemberFront}>
          <img src={image} alt={`Profile of ${name}`} className={styles.teamMemberImg} />
          <div className={styles.teamMemberInfo}>
            <h4 style={{ color: '#000' }}>{name}</h4>
          </div>
        </div>
        <div className={styles.teamMemberBack}>
          {!showMore ? (
            <>
              <h5 style={{ color: '#fff' }}>{title}</h5>
              <div className={styles.socialLinks}>
                {social.linkedin && (
                  <a href={social.linkedin} target="_blank" rel="social">
                    <FaLinkedin />
                  </a>
                )}
                {social.github && (
                  <a href={social.github} target="_blank" rel="social">
                    <FaGithub />
                  </a>
                )}
              </div>
              {role === 'Director' && (
                <button onClick={() => setShowMore(true)} aria-expanded={showMore}>
                  Know More
                </button>
              )}
            </>
          ) : (
            <div className={styles.knowMoreContent}>
              <div className={styles.knowPara}>
                <p>{know}</p>
              </div>
              <button onClick={() => setShowMore(false)} aria-expanded={showMore}>
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
