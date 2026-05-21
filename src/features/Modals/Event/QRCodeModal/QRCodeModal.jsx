import React, { useState, useEffect, useContext } from "react";
import { X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import AuthContext from "../../../../context/AuthContext";
import { RecoveryContext } from "../../../../context/RecoveryContext";
import { api } from "../../../../services";
import style from "./styles/QRCodeModal.module.scss";
import { Dialog } from "../../../../components";

const QRCodeModal = ({ onClose, eventId }) => {
  const [qrCodeData, setQrCodeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const authCtx = useContext(AuthContext);
  const recoveryCtx = useContext(RecoveryContext);

  useEffect(() => {
    fetchAttendanceCode();
  }, [eventId]);

  const fetchAttendanceCode = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const teamCode = recoveryCtx.teamCode;

      let url = `/api/form/attendanceCode/${eventId}`;
      if (teamCode && teamCode.trim() !== "") {
        url += `?teamCode=${encodeURIComponent(teamCode)}`;
      }

      const token = localStorage.getItem("token");

      const response = await api.get(url, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        setQrCodeData(response.data.attendanceToken);
      } else {
        throw new Error("Failed to fetch attendance code");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to generate QR code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
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
      <div className={style.qrContainer}>
        <div className={style.card}>
          <div className={style.header}>
            <div className={style.title}>Attendance QR Code</div>
            <div onClick={onClose} className={style.closebtn}>
              <X size={18} color="#ffffff" />
            </div>
          </div>

          <div className={style.content}>
            {isLoading ? (
              <div className={style.loadingContainer}>
                <div className={style.spinner}></div>
                <p>Generating QR Code...</p>
              </div>
            ) : error ? (
              <div className={style.errorContainer}>
                <p>{error}</p>
                <button onClick={fetchAttendanceCode} className={style.retryBtn}>
                  Try Again
                </button>
              </div>
            ) : qrCodeData ? (
              <div className={style.qrContent}>
                <div className={style.qrWrapper}>
                  <QRCodeSVG
                    value={qrCodeData}
                    size={200}
                    level="M"
                    className={style.qrCode}
                    includeMargin
                    fgColor="#000000"
                    bgColor="#ffffff"
                  />
                </div>

                <div className={style.codeInfo}>
                  <p className={style.instruction}>
                    Show this QR code to event organizers for attendance verification.
                  </p>
                  <p className={style.instruction}>
                    This QR code can be used only once. Do not share it.
                  </p>
                </div>
              </div>
            ) : (
              <div className={style.noCodeContainer}>
                <p>No attendance code available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default QRCodeModal;