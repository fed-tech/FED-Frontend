import { useState, useEffect, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import styles from "./styles/EditProfile.module.scss";
import { Button, Input } from "../../../components";
import { X } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { Alert, MicroLoading } from "../../../microInteraction";
import { api } from "../../../services";

const EditProfile = ({ handleModalClose }) => {
  const authCtx = useContext(AuthContext);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    name: authCtx.user.name,
    rollNo: authCtx.user.rollNo,
    year: authCtx.user.year,
    school: authCtx.user.school,
    college: authCtx.user.college,
    mobileNo: authCtx.user.mobileNo,
    github: authCtx.user.github,
    linkedin: authCtx.user.linkedin,
  });

  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
    }
  }, [alert]);

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/api/user/editDetails", data);

      if (response.status === 200 || response.status === 201) {
        console.log("Profile updated successfully!", response.data);

        authCtx.update(
          data.name,
          authCtx.user.email,
          authCtx.user.pic,
          data.rollNo,
          data.school,
          data.college,
          data.mobileNo,
          data.year,
          data.github,
          data.linkedin,
          authCtx.user.designation,
          authCtx.user.access,
          authCtx.user.regForm
        );
        setTimeout(()=>{
          handleModalClose();
          window.location.reload();
        },2000);
        setAlert({
          type: "success",
          message: "Profile updated successfully.",
          position: "bottom-right",
          duration: 3000,
        });
      } else {
        setAlert({
          type: "error",
          message:
            "There was an error updating your profile. Please try again.",
          position: "bottom-right",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlert({
        type: "error",
        message: "There was an error updating your profile. Please try again.",
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        zIndex: "20",
        left: "0",
        top: "0",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          zIndex: "15",
        }}
      >
        <div
          style={{
            zIndex: "10",
            borderRadius: "10px",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            scale: "0.8",
          }}
        >
          <>
            <div className={styles.flex}>
              <div
                id={styles.profile}
                data-aos="zoom-in-up"
                data-aos-duration="500"
              >
                <div className={styles.proHeading}>
                  <h3 className={styles.headInnerText}>
                    <span>Edit</span> Profile
                  </h3>
                </div>
                <button
                  className={styles.closeModal}
                  onClick={handleModalClose}
                >
                  <X />
                </button>
                {authCtx.user && (
                  <div className={styles.details}>
                    <div className={styles.profileTable}>
                      <div className={styles.table}>
                        <h6 className={styles.dets}>Full Name</h6>
                        <Input
                          style={{
                            width: "17rem",
                            margin: "0px",
                            fontSize: "15px",
                          }}
                          placeholder="Enter your name"
                          type="text"
                          value={data.name}
                          className={styles.vals}
                          onChange={(e) =>
                            setData({ ...data, name: e.target.value })
                          }
                        />
                      </div>
                      <div className={styles.table}>
                        <h6 className={styles.dets}>Roll Number</h6>
                        <Input
                          style={{
                            width: "17rem",
                            margin: "0px",
                            fontSize: "15px",
                          }}
                          placeholder="Enter your roll"
                          type="number"
                          value={data.rollNo}
                          className={styles.vals}
                          onChange={(e) =>
                            setData({ ...data, rollNo: e.target.value })
                          }
                        />
                      </div>
                      <div className={styles.table}>
                        <h6 className={styles.dets}>Year</h6>
                        <Input
                          style={{
                            width: "17rem",
                            margin: "0px",
                            fontSize: "15px",
                          }}
                          type="select"
                          name={data.year}
                          className={styles.vals}
                          options={[
                            { label: "1st Year", value: "1" },
                            { label: "2nd Year", value: "2" },
                            { label: "3rd Year", value: "3" },
                            { label: "4th Year", value: "4" },
                            { label: "5th Year", value: "5" },
                            { label: "Passout", value: "Passout" },
                          ]}
                          value={data.year}
                          onChange={(value) =>
                            setData({ ...data, year: value })
                          }
                        />
                      </div>
                      <div className={styles.table}>
                        <h6 className={styles.dets}>School</h6>
                        <Input
                          style={{
                            width: "17rem",
                            margin: "0px",
                            fontSize: "15px",
                          }}
                          placeholder="Enter your school"
                          type="text"
                          value={data.school}
                          className={styles.vals}
                          onChange={(e) =>
                            setData({ ...data, school: e.target.value })
                          }
                        />
                      </div>
                      <div className={styles.table}>
                        <h6 className={styles.dets}>College</h6>
                        <Input
                          style={{
                            width: "17rem",
                            margin: "0px",
                            fontSize: "15px",
                          }}
                          placeholder="Enter your college"
                          type="text"
                          value={data.college}
                          className={styles.vals}
                          onChange={(e) =>
                            setData({ ...data, college: e.target.value })
                          }
                        />
                      </div>
                      <div className={styles.table}>
                        <h6 className={styles.dets}>Mobile No</h6>
                        <Input
                          style={{
                            width: "17rem",
                            margin: "0px",
                            fontSize: "15px",
                          }}
                          placeholder="Enter Phone number"
                          type="number"
                          value={data.mobileNo}
                          onChange={(e) =>
                            setData({ ...data, mobileNo: e.target.value })
                          }
                          className={styles.vals}
                        />
                      </div>
                      <div className={styles.table}>
                        <h6 className={styles.dets}>Github</h6>
                        <Input
                          style={{
                            width: "17rem",
                            margin: "0px",
                            fontSize: "15px",
                          }}
                          placeholder="Enter your school"
                          type="text"
                          value={data.github}
                          className={styles.vals}
                          onChange={(e) =>
                            setData({ ...data, github: e.target.value })
                          }
                        />
                      </div>
                      <div className={styles.table}>
                        <h6 className={styles.dets}>LinkedIn</h6>
                        <Input
                          style={{
                            width: "17rem",
                            margin: "0px",
                            fontSize: "15px",
                          }}
                          placeholder="Enter your school"
                          type="text"
                          value={data.linkedin}
                          className={styles.vals}
                          onChange={(e) =>
                            setData({ ...data, linkedin: e.target.value })
                          }
                        />
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                          <Button
                            type="submit"
                            onClick={handleSave}
                            className={styles.submit}
                          >
                          {isLoading ? (
                            <MicroLoading />
                          ) : (
                            "Update Changes"
                          )}
                          </Button>
                        
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        </div>
      </div>
      <Alert/>
    </div>
  );
};

export default EditProfile;
