import React, { useState, useEffect, useContext, useRef } from "react";
import { Dialog, EventCard } from "../../components";
import modalCard from "../../components/ui/ModalCard.module.scss";
import { Button } from "../../components/Core";
import AuthContext from "../../context/AuthContext";
import { api } from "../../services";
import styles from "./styles/AttendancePage.module.scss";
import { IoClose } from "react-icons/io5";
import { FaDownload } from "react-icons/fa";
import { Alert, ComponentLoading } from "../../microInteraction";
import BarcodeScanner from "react-qr-barcode-scanner";

const AttendancePage = () => {
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [attendedUser, setAttendedUser] = useState(null);
  const [hasShownAlert, setHasShownAlert] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const isProcessingScanRef = useRef(false);
  const lastScanRef = useRef({ text: "", time: 0 });
  const SCAN_DEBOUNCE_MS = 1500;
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/api/form/getAllForms");
        if (response.status === 200) {
          const fetchedEvents = response.data.events;

          // sort events by priority, date, and title
          const sortedEvents = fetchedEvents.sort((a, b) => {
            const priorityA = parseInt(a.info.eventPriority, 10);
            const priorityB = parseInt(b.info.eventPriority, 10);
            const dateA = new Date(a.info.eventDate);
            const dateB = new Date(b.info.eventDate);
            const titleA = a.info.eventTitle || "";
            const titleB = b.info.eventTitle || "";

            if (priorityA !== priorityB) return priorityA - priorityB;
            if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
            return titleA.localeCompare(titleB);
          });

          const ongoing = sortedEvents.filter(e => !e.info.isEventPast);
          const past = sortedEvents
            .filter(e => e.info.isEventPast)
            .sort((a, b) => new Date(b.info.eventDate) - new Date(a.info.eventDate));

          setOngoingEvents(ongoing);
          setPastEvents(past);
        } else {
          setError("Error fetching events");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Error fetching events");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const onScanSuccess = async (decodedText) => {
    if (isProcessingScanRef.current) return;
    if (!selectedEventId) return;

    isProcessingScanRef.current = true;
    setIsScanning(true);
    
    try {
      // jwt token from qr code
      const response = await api.post(
        `/api/form/markAttendance`,
        {
          formId: selectedEventId,
          token: decodedText,
        },
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        }
      );

      if (response.status === 200) {
        setAttendedUser(response.data.user || response.data);
        setIsSuccess(true);
        setShowScanner(false);
        setShowSuccessModal(true);

        Alert({
          type: "success",
          message: "Attendance marked successfully!",
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      let errorMessage = "Failed to verify QR code";
      
      if (error.response?.status === 401) {
        errorMessage = "Invalid or expired QR code";
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || "Invalid request";
      } else if (error.response?.status === 404) {
        errorMessage = "Attendance record not found";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to mark attendance";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      // show error alert
      if (!hasShownAlert) {
        Alert({
          type: "error",
          message: errorMessage,
          position: "top-right",
        });
        setHasShownAlert(true);
      }
    } finally {
      setIsScanning(false);
      isProcessingScanRef.current = false;
    }
  };

  const onScannerUpdate = (error, result) => {
    if (error) {
      const errorText = error?.message || "";
      const errorName = error?.name || "";
      const isPermissionIssue =
        errorName === "NotAllowedError" ||
        /permission|denied|notallowed/i.test(errorText);

      if (isPermissionIssue && !hasShownAlert) {
        Alert({
          type: "error",
          message: "Camera permission denied. Please allow camera access.",
          position: "top-right",
        });
        setHasShownAlert(true);
      }
      return;
    }

    const decodedText = result?.text || result?.getText?.();
    if (!decodedText) return;

    const now = Date.now();
    if (isProcessingScanRef.current) return;
    if (
      lastScanRef.current.text === decodedText &&
      now - lastScanRef.current.time < SCAN_DEBOUNCE_MS
    ) {
      return;
    }

    lastScanRef.current = { text: decodedText, time: now };
    onScanSuccess(decodedText);
  };

  const handleScanQR = (eventId) => {
    setSelectedEventId(eventId);
    setShowScanner(true);
    setHasShownAlert(false);
    setIsSuccess(false);
    isProcessingScanRef.current = false;
    lastScanRef.current = { text: "", time: 0 };
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setAttendedUser(null);
    setTimeout(() => {
      setShowScanner(true);
      setHasShownAlert(false);
      setIsSuccess(false);
      isProcessingScanRef.current = false;
      lastScanRef.current = { text: "", time: 0 };
    }, 100);
  };



  const handleDownloadAttendance = async (eventId) => {
    try {
      const response = await api.get(`/api/form/export-attendance/${eventId}?format=xlsx`, {
        headers: { Authorization: `Bearer ${authCtx.token}` },
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "text/xlsx" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `attendance_${eventId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      Alert({
        type: "success",
        message: "Attendance file downloaded successfully!",
        position: "top-right",
      });
    } catch (error) {
      let errorMessage = "Failed to download attendance file";
      
      if (error.response?.status === 403) {
        errorMessage = "You don't have permission to download attendance data";
      } else if (error.response?.status === 404) {
        errorMessage = "Attendance data not found for this event";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      // show error alert
      if (!isSuccess && !hasShownAlert) {
        Alert({
          type: "error",
          message: errorMessage,
          position: "top-right",
        });
        setHasShownAlert(true);
      }
      console.error("Download error:", error);
    }
  };

  const renderOngoingActions = (event) => (
    <div className={styles.actionButtons}>
      <Button onClick={() => handleScanQR(event.id)} variant="primary">
        Scan QR
      </Button>
      <Button
        onClick={() => handleDownloadAttendance(event.id)}
        variant="secondary"
        style={{
          padding: "8px 16px",
          backgroundColor: "rgba(255, 138, 0, 0.9)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <FaDownload size={18} />
        Attendance
      </Button>

    </div>
  );

  const renderPastActions = (event) => (
    <div className={styles.actionButtons}>
      <Button
        onClick={() => handleDownloadAttendance(event.id)}
        variant="secondary"
        style={{ padding: "8px 16px", backgroundColor: "rgba(255, 138, 0, 0.9)" }}
      >
        <FaDownload size={18} />
         Attendance
      </Button>
    </div>
  );

  useEffect(() => {
    if (!showScanner) {
      isProcessingScanRef.current = false;
      lastScanRef.current = { text: "", time: 0 };
    }
  }, [showScanner]);

  if (isLoading) {
    return (
      <ComponentLoading
        customStyles={{
          width: "100%",
          height: "100%",
          display: "flex",
          marginTop: "10rem",
          marginBottom: "10rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Event Attendance</h2>

      {showScanner && (
        <div className={styles.scannerModal}>
          <div className={styles.scannerContent}>
            <button
              className={styles.closeButton}
              onClick={() => {
                setShowScanner(false);
                isProcessingScanRef.current = false;
                lastScanRef.current = { text: "", time: 0 };
              }}
            >
              <IoClose />
            </button>
            <h3 className={styles.scannerTitle}>Scan QR Code</h3>
            <div className={styles.scannerArea}>
              {isScanning && (
                <div className={styles.scanningOverlay}>
                  <div className={styles.scanningText}>Processing QR Code...</div>
                </div>
              )}
              <div className={styles.scannerViewport}>
                <BarcodeScanner
                  width={460}
                  height={300}
                  onUpdate={onScannerUpdate}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && attendedUser && (
        <Dialog
          open
          size="sm"
          onOpenChange={(next) => {
            if (!next) handleCloseSuccessModal();
          }}
          contentStyle={{
            "--dialog-padding": "0",
            "--dialog-surface": "transparent",
            "--dialog-border": "none",
            "--dialog-shadow": "none",
          }}
        >
          <div className={`${styles.scannerContent} ${modalCard.card}`}>
            <button
              className={styles.closeButton}
              onClick={handleCloseSuccessModal}
            >
              <IoClose />
            </button>
            <div className={styles.successContent}>
              <div className={styles.successIcon}>✓</div>
              <h3 className={styles.successTitle}>Attendance Marked Successfully!</h3>
              
              <div className={styles.buttonGroup}>
                <Button 
                  onClick={handleCloseSuccessModal} 
                  variant="primary"
                  style={{ padding: "10px 20px" }}
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* Ongoing Events */}
      {ongoingEvents.length > 0 && (
        <>
          <h3>Ongoing Events</h3>
          <div className={styles.eventGrid}>
            {ongoingEvents.map((event) => (
              <div key={event.id} className={styles.eventWrapper}>
                <EventCard
                  data={event}
                  type="ongoing"
                  modalpath="/Events/"
                  isLoading={false}
                  showRegisterButton={false}
                  showShareButton={false}
                  additionalContent={renderOngoingActions(event)}
                  onOpen={() => { }} // fixed
                  customStyles={{
                    eventname: { fontSize: "1.2rem" },
                    registerbtn: { width: "8rem", fontSize: ".721rem" },
                    eventnamep: { fontSize: "0.7rem" },
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <>
          <h3 style={{ marginTop: "2rem" }}>Past Events</h3>
          <div className={styles.eventGrid}>
            {pastEvents.map((event) => (
              <div key={event.id} className={styles.eventWrapper}>
                <EventCard
                  data={event}
                  type="past"
                  modalpath="/Events/pastEvents/"
                  isLoading={false}
                  showRegisterButton={false}
                  showShareButton={false}
                  additionalContent={renderPastActions(event)}
                  onOpen={() => { }} // fixed
                  customStyles={{
                    eventname: { fontSize: "1.2rem" },
                    registerbtn: { width: "8rem", fontSize: ".721rem" },
                    eventnamep: { fontSize: "0.7rem" },
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AttendancePage;
