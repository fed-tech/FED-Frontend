import React from 'react';
import styles from './Styles/Contact.module.scss';
import contactImg from "../../data/images/contact.png";

const ContactForm = () => {
  return (
    <div className={styles['contact-form-container']}>
        <h2>GET <span className={styles['highlight']}>IN</span> TOUCH</h2>
        <div className={styles.bottom_line}></div>
      <div className={styles['form-section']}>
        <form>
          <div className={styles['form-group']}>
            <input type="text" name="name" placeholder="Name" />
          </div>
          <div className={styles['form-group']}>
            <input type="email" name="email" placeholder="Email" />
          </div>
          <div className={styles['form-group']}>
            <textarea type="text" name="message" placeholder="Message"></textarea>
          </div>
          <button type="submit">Submit</button>
        </form>
         <div className={styles['image-section']}>
            <div className={styles['backCircle']}></div>
            
          <img src={contactImg} alt="To Fed" />
          <div className={styles['gola']}></div>
       </div> 
      </div>
      
    </div>
    
  );
};

export default ContactForm;
