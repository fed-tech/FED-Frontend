import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion'; // Import motion and useAnimation
import { useInView } from 'react-intersection-observer'; // Import useInView
import { InstagramEmbed } from 'react-social-media-embed';
import { LinkedInEmbed } from 'react-social-media-embed';
import linkedinlogo from '../../assets/images/SocialMedia/linkedinLogo.svg';
import instalogo from '../../assets/images/SocialMedia/instaLogo.svg';
import styles from './styles/Social.module.scss';


const SocialMedia = () => {

    const getBoxVariant = () => {
        return {
          visible: { opacity: 1, y: 0, transition: { duration: 1.2 } },
          hidden: { opacity: 0, y: 50 }  
        };
      };
      
      const AnimatedBox = ({ children }) => {
        const control = useAnimation();
        const [ref, inView] = useInView({
          triggerOnce: true,  // Trigger only once
          threshold: 0.3,
        });
      
        useEffect(() => {
          control.start('visible'); 
        }, [control]);
      
        useEffect(() => {
          if (inView) {
            control.start('visible');
          } else{
            control.start('hidden');  
          }
        }, [control, inView]);
      
        return (
          <motion.div
            ref={ref}
            variants={getBoxVariant()}
            initial="hidden"
            animate={control}
          >
            {children}
          </motion.div>
        );
      };
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
        setViewportWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, []);
    const calculateInstagramWidth = () => {
        if (viewportWidth >= 1200) {
        return 348.45;
        } else if (viewportWidth >= 768) {
        return 330; 
        } else {
        return 360; 
        }
    };

    const calculateInstagramReelWidth = () => {
        if (viewportWidth >= 1200) {
        return 446.61;
        } else if (viewportWidth >= 768) {
        return 400; 
        } else {
        return 360; 
        }
    };

    const calculateLinkedInWidth = () => {
        if (viewportWidth >= 1200) {
        return 468;
        } else if (viewportWidth >= 768) {
        return 400; 
        } else {
        return 360; 
        }
    };

    return (
        
        <div className={styles.socialMcontainer}>
            <div className={styles.text}>
            <div className={styles.circleCenter}></div>
            <p className={styles.content}>
                Welcome to the social media page of <br />
                <div className={styles.fed}>
                <span className={styles.highlight} id={styles.faded}>
                <img className={instalogo} src={instalogo} alt="Profile" /> FED <img className={linkedinlogo} src={linkedinlogo} alt="Profile" />
                </span>
                </div>
                <br />
            </p>
            </div>

            <div className={styles.socialMedia}>
            <div className={styles.container}>
                <div className={styles.leftColumn}>
                <div className={styles.sidebyside}>
                    <div className={styles.instagramfeed}>
                    <AnimatedBox>
                    <InstagramEmbed url="https://www.instagram.com/p/C7Bxq3-rcK7/?hl=en" height={350} width={calculateInstagramWidth()} />
                    </AnimatedBox>
                    </div>
                    <div className={styles.instagramfeed2}>
                    <AnimatedBox>
                    <InstagramEmbed url="https://www.instagram.com/p/C7B73kprfBd/?hl=en" height={350} width={calculateInstagramWidth()} />
                    </AnimatedBox>
                    <div className={styles.circle}></div>
                    </div>
                </div>
                </div>
                <div className={styles.centerColumn}>
                <div className={styles.instagramreel}>
                    <AnimatedBox>
                    <InstagramEmbed url="https://www.instagram.com/p/C7ErB7-SmV-/?hl=en" height={730} width={calculateInstagramReelWidth()} />
                    </AnimatedBox>
                </div>
                </div>
                <div className={styles.rightColumn}>
                <div className={styles.linkedinfeed}>
                    <div className={styles.circle1}></div>
                    <AnimatedBox>
                    <LinkedInEmbed
                    url="https://www.linkedin.com/embed/feed/update/urn:li:share:7196928173924655106"
                    postUrl="https://www.linkedin.com/posts/fedkiit_kiituniversity-fed-productdesign-activity-7196928174897700864-flSC?utm_source=share&utm_medium=member_desktop"
                    width={calculateLinkedInWidth()}
                    height={730}
                    />
                    </AnimatedBox>
                </div>
                </div>
            </div>
            </div>

        </div>
  );
};

export default SocialMedia;