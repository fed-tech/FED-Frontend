import React, { useState } from "react";
import styles from "../styles/TeamManagement.module.scss";
import { Dialog } from "../../../components";
import modalCard from "../../../components/ui/ModalCard.module.scss";

const ConfirmDialog = ({ isOpen, title, message, confirmText, onConfirm, onCancel }) => {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={isOpen}
            size="sm"
            onOpenChange={(next) => {
                if (!next) onCancel();
            }}
            contentStyle={{
                "--dialog-padding": "0",
                "--dialog-surface": "transparent",
                "--dialog-border": "none",
                "--dialog-shadow": "none",
            }}
        >
            <div className={`${styles.dialogContent} ${modalCard.card}`}>
                <h3 className={styles.dialogTitle}>{title}</h3>
                <p className={styles.dialogMessage}>{message}</p>
                <div className={styles.dialogActions}>
                    <button
                        className={styles.dialogCancel}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Stay
                    </button>
                    <button
                        className={styles.dialogConfirm}
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

export default ConfirmDialog;
