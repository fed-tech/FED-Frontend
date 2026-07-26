import React, { useState, useEffect, useContext, useRef } from "react";
import { EventCard } from "../../components";
import { Button } from "../../components/Core";
import AuthContext from "../../context/AuthContext";
import { api } from "../../services";
import styles from "./styles/AttendancePage.module.scss";
import { IoClose } from "react-icons/io5";
import { FaDownload } from "react-icons/fa";
import { Alert, ComponentLoading } from "../../microInteraction";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";

const AttendancePage = () => {
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [attendedUser, setAttendedUser] = useState(null);
  const [hasShownAlert, setHasShownAlert] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const authCtx = useContext(AuthContext);

  // Refs to prevent duplicate execution & stale closures
  const isProcessingRef = useRef(false);
  const alertShownRef = useRef(false);
  const scannerRef = useRef(null);
  const selectedEventIdRef = useRef(null);

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

  const initializeScanner = () => {
    try {
      const qrScanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
        },
        false
      );

      qrScanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = qrScanner;
      setScanner(qrScanner);
    } catch (error) {
      console.error("Error initializing scanner:", error);
      if (!alertShownRef.current) {
        Alert({
          type: "error",
          message: "Failed to initialize QR scanner",
          position: "top-right",
        });
        alertShownRef.current = true;
        setHasShownAlert(true);
      }
      setShowScanner(false);
    }
  };

  const onScanSuccess = async (decodedText) => {
    if (isProcessingRef.current) {
      return;
    }
    isProcessingRef.current = true;
    setIsScanning(true);

    // Pause scanner immediately to stop further video frames from triggering onScanSuccess
    if (scannerRef.current) {
      try {
        scannerRef.current.pause(true);
      } catch (err) {
        console.warn("Could not pause scanner:", err);
      }
    }

    console.log("QR Code scanned successfully:", decodedText);
    console.log("Selected Event ID:", selectedEventIdRef.current);
    
    try {
      // jwt token from qr code
      const response = await api.post(
        `/api/form/markAttendance`,
        {
          formId: selectedEventIdRef.current,
          token: decodedText,
        },
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        }
      );

      if (response.status === 200) {
        // store user details
        setAttendedUser(response.data.user || response.data);
        setIsSuccess(true);
        if (scannerRef.current) {
          try {
            scannerRef.current.clear();
          } catch (err) {
            console.error("Error clearing scanner on success:", err);
          }
        }
        setShowSuccessModal(true);
        setIsScanning(false);
        
        // show success alert
        Alert({
          type: "success",
          message: "Attendance marked successfully!",
          position: "top-right",
        });
        
        return; // exit early
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
      if (!alertShownRef.current) {
        Alert({
          type: "error",
          message: errorMessage,
          position: "top-right",
        });
        alertShownRef.current = true;
        setHasShownAlert(true);
      }

      // Resume scanning on error since the scan session failed
      if (scannerRef.current) {
        try {
          scannerRef.current.resume();
        } catch (err) {
          console.warn("Could not resume scanner:", err);
        }
      }
      isProcessingRef.current = false;
      alertShownRef.current = false;
    } finally {
      setIsScanning(false);
    }
  };

  const onScanFailure = (error) => {
    console.warn(`QR Code scanning failed: ${error}`);
  };

  const handleScanQR = (eventId) => {
    selectedEventIdRef.current = eventId;
    setSelectedEventId(eventId);
    isProcessingRef.current = false;
    alertShownRef.current = false;
    setShowScanner(true);
    setHasShownAlert(false); // reset alert state
    setIsSuccess(false); // reset success state
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setAttendedUser(null);
    isProcessingRef.current = false;
    alertShownRef.current = false;
    // auto open scanner for next scan
    setTimeout(() => {
      setShowScanner(true);
      setHasShownAlert(false); // reset alert state
      setIsSuccess(false); // reset success state
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
    if (showScanner) {
      initializeScanner();
    }
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (error) {
          console.error("Error clearing scanner in cleanup:", error);
        }
      }
    };
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
                if (scannerRef.current) {
                  try {
                    scannerRef.current.clear();
                  } catch (error) {
                    console.error("Error clearing scanner:", error);
                  }
                }
                setShowScanner(false);
                scannerRef.current = null;
                setScanner(null);
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
              <div id="qr-reader"></div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && attendedUser && (
        <div className={styles.scannerModal}>
          <div className={styles.scannerContent}>
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
        </div>
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