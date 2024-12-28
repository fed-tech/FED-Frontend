/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import styles from "./styles/ShareTeamData.module.scss";
import { X } from "lucide-react";
import JSConfetti from "js-confetti";

const jsConfetti = new JSConfetti();

const ShareTeamData = ({ onClose, teamData, successMessage }) => {
  const { teamName, teamCode } = teamData;
  const [copyText, setCopyText] = useState("Copy");

  const message = `Congratulations! Your team "${teamName}" with code "${teamCode}" has been successfully registered!🎉🎉`;
  const websiteUrl = window.location.href; // Replace this with your actual website URL

  // Trigger confetti effect when the modal opens
  useEffect(() => {
    jsConfetti.addConfetti({
      // emojis: ["🎉", "✨", "🎈", "🔥"],
      confettiColors: ["#FF8A00", "#FFD700", "#FF4500", "#FF69B4"],
    });
  }, []); // Empty dependency array ensures it runs only on component mount

  const handleCopy = () => {
    const textToCopy = `Team Name: ${teamName}\nTeam Code: ${teamCode}`;
    navigator.clipboard.writeText(textToCopy);
    setCopyText("Copied");
    setTimeout(() => setCopyText("Copy"), 4000); // Reset button text after 4 seconds
  };

  return (
    <div className={styles.shareContainer}>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.maindiv}>
        <div className={styles.closebtn} onClick={onClose}>
          <X />
        </div>
        {/* Conditional rendering for successMessage */}
        {successMessage && (
          <span className={styles.registrationTitle}>
            Registration Successful
          </span>
        )}
        {/* Conditional rendering for teamData */}
        {teamName && teamCode && (
          <div>
            <span className={styles.shareTitle}>Your Team Info</span>
            <div className={styles.copyContainer}>
              <p style={{ color: "#ffffff90", textWrap: "wrap" }}>
                Your Team Name:{" "}
                <span style={{ fontWeight: "bold" }}>{teamName}</span>
                <br />
                Your Team Code:{" "}
                <span style={{ fontWeight: "bold" }}>{teamCode}</span>
              </p>
              <button
                onClick={handleCopy}
                style={{
                  marginLeft: "10px",
                  color: "#ffffff60",
                  background: "#2a2a2a",
                  padding: "0.3rem",
                  borderRadius: "10px",
                }}
              >
                {copyText}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%",
                marginTop: "1rem",
              }}
            >
              <FacebookShareButton
                url={websiteUrl}
                quote={message}
                hashtag="#TeamSuccess"
              >
                <FacebookIcon size={40} round />
              </FacebookShareButton>
              <TwitterShareButton
                url={websiteUrl}
                title={message}
                hashtags={["TeamSuccess"]}
              >
                <TwitterIcon size={40} round />
              </TwitterShareButton>
              <LinkedinShareButton
                url={websiteUrl}
                title="Team Success"
                summary={message}
                source="YourApp"
              >
                <LinkedinIcon size={40} round />
              </LinkedinShareButton>
              <WhatsappShareButton
                url={websiteUrl}
                title={message}
                separator=":: "
              >
                <WhatsappIcon size={40} round />
              </WhatsappShareButton>
            </div>
          </div>
        )}
        {/* Rendering the success message */}
        {successMessage && (
  <div>
    <p
      style={{
        textAlign: "left",
        color: "#ffffff90",
        marginTop: "1rem",
        whiteSpace: "pre-wrap", 
        marginBottom: "0", 
      }}
    >
      {successMessage.successMessage
        .trim() 
        .split(/\s+/) 
        .map((word, index) => {
          const urlPattern = /(https?:\/\/[^\s]+)/;
          const match = word.match(urlPattern); 

          if (match) {
            return (
              <React.Fragment key={index}>
                <br /> 
                <a
                  href={match[0]} 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#FF8A00", textDecoration: "none" }}
                >
                  {match[0]}
                </a>
                <br />
                <br />
              </React.Fragment>
            );
          }
          return <React.Fragment key={index}>{word} </React.Fragment>;
        })}

    </p>
    {/* Add consistent gap between paragraphs */}
    {/* <p
      style={{
        textAlign: "left",
        color: "#ffffff90",
        marginTop: "1rem", // Consistent gap above paragraphs
        marginBottom: "1rem", // Consistent gap below paragraphs
      }}
    >
      This ensures gaps for other content
    </p> */}
  </div>
)}

      </div>
    </div>
  );
};

export default ShareTeamData;
