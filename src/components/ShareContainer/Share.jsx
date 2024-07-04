import React from 'react';
import { ShareSocial } from "react-share-social";
import style from "./style/Share.module.scss";
import { X } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Share = ({ onClose, urlpath }) => {
  const sharestyle = {
    root: {
      background: 'rgba(42, 42, 42, 0.9)', 
      borderRadius: '10px',
      border: '2px solid #444',
      width: '22rem',
      height: '15rem', 
      boxShadow: '0 6px 10px 3px rgba(24, 15, .3)',
      color: 'white',
      padding: '1rem', 
      position: 'relative', 
      display: 'flex',
      flexDirection: 'column', 
      justifyContent: 'center', 
    },
    copyContainer: {
      border: '1px solid blue',
      background: 'rgba(0, 0, 0, 0.4)',
      borderRadius: '5px',
      padding: '0.5rem',
      margin: '0.5rem 0',
      overflow: 'hidden',
    },
    copyUrl: {
      overflowY: 'scroll',
      scrollbarWidth: 'none', // For Firefox
      msOverflowStyle: 'none', // For Internet Explorer and Edge
    },
    title: {
      color: 'aquamarine',
      fontStyle: 'italic',
      marginBottom: '1rem',
    },
  };
  

  return (
    <div className={style.shareContainer}>
      <div className={style.overlay}></div>
      <div data-aos="zoom-in-up" data-aos-duration="500" className={style.maindiv}>
        <div style={{
          position:"relative"
        }}><div
          onClick={onClose}
          className={style.closebtn}
          style={{
            cursor: "pointer",
            position: "absolute",
            right: "1.5rem",
            top: "1.4rem",
            zIndex: "20",
            fontSize: "1.2rem",
            color: "white",
          }}
        >
          <X />
        </div>
        <div style={{
          cursor: "pointer",
          position: "absolute",
          left: "1.5rem",
          top: "1.4rem",
          zIndex: "20",
          fontSize: "1.2rem",
          color: "white",
        }}>Share</div>
        <ShareSocial
          url={urlpath}
          style={sharestyle}
        
          socialTypes={['facebook', 'twitter', 'whatsapp', 'reddit', 'linkedin']}
          onSocialButtonClicked={data => console.log(data)}
        /></div>
        
      </div>
    </div>
  );
}

export default Share;
