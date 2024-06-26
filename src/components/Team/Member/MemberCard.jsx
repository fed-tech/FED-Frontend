import React, { useState } from 'react';
import styles from './styles/MemberCard.module.scss';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const MemberCard = ({
  name,
  image,
  social,
  title,
  role,
  know,
  customStyles = {},
}) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className={`${styles.teamMember} ${customStyles.teamMember}`}>
      <div className={`${styles.teamMemberInner} ${customStyles.teamMemberInner}`}>
        <div className={`${styles.teamMemberFront} ${customStyles.teamMemberFront}`}>
          <img
            src={image}
            alt={`Profile of ${name}`}
            className={`${styles.teamMemberImg} ${customStyles.teamMemberImg}`}
          />
          <div className={`${styles.teamMemberInfo} ${customStyles.teamMemberInfo}`}>
            <h4 style={{ color: '#000' }}>{name}</h4>
          </div>
        </div>
        <div className={`${styles.teamMemberBack} ${customStyles.teamMemberBack}`}>
          {!showMore ? (
            <>
              <h5 style={{ color: '#fff' }}>{title}</h5>
              <div className={`${styles.socialLinks} ${customStyles.socialLinks}`}>
                {social.linkedin && (
                  <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                  </a>
                )}
                {social.github && (
                  <a href={social.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub />
                  </a>
                )}
              </div>
              {role === 'Director' && (
                <button
                  onClick={() => setShowMore(true)}
                  aria-expanded={showMore}
                  className={customStyles.button}
                >
                  Know More
                </button>
              )}
            </>
          ) : (
            <div className={`${styles.knowMoreContent} ${customStyles.knowMoreContent}`}>
              <div className={`${styles.knowPara} ${customStyles.knowPara}`}>
                <p>{know}</p>
              </div>
              <button
                onClick={() => setShowMore(false)}
                aria-expanded={showMore}
                className={customStyles.button}
              >
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
