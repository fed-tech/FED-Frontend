import { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../../../../components";
import { api } from "../../../../../services";
import { accessOrCreateEventByFormId } from "./tools/certificateTools";
import { Alert, MicroLoading } from "../../../../../microInteraction";
import AuthContext from "../../../../../context/AuthContext";
import styles from "./styles/CertificatesForm.module.scss";

const REQUIRED_FIELDS = [
  {
    fieldName: "name",
    x: 50,
    y: 60,
    fontSize: 42,
    fontColor: "#FFFFFF",
    locked: true,
  },
  {
    fieldName: "qr",
    x: 86,
    y: 82,
    fontSize: 24,
    fontColor: "#FFFFFF",
    locked: true,
  },
];

const createEmptyField = (count) => ({
  fieldName: `field_${count + 1}`,
  x: 50,
  y: 50,
  fontSize: 32,
  fontColor: "#FFFFFF",
  locked: false,
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const ensureRequiredFields = (fields) => {
  const byName = new Map(fields.map((field) => [field.fieldName, field]));

  const required = REQUIRED_FIELDS.map((requiredField) => {
    const existing = byName.get(requiredField.fieldName);
    return existing
      ? {
          ...existing,
          fieldName: requiredField.fieldName,
          locked: true,
        }
      : { ...requiredField };
  });

  const custom = fields.filter(
    (field) => field.fieldName !== "name" && field.fieldName !== "qr"
  );

  return [...required, ...custom];
};

const toMongoFieldPayload = (fields) =>
  ensureRequiredFields(fields).map(({ fieldName, x, y, fontSize, fontColor }) => ({
    fieldName,
    x: Number(clamp(Number(x) || 0, 0, 100).toFixed(2)),
    y: Number(clamp(Number(y) || 0, 0, 100).toFixed(2)),
    fontSize: Number(fontSize) || 32,
    fontColor: fontColor || "#FFFFFF",
  }));

const getPointerPoint = (event) => {
  if (event.touches && event.touches[0]) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }

  if (event.changedTouches && event.changedTouches[0]) {
    return {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    };
  }

  return { x: event.clientX, y: event.clientY };
};

const CertificatesForm = () => {
  const authCtx = useContext(AuthContext);
  const { eventId } = useParams();

  const [certificate, setCertificate] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [fields, setFields] = useState(() => ensureRequiredFields([]));
  const [previewLoading, setPreviewLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [responseImg, setResponseImg] = useState("");
  const [draggingIndex, setDraggingIndex] = useState(null);

  const stageRef = useRef(null);
  const SendCertificatePath = "/profile/events/SendCertificate";

  useEffect(() => {
    if (alert) {
      Alert(alert);
      setAlert(null);
    }
  }, [alert]);

  const previewImage = useMemo(
    () => responseImg || certificate || "",
    [responseImg, certificate]
  );

  const canRunActions = useMemo(() => Boolean(certificateFile), [certificateFile]);

  const handleCertificateChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setAlert({ type: "error", message: "Please upload a valid image file" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCertificate(reader.result);
      setResponseImg("");
      setAlert({ type: "success", message: "Template uploaded" });
    };

    setCertificateFile(file);
    reader.readAsDataURL(file);
  };

  const handleFieldChange = (index, key, value) => {
    setFields((previous) => {
      const updated = [...previous];
      updated[index] = { ...updated[index], [key]: value };
      return ensureRequiredFields(updated);
    });
  };

  const addField = () => {
    setFields((previous) => {
      const customCount = previous.filter((field) => !field.locked).length;
      return [...previous, createEmptyField(customCount)];
    });
  };

  const removeField = (index) => {
    setFields((previous) => {
      if (previous[index]?.locked) {
        setAlert({
          type: "warning",
          message: "Default fields name and qr are required",
        });
        return previous;
      }

      return previous.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const updateFieldPositionFromPoint = (index, point) => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }

    const x = ((point.x - rect.left) / rect.width) * 100;
    const y = ((point.y - rect.top) / rect.height) * 100;

    handleFieldChange(index, "x", Number(clamp(x, 0, 100).toFixed(2)));
    handleFieldChange(index, "y", Number(clamp(y, 0, 100).toFixed(2)));
  };

  const startDragging = (index, event) => {
    if (!previewImage) {
      setAlert({ type: "warning", message: "Upload a template before dragging" });
      return;
    }

    event.preventDefault();
    setDraggingIndex(index);
    updateFieldPositionFromPoint(index, getPointerPoint(event));
  };

  useEffect(() => {
    if (draggingIndex === null) {
      return undefined;
    }

    const onMove = (event) => {
      if (event.touches) {
        event.preventDefault();
      }

      updateFieldPositionFromPoint(draggingIndex, getPointerPoint(event));
    };

    const onUp = () => setDraggingIndex(null);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [draggingIndex]);

  const handleRefresh = async () => {
    if (!certificateFile) {
      setAlert({ type: "warning", message: "Upload template first" });
      return;
    }

    setPreviewLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", certificateFile);
      formData.append("fields", JSON.stringify(toMongoFieldPayload(fields)));

      const response = await api.post("/api/certificate/dummyCertificate", formData, {
        headers: { Authorization: `Bearer ${authCtx.token}` },
      });

      setResponseImg(response.data.imageSrc);
      setAlert({ type: "success", message: "Preview updated" });
    } catch (error) {
      setAlert({ type: "error", message: "Preview refresh failed" });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSave = async () => {
    if (!certificateFile) {
      setAlert({ type: "warning", message: "Upload template first" });
      return;
    }

    setSaveLoading(true);

    try {
      const eventData = await accessOrCreateEventByFormId(eventId, authCtx.token);
      if (!eventData?.id) {
        throw new Error("Event not found");
      }

      const formData = new FormData();
      formData.append("image", certificateFile);
      formData.append("eventId", eventData.id);
      formData.append("fields", JSON.stringify(toMongoFieldPayload(fields)));

      await api.post("/api/certificate/addCertificateTemplate", formData, {
        headers: { Authorization: `Bearer ${authCtx.token}` },
      });

      setAlert({ type: "success", message: "Template saved successfully" });
    } catch (error) {
      setAlert({ type: "error", message: "Save failed" });
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>
            Certificate <span>Designer</span>
          </h1>
          <p className={styles.subtitle}>
            Drag fields on preview. Default Mongo fields `name` and `qr` are always included.
          </p>
        </div>

        <div className={styles.metaPanel}>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>ID:</span>
            <code className={styles.eventId}>{eventId}</code>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>FIELDS:</span>
            <span className={styles.counter}>{fields.length} active</span>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <section className={styles.previewSection}>
          <div className={styles.sectionHeader}>
            <h2>Live Preview</h2>
            <span className={styles.statusBadge}>{previewImage ? "Ready" : "Empty"}</span>
          </div>

          <div className={styles.previewCanvas}>
            {previewImage ? (
              <div className={styles.previewStage} ref={stageRef}>
                <img src={previewImage} alt="Preview" className={styles.previewImage} draggable={false} />

                <div className={styles.markerLayer}>
                  {fields.map((field, index) => (
                    <button
                      key={`${field.fieldName}-${index}`}
                      type="button"
                      className={`${styles.dragMarker} ${field.locked ? styles.lockedMarker : ""}`}
                      style={{ left: `${field.x}%`, top: `${field.y}%` }}
                      onMouseDown={(event) => startDragging(index, event)}
                      onTouchStart={(event) => startDragging(index, event)}
                      title={`Drag ${field.fieldName}`}
                    >
                      {field.fieldName}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.previewEmpty}>
                <p>Upload a template to start positioning fields.</p>
              </div>
            )}

            {(previewLoading || saveLoading) && (
              <div className={styles.loadingOverlay}>
                <MicroLoading />
              </div>
            )}
          </div>

          <p className={styles.dragHint}>Tip: drag each label directly on the certificate preview to set position.</p>
        </section>

        <section className={styles.editorSection}>
          <div className={styles.sectionHeader}>
            <h2>Field Mapping</h2>
            <div className={styles.editorActions}>
              <label className={styles.uploadBtn} htmlFor="cert-upload">
                Upload
              </label>
              <input
                id="cert-upload"
                type="file"
                onChange={handleCertificateChange}
                accept="image/*"
                hidden
              />
              <button className={styles.addBtn} onClick={addField} type="button">
                + Add
              </button>
            </div>
          </div>

          <div className={styles.fieldList}>
            {fields.map((field, index) => (
              <article key={`${field.fieldName}-card-${index}`} className={styles.fieldCard}>
                <div className={styles.fieldHeader}>
                  <input
                    className={styles.fieldTitleInput}
                    value={field.fieldName}
                    disabled={field.locked}
                    onChange={(event) =>
                      handleFieldChange(index, "fieldName", event.target.value.trim())
                    }
                  />

                  <button
                    onClick={() => removeField(index)}
                    className={styles.delBtn}
                    disabled={field.locked}
                    type="button"
                    title={field.locked ? "Required default field" : "Remove field"}
                  >
                    x
                  </button>
                </div>

                <div className={styles.fieldGrid}>
                  <div className={styles.inputGroup}>
                    <span>Font Size</span>
                    <input
                      type="number"
                      value={field.fontSize}
                      min={8}
                      onChange={(event) =>
                        handleFieldChange(index, "fontSize", Number(event.target.value))
                      }
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <span>Font Color</span>
                    <input
                      type="color"
                      value={field.fontColor}
                      onChange={(event) =>
                        handleFieldChange(index, "fontColor", event.target.value)
                      }
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.footer}>
            <Button
              onClick={handleRefresh}
              disabled={!canRunActions || previewLoading || saveLoading}
              style={{ width: "100%" }}
            >
              {previewLoading ? <MicroLoading /> : "Refresh"}
            </Button>

            <Button
              onClick={handleSave}
              disabled={!canRunActions || previewLoading || saveLoading}
              style={{ width: "100%", backgroundColor: "#f97316", color: "#111827" }}
            >
              {saveLoading ? <MicroLoading /> : "Save Template"}
            </Button>

            <Link to={`${SendCertificatePath}/${eventId}`}>
              <button className={styles.nextBtn} type="button">
                Next Step
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CertificatesForm;
