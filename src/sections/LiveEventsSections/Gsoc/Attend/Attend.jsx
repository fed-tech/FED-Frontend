/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import style from "./styles/Attend.module.scss";


function Card({ img, title }) {
  return (
    <motion.div
      className={style.card}
      initial={{ opacity: 0, y: 50, scale: 0.5 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      
      <div className={style.card_img}>
        <img src="https://cdn.prod.website-files.com/66ffb182a2a1dbe73904d0b5/6762e8c9def45dc9b4f13f25_images-removebg-preview.png" alt="Event Image" />
      </div>
      <div className={style.card_content}>
        <h2>{title}</h2>
        
      </div>
    </motion.div>
  );
}

function Attend() {
  return (
    <>
      <div className={style.main}>
        <div className={style.heading}>
          <div className={style.why}><h1>WHY ATTEND <span style={{color:"#F48424"}}>THIS SESSION</span></h1></div>
          {/* <div className={style.omega}><h1>THIS SESSION</h1></div> */}
        </div>

        <div className={style.boxmain}>
          <Card img="https://uploads-ssl.webflow.com/663d1907e337de23e83c30b2/66b5fc073c4fe7b17fd35209_image%20(14).png"  title="Making Impactful Contributions " />
          <Card img="https://uploads-ssl.webflow.com/663d1907e337de23e83c30b2/66b5faa63c233fc6529719c3_image%20(10).png" title="Community Engagement" />
          <Card img="https://uploads-ssl.webflow.com/663d1907e337de23e83c30b2/66b5faa776cf7e0c97524f2b_image%20(9).png" title="Strategic Preparation" />
          <Card img="https://uploads-ssl.webflow.com/663d1907e337de23e83c30b2/66b5faa63c233fc6529719c3_image%20(10).png" title="Interactive Real-Time Q&A" />
        </div>
      </div>

      <div className={style.circle1}></div>
      <div className={style.circle2}></div>
    </>
  );
}

export default Attend;
