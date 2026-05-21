import React, { useState, useEffect } from "react";
import { api } from "../../../services";
import styles from "./styles/Contact.module.scss";
import contactImg from "../../../assets/images/contact.png";
import { Button } from "../../../components";
import { AnimatedBox } from "../../../assets/animations/AnimatedBox";
import { Alert, MicroLoading } from "../../../microInteraction";

const ContactForm = () => {
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
    }
  }, [alert]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await api.post("/api/form/contact", data);

      if (response.status === 200 || response.status === 201) {
        setAlert({
          type: "success",
          message: "Message sent successfully.",
          position: "bottom-right",
          duration: 3000,
        });
        event.target.reset();
      } else {
        throw new Error();
      }
    } catch {
      setAlert({
        type: "error",
        message: "Failed to send message.",
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>
            Get <span>In Touch</span>
          </h2>
          <div className={styles.line}></div>
        </div>

        <div className={styles.grid}>
          <div className={styles.formWrapper}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <input type="text" name="name" placeholder="Your Name" required />
              </div>

              <div className={styles.field}>
                <input type="email" name="email" placeholder="Your Email" required />
              </div>

              <div className={styles.field}>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  required
                ></textarea>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  background: "var(--primary)",
                  color: "#fff",
                  height: "50px",
                  borderRadius: "14px",
                  fontSize: "1rem",
                }}
              >
                {isLoading ? <MicroLoading /> : "Send Message"}
              </Button>
            </form>
          </div>

          <div className={styles.visual}>
            <AnimatedBox direction="right">
              <img src={contactImg} alt="Contact Illustration" />
            </AnimatedBox>
          </div>
        </div>
      </div>
      <Alert />
    </section>
  );
};

export default ContactForm;