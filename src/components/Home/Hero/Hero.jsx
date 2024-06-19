import styles from "./styles/Hero.module.scss";
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react'; 
import CarouselImg from "../../../data/carouselImages";
import Carousel from "./Carousel/Carousel";

function Hero() {

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
    <div className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.hero1}>
          <AnimatedBox direction="left">
            <div className={styles.heroone}>
              <strong>Nurturing <span style={{ color: '#FF8A00' }}>entrepreneurship</span> through creative, authentic, and efficient techniques.</strong> 
            </div>
            <div className={styles.herotwo}>
              <div className={styles.smallcontent}>
                <strong>Nurturing <span style={{ color: '#FF8A00' }}>entrepreneurship</span> through creative, authentic, and efficient techniques.</strong>
              </div>
            </div>
          </AnimatedBox>
        </div>
        <div className={styles.hero2}>
          <Carousel images={CarouselImg} />
        </div>
        <div className={styles.circle}></div>
      </div>
    </div>
  );
}

export default Hero;