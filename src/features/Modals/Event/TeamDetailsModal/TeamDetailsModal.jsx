import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MdClose, MdGroups, MdPerson, MdEmail, MdSchool, MdCalendarToday } from "react-icons/md";
import { FaCopy, FaCheck } from "react-icons/fa";
import { api } from "../../../../services";
import { Alert, MicroLoading } from "../../../../microInteraction";
import styles from "./style/TeamDetailsModal.module.scss";
import { Dialog } from "../../../../components";
import modalCard from "../../../../components/ui/ModalCard.module.scss";

const TeamDetailsModal = ({ isOpen, onClose, formId, eventTitle }) => {
  const [teamDetails, setTeamDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (isOpen && formId) {
      fetchTeamDetails();
    }
  }, [isOpen, formId]);

  useEffect(() => {
    if (error) {
      Alert({
        type: "error",
        message: error,
        position: "bottom-right",
        duration: 3000,
      });
      setError(null);
    }
  }, [error]);

  const fetchTeamDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(`/api/form/teamDetails/${formId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        setTeamDetails(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch team details");
      }
    } catch (err) {
      console.error("Error fetching team details:", err);
      setError(
        err.response?.data?.message || "Failed to fetch team details. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyTeamCode = async () => {
    try {
      await navigator.clipboard.writeText(teamDetails.teamCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      
      Alert({
        type: "success",
        message: "Team code copied to clipboard!",
        position: "bottom-right",
        duration: 2000,
      });
    } catch (err) {
      console.error("Failed to copy team code:", err);
      setError("Failed to copy team code to clipboard");
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      size="lg"
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
      <div className={`${styles.modal} ${modalCard.card} ${modalCard.cardLg}`}>
        <div className={modalCard.header}>
          <div>
            <div className={modalCard.title}>Team Details</div>
            <div className={modalCard.subtitle}>Review team and member info</div>
          </div>
          <button className={modalCard.closeBtn} onClick={onClose}>
            <MdClose size={18} />
          </button>
        </div>
        <div className={modalCard.divider} />

        <div className={styles.modalContent}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <MicroLoading />
              <p>Loading team details...</p>
            </div>
          ) : teamDetails ? (
            <>
              <div className={styles.eventInfo}>
                <h3>{eventTitle || teamDetails.eventTitle}</h3>
              </div>

              <div className={styles.teamInfo}>
                <div className={styles.teamHeader}>
                  <MdGroups size={24} color="#f97507" />
                  <h4>Team Information</h4>
                </div>
                
                <div className={styles.teamDetails}>
                  <div className={styles.teamDetailItem}>
                    <span className={styles.label}>Team Name:</span>
                    <span className={styles.value}>{teamDetails.teamName}</span>
                  </div>
                  
                  <div className={styles.teamDetailItem}>
                    <span className={styles.label}>Team Code:</span>
                    <div className={styles.teamCodeContainer}>
                      <span className={styles.teamCode}>{teamDetails.teamCode}</span>
                      <button 
                        className={styles.copyButton} 
                        onClick={copyTeamCode}
                        title="Copy team code"
                      >
                        {copiedCode ? <FaCheck size={16} /> : <FaCopy size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.teamDetailItem}>
                    <span className={styles.label}>Team Size:</span>
                    <span className={styles.value}>
                      {teamDetails.teamSize} / {teamDetails.maxTeamSize}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.membersSection}>
                <div className={styles.membersHeader}>
                  <MdPerson size={24} color="#f97507" />
                  <h4>Team Members ({teamDetails.members.length})</h4>
                </div>
                
                <div className={styles.membersList}>
                  {teamDetails.members.map((member, index) => (
                    <div key={member.id} className={styles.memberCard}>
                      <div className={styles.memberAvatar}>
                        {member.img ? (
                          <img src={member.img} alt={member.name} />
                        ) : (
                          <div className={styles.avatarPlaceholder}>
                            {member.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.memberInfo}>
                        <h5 className={styles.memberName}>{member.name || "Unknown"}</h5>
                        
                        <div className={styles.memberDetails}>
                          <div className={styles.memberDetail}>
                            <MdEmail size={16} />
                            <span>{member.email}</span>
                          </div>
                          
                          {member.rollNumber && (
                            <div className={styles.memberDetail}>
                              <MdPerson size={16} />
                              <span>Roll: {member.rollNumber}</span>
                            </div>
                          )}
                          
                          {member.college && (
                            <div className={styles.memberDetail}>
                              <MdSchool size={16} />
                              <span>{member.college}</span>
                            </div>
                          )}
                          
                          {member.year && (
                            <div className={styles.memberDetail}>
                              <MdCalendarToday size={16} />
                              <span>Year: {member.year}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className={styles.errorContainer}>
              <p>No team details available</p>
            </div>
          )}
        </div>

        <div className={modalCard.footer}>
          <button className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
};

TeamDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  eventTitle: PropTypes.string,
};

export default TeamDetailsModal;
