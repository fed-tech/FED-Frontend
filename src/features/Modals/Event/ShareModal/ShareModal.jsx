import React, { useEffect } from "react";
import { ShareSocial } from "react-share-social";
import style from "./styles/ShareModal.module.scss";
import { X } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Dialog } from "../../../../components";

const Share = ({ onClose, urlpath, teamData }) => {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  const shareUrl = urlpath ? urlpath : teamData?.teamCode;
  const titleText = urlpath ? "Share Link" : teamData?.teamName;
  const subtitleText = urlpath
    ? "Send this link to others"
    : "Invite others using this code";

  const sharestyle = {
    root: {
      background: "transparent",
      borderRadius: "0",
      border: "none",
      width: "100%",
      height: "auto",
      boxShadow: "none",
      padding: "0",
      color: "#ffffff",
    },
    copyContainer: {
      border: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(255,255,255,0.04)",
      borderRadius: "10px",
      padding: "0.75rem 1rem",
      margin: "1rem 0",
      fontSize: "0.85rem",
      color: "#ffffff",
    },
    copyUrl: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    title: {
      display: "none",
    },
  };

  return (
    <Dialog
      open
      size="sm"
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      contentStyle={{
        "--dialog-padding": "0",
        "--dialog-surface": "transparent",
        "--dialog-border": "none",
        "--dialog-shadow": "none",
      }}
    >
      <div className={style.maindiv}>
        <div className={style.card}>
          <div className={style.header}>
            <div className={style.titleWrapper}>
              <div className={style.title}>{titleText}</div>
              <div className={style.subtitle}>{subtitleText}</div>
            </div>

            <div onClick={onClose} className={style.closebtn}>
              <X size={18} color="#ffffff" />
            </div>
          </div>

          <div className={style.divider} />

          <ShareSocial
            url={shareUrl}
            style={sharestyle}
            socialTypes={[
              "facebook",
              "twitter",
              "whatsapp",
              "reddit",
              "linkedin",
            ]}
            onSocialButtonClicked={(data) => console.log(data)}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default Share;