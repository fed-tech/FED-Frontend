import { useEffect, useState } from "react";
import StartupCard from "../../components/MSCard/MSCard";
import data from "../../data/MSCarddata.json";
import styles from "./styles/MicroStartup.module.scss";

export default function StartupPage() {
  const [startups, setStartups] = useState([]);

  useEffect(() => {
    setStartups(data);
  }, []);

  return (
    <div>
      <div className={styles.name}>
        <span className={styles.w2}>Introducing FED - </span>
        <span className={styles.w1}>MicroStartups</span>
      </div>

      <p className={styles.description}>
        Microstartups under <span className={styles.highlight}>FED</span> are <strong className={styles.bold}>student-led entrepreneurial ventures</strong> nurtured through <strong className={styles.emphasis}>mentorship</strong>, <strong className={styles.emphasis}>guidance</strong>, and <strong className={styles.emphasis}>ecosystem support</strong> by the <strong className={styles.highlight}>Federation of Entrepreneurship and Development, KIIT TBI</strong>.<br />
        They aim to empower <strong className={styles.emphasis}>innovation</strong>, <strong className={styles.emphasis}>leadership</strong>, and <strong className={styles.emphasis}>real-world experience</strong> among students.
      </p>

      
      <div className={styles.container}>
        <section className={styles.fedCard}>
          {startups.map((startup) => (
            <StartupCard
              key={startup.id}
              title={startup.title}
              subtitle={startup.subtitle}
              description={startup.description}
              logo={startup.logo}
              headerCover={startup.headerCover}
              link={startup.link}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
