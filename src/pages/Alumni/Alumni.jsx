import React from "react";
import styles from "./styles/Alumni.module.scss"; // Adjust the path to your styles
import alumniData from "../../data/AlumniCard.json"; // Import the JSON data

const Alumni = () => {
  console.log(alumniData); // Log the data to check its structure

  const Alumnis = ({ name, image, social }) => {
    return (
      <div className={styles.alumni}>
        <div className={styles["alumni-inner"]}>
          <div className={styles["alumni-front"]}>
            <img src={image} alt={name} className={styles["alumni-img"]} />
            <div className={styles["alumni-info"]}>
              <h3 style={{ color: "#FF5C00" }}>{name}</h3>
            </div>
          </div>
          <div className={styles["alumni-back"]}>
            <div className={styles["social-links"]}>
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              )}
              {social.github && (
                <a href={social.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AlumniSection = ({ alumni }) => {
    return (
      <div className={styles["alumni-section"]}>
        <div className={styles["alumni-grid"]}>
          {alumni.map((each, idx) => (
            <Alumnis
              key={idx}
              name={each.name}
              image={each.image}
              social={each.social}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.Alumni}>
      <h2>
        Meet Our <span>Alumni</span>
      </h2>
      <div className={styles.circle}></div>

      <AlumniSection alumni={alumniData} />

      <div className={styles.circle2}></div>
    </div>
  );
};

export default Alumni;
