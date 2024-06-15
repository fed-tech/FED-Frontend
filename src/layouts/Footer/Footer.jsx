import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

import styles from "./styles/Footer.module.scss"

export default function Footer() {
  return (
    <section id={styles.footer}>
      <footer className={styles.f1}>
        <div className={styles.logodiv}>
          <img
            className={styles.fedlogo}
            src="https://uploads-ssl.webflow.com/629d87f593841156e4e0d9a4/62eeaa9927e6aea4ff13590e_FedLogo.png"
            alt="fedlogo"
          />
          <p className={styles.fed}>FED</p>
        </div>
        <div className={styles.flexdiv}>
          <div className={styles.footerleft}>
            <div className={styles.row1}>
              <h4>Community</h4>

              {/* ContactUs */}

              <HashLink to="/#ContactUs" className={styles.footerleftlink}>
                Contact
              </HashLink>
              <Link to="/Team" className={styles.footerleftlink}>
                Member
              </Link>
              <Link to="/Alumni" className={styles.footerleftlink}>
                Alumni
              </Link>
            </div>
            <div className={styles.row2}>
              <h4>About Us</h4>

              {/* KnowUs */}
              <HashLink smooth to="/#KnowUs" className={styles.footerleftlink}>
                Manifesto
              </HashLink>

              {/* work */}
              <HashLink smooth to="/#work" className={styles.footerleftlink}>
                Partner
              </HashLink>
            </div>
            <div className={styles.row3}></div>
          </div>
                    <div className={styles.terms_and_policies}>
            <div className={styles.tap1Div}>
              <Link to="/T&C" className={styles.Linkstyles}>
                Terms and conditions
              </Link>
            </div>
            <dv className={styles.dotDIv}></dv>
            <div className={styles.tap1Div}>
              <Link to="/PrivacyPolicies" className={styles.Linkstyles}>
                Privacy policy
              </Link>
            </div>
          </div>
          <div className={styles.footerright}>
            <div className={styles.icondiv}>
              <Link to="/"
                className={styles.link1}
                target="_blank"
              >Home</Link>
              <Link to="/Events"
                href="https://www.linkedin.com/company/fedkiit/"
                className={styles.link1}
                target="_blank"
              >Events</Link>
              <Link to="/Social"
                className={styles.link1}
                target="_blank"
              >Social</Link>
              <Link to="/Team"
                className={styles.link1}
                target="_blank"
              >Team</Link>
            </div>
          </div>
        </div>

        <div className={styles.bottomdiv}>
          <div className={styles.bottomleft}>
            <p>
              Made with ❤️              from Federation of Entrepreneurship Development
            </p>
          </div>
        </div>
        <div className={styles.tnpMDiv}>

          <p className={styles.copyrightPTag}>© 2024-2028, fedkiit.com</p>
        </div>
      </footer>
    </section>
  );
}
