import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Input from "../../../../../components/Core/Input";
import { Button } from "../../../../../components";
import { api } from "../../../../../services";
import {
  accessOrCreateEventByFormId,
  // getCertificatePreview,
  generatedAndSendCertificate,
} from "./tools/certificateTools";
import { Alert, MicroLoading } from "../../../../../microInteraction";
import { Link } from "react-router-dom";
import AuthContext from "../../../../../context/AuthContext";

const CertificatesForm = () => {
  const authCtx = useContext(AuthContext);
  const { eventId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [responseImg, setResponseImg] = useState("");
  const SendCertificatePath = "/profile/events/SendCertificate";
  // const test = async () => {
  //   let formId = await accessOrCreateEventByFormId(eventId);

  //   console.log(formId);

  //   //APNA EMAIL DAAL KE TEST KR LENA

  //   console.log(formId);

  //   const attendees = [
  //     {
  //       fieldValues: {
  //         name: `Prakash Bhaia21 ${Date.now()}`,
  //         email: "23051625@kiit.ac.in",
  //       },
  //       certificateId: formId.certificates[formId.certificates.length - 1].id,
  //     },
  //     {
  //       fieldValues: {
  //         name: `Prakash Bhaia22 ${Date.now()}`,
  //         email: "shreyashks02@gmail.com",
  //       },
  //       certificateId: formId.certificates[formId.certificates.length - 1].id,
  //     },
  //   ];

  //   console.log;
  //   await generatedAndSendCertificate({
  //     eventId: formId.id,
  //     attendees,
  //   });
  //   // attendees
  //   // ();
  // };

  //test();

  useEffect(() => {
    if (alert) {
      Alert(alert);
      setAlert(null);
    }
  }, [alert]);

  const handleCertificateChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setAlert({
          type: "error",
          message: "Please upload a valid image file",
          position: "top-right",
          duration: 3000,
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setCertificate(reader.result);
        setAlert({
          type: "success",
          message: "Certificate image uploaded successfully",
          position: "top-right",
          duration: 2000,
        });
      };
      setCertificateFile(file);
      reader.readAsDataURL(file);
    }
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], [key]: value };
    setFields(updatedFields);
  };

  const addField = () => {
    setFields([
      ...fields,
      {
        fieldName: "",
        x: 0,
        y: 0,
        fontSize: 16,
        fontColor: "#000000",
        minimized: false,
      },
    ]);
    setAlert({
      type: "info",
      message: "New field added",
      position: "top-right",
      duration: 2000,
    });
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
    setAlert({
      type: "info",
      message: "Field removed",
      position: "top-right",
      duration: 2000,
    });
  };

  const handleRefresh = async () => {
    if (!certificateFile) {
      setAlert({
        type: "warning",
        message: "Please upload a certificate image first",
        position: "top-right",
        duration: 3000,
      });
      return;
    }
    setPreviewLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", certificateFile);
      formData.append("fields", JSON.stringify(fields));
      const response = await api.post(
        "/api/certificate/dummyCertificate",
        formData,
        {
          headers: { Authorization: `Bearer ${authCtx.token}` },
        }
      );
      if (response.status !== 200) {
        throw new Error(`API error: ${response.statusText}`);
      }
      setResponseImg(response.data.imageSrc);
      setAlert({
        type: "success",
        message: "Preview updated successfully",
        position: "top-right",
        duration: 2000,
      });
    } catch (error) {
      setAlert({
        type: "error",
        message: "Error updating preview. Please try again",
        position: "top-right",
        duration: 3000,
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSave = async () => {
    if (!certificateFile) {
      setAlert({
        type: "warning",
        message: "Please upload a certificate image first",
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    setSaveLoading(true);
    try {
      const eventData = await accessOrCreateEventByFormId(
        eventId,
        authCtx.token
      );
      if (!eventData || !eventData.id) {
        throw new Error("Failed to retrieve or create event.");
      }

      const formData = new FormData();
      formData.append("image", certificateFile);
      formData.append("eventId", eventData.id);
      formData.append("fields", JSON.stringify(fields));

      const response = await api.post(
        "/api/certificate/addCertificateTemplate",
        formData
      );

      if (response.status !== 200) {
        throw new Error(`API error: ${response.statusText}`);
      }

      setAlert({
        type: "success",
        message: "Certificate template saved successfully",
        position: "top-right",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving certificate template:", error);
      setAlert({
        type: "error",
        message: "Error saving certificate template. Please try again",
        position: "top-right",
        duration: 3000,
      });
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div style={{ padding: "10px", marginRight: "30px" }}>
      <h1>
        Create <span style={{ color: "#FF8A00" }}>Certificate</span>
      </h1>
      <p>for Event: {eventId}</p>
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div
          style={{
            width: "70%",
            height: "400px",
            border: "1px solid #ccc",
            backgroundImage: responseImg
              ? `url(${responseImg})`
              : certificate
              ? `url(${certificate})`
              : "none",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {loading && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                padding: "20px",
                borderRadius: "5px",
              }}
            >
              <MicroLoading />
            </div>
          )}
        </div>

        <div style={{ width: "30%" }}>
          <input
            type="file"
            onChange={handleCertificateChange}
            accept="image/*"
            style={{ color: "#FF8A00" }}
          />
          <Button onClick={addField}>+ Add Field</Button>

          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {fields.map((field, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  marginTop: "10px",
                  borderRadius: "5px",
                  marginLeft: "20px",
                  marginRight: "20px",
                  backgroundColor: "rgba(128, 127, 126, 0.066)",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <strong>{field.fieldName || `Field ${index + 1}`}</strong>
                  <button
                    onClick={() =>
                      handleFieldChange(index, "minimized", !field.minimized)
                    }
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {field.minimized ? "Open" : "✖"}
                  </button>
                </div>
                {!field.minimized && (
                  <>
                    <Input
                      type="text"
                      label="Field Name"
                      value={field.fieldName}
                      onChange={(e) =>
                        handleFieldChange(index, "fieldName", e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      label="X Position (%)"
                      value={field.x}
                      onChange={(e) =>
                        handleFieldChange(index, "x", Number(e.target.value))
                      }
                    />
                    <Input
                      type="number"
                      label="Y Position (%)"
                      value={field.y}
                      onChange={(e) =>
                        handleFieldChange(index, "y", Number(e.target.value))
                      }
                    />
                    <Input
                      type="number"
                      label="Font Size"
                      value={field.fontSize}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "fontSize",
                          Number(e.target.value)
                        )
                      }
                    />
                    <Input
                      type="color"
                      label="Font Color"
                      value={field.fontColor}
                      onChange={(e) =>
                        handleFieldChange(index, "fontColor", e.target.value)
                      }
                    />
                  </>
                )}
                <Button
                  onClick={() => removeField(index)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    marginTop: "10px",
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <Button
              onClick={handleRefresh}
              disabled={previewLoading || saveLoading}
            >
              {previewLoading ? <MicroLoading /> : "Refresh"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={previewLoading || saveLoading}
              style={{ backgroundColor: "#FF8A00", color: "white" }}
            >
              {saveLoading ? <MicroLoading /> : "Save Certificate"}
            </Button>
            <Link to={`${SendCertificatePath}/${eventId}`}>
              <Button
                style={{
                  backgroundColor: "#FF8A00",
                  color: "white",
                  whiteSpace: "nowrap",
                  height: "fit-content",
                }}
              >
                Next
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesForm;
