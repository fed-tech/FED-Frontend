import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { api } from "../../../../../services";
import { MicroLoading } from "../../../../../microInteraction";
import styles from "./styles/VerifyCertificate.module.scss";
import { Button } from "../../../../../components";
import { use } from "react";

const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const certificateId = searchParams.get("id");
  const {issuedCertificateId} = useParams();
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    if (!certificateId) {
      setError("No certificate ID provided.");
      setLoading(false);
      return;
    }

    console.log("Certificate ID:", certificateId);  
   

    const fetchCertificate = async () => {
      try {
        const response = await api.post("/api/certificate/verifyCertificate", {
          id: certificateId,
        });

        if (response.data && response.data.imageSrc && response.data.certificate) {
          setCertificateData({
            imageSrc: response.data.imageSrc,
            certificateId: response.data.certificate.certificateId,
            name: response.data.certificate.fieldValues?.name || "N/A",
            email: response.data.certificate.email || "N/A",
            event: response.data.certificate.eventId || "N/A",
          });
        } else {
          setError("Invalid certificate data.");
        }
      } catch (err) {
        console.error("Error fetching certificate:", err);
        setError("Failed to fetch certificate.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  const handleDownload = () => {
    if (certificateData?.imageSrc) {
      const link = document.createElement("a");
      link.href = certificateData.imageSrc;
      link.download = `Certificate_${certificateData.certificateId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <MicroLoading />
        <p>Verifying certificate...</p>
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title} style={{textAlign:"center"}}>Certificate <span style={{ color: "#FF8A00" }}>Verification</span></h1>
      <div className={styles.contentWrapper}>
        {/* Certificate Image */}
        <div className={styles.imageContainer}>
          <img src={certificateData.imageSrc} alt="Verified Certificate" />
          
        </div>

        {/* Certificate Details Panel */}
        <div className={styles.detailsContainer} >
          <table className={styles.detailsTable}
          >
            <tbody>
              <tr>
                <th style={{ color: "#FF8A00" }}>Certificate ID:
                </th>
                <td>{certificateId}</td>
              </tr>
              <tr>
                <th  style={{ color: "#FF8A00" }}>Name:</th>
                <td>{certificateData.name}</td>
              </tr>
              <tr>
                <th  style={{ color: "#FF8A00" }}>Event:</th>
                <td>{certificateData.event}</td>
              </tr>
              <tr>
                <th  style={{ color: "#FF8A00" }}>Email:</th>
                <td>{certificateData.email}</td>
              </tr>
              <tr>
                
                
                  <Button onClick={handleDownload}>
                    Download
                  </Button>
                
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;