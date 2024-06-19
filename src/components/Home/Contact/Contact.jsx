import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './styles/Contact.module.scss';
import contactImg from "../../../assets/images/contact.png";

function ContactForm() {

  const getBoxVariant = (direction) => {
    return {
      visible: { opacity: 1, x: 0, transition: { duration: 1.2 } },
      hidden: { opacity: 0, x: direction === 'left' ? -100 : 100 }
    };
  };

  const AnimatedBox = ({ children, direction }) => {
    const control = useAnimation();
    const [ref, inView] = useInView({
      triggerOnce: false,
      threshold: 0.3,
    });

    useEffect(() => {
      if (inView) {
        control.start('visible');
      } else {
        control.start('hidden');
      }
    }, [control, inView]);

    return (
      <motion.div
        ref={ref}
        variants={getBoxVariant(direction)}
        initial="hidden"
        animate={control}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className={styles.contactFormContainer}>
      <h2>GET <span className={styles.highlight}>IN</span> TOUCH</h2>
      <div className={styles.bottomLine}></div>
      <div className={styles.formSection}>
        <form>
          <div className={styles.formGroup}>
            <input type="text" name="name" placeholder="Name" />
          </div>
          <div className={styles.formGroup}>
            <input type="email" name="email" placeholder="Email" />
          </div>
          <div className={styles.formGroup}>
            <textarea name="message" placeholder="Message"></textarea>
          </div>
          <button type="submit">Submit</button>
        </form>
        <div className={styles.imageSection}>
          <div className={styles.backCircle}></div>
          <AnimatedBox direction="right">
            <img src={contactImg} alt="To Fed" />
          </AnimatedBox>
          <div className={styles.circle}></div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
