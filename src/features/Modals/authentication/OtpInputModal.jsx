import React from "react";
import OtpInput from "../../../components/OtpInput/OtpInput";
import { X } from "lucide-react";
import { Dialog } from "../../../components";
import modalCard from "../../../components/ui/ModalCard.module.scss";

const OtpInputModal = (props) => {
  const { onVerify, handleClose } = props;

  return (
    <Dialog
      open
      size="sm"
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
      contentStyle={{
        "--dialog-padding": "0",
        "--dialog-surface": "transparent",
        "--dialog-border": "none",
        "--dialog-shadow": "none",
      }}
    >
      <div className={`${modalCard.card} ${modalCard.cardLg}`}>
        <div className={modalCard.header}>
          <div>
            <div className={modalCard.title}>OTP Verification</div>
            <div className={modalCard.subtitle}>Enter the code to continue</div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className={modalCard.closeBtn}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className={modalCard.divider} />
        <OtpInput
          isSignUp={true}
          onHandleVerfiy={onVerify}
          handleClose={handleClose}
        />
      </div>
    </Dialog>
  );
};

export default OtpInputModal;
