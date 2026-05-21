import { useRef, useEffect, useState } from "react";
import styles from "./styles/Feedback.module.scss";
import feedbackData from "../../../data/Feedback.json";
import { FaQuoteLeft } from "react-icons/fa";

const Feedback = () => {
  const trackRef = useRef(null);

  const FeedbackCard = ({ item }) => {
    const [expanded, setExpanded] = useState(false);

    const shortText =
      item.quote.length > 180
        ? item.quote.slice(0, 150) + "..."
        : item.quote;

    return (
      <div className={styles.card}>
        <FaQuoteLeft className={styles.quoteIcon} />

        <p
          className={styles.text}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? item.quote : shortText}
          {item.quote.length > 150 && !expanded && (
            <span className={styles.more}> read more</span>
          )}
        </p>

        <div className={styles.author}>
          <h4>{item.title}</h4>
          <span>{item.post}</span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const track = trackRef.current;
    const pause = () => (track.style.animationPlayState = "paused");
    const run = () => (track.style.animationPlayState = "running");

    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", run);

    return () => {
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", run);
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2>
          Testimonials <span>Voices</span>
        </h2>
        <div className={styles.line}></div>
      </div>

      <div className={styles.marquee}>
        <div className={styles.track} ref={trackRef}>
          {[...feedbackData, ...feedbackData].map((item, i) => (
            <FeedbackCard key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feedback;