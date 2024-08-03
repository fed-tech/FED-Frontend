import { useState, useContext, useEffect } from "react";
import styles from "./styles/ProfileView.module.scss";
import AuthContext from "../../../../context/AuthContext";
import { FiEdit } from "react-icons/fi";
import { EditProfile } from "../../../../features";
import { ComponentLoading } from "../../../../microInteraction";
import PropTypes from "prop-types";

const Profile = ({ editmodal }) => {
  const authCtx = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); 
  }, []);

  return (
    <div id={styles.profile}>
      <div className={styles.proHeading}>
        <h3 className={styles.headInnerText}>
          <span>Profile</span> Details
        </h3>
        {authCtx.user.access !== "USER" && (
          <div className={styles.editbtn} onClick={handleOpen}>
            <FiEdit />
          </div>
        )}
      </div>
      {authCtx.user && (
        isLoading ? (
          <ComponentLoading />
        ) : (
          <div className={styles.details}>
            <table className={styles.profileTable}>
              <tbody>
                <tr>
                  <td className={styles.dets}>Full Name</td>
                  <td className={styles.vals}>{authCtx.user.name}</td>
                </tr>
                <tr>
                  <td className={styles.dets}>Email ID</td>
                  <td className={styles.vals}>{authCtx.user.email}</td>
                </tr>
                <tr>
                  <td className={styles.dets}>Roll Number</td>
                  <td className={styles.vals}>{authCtx.user.rollNumber}</td>
                </tr>
                <tr>
                  <td className={styles.dets}>Year</td>
                  <td className={styles.vals}>{authCtx.user.year}</td>
                </tr>
                <tr>
                  <td className={styles.dets}>School</td>
                  <td className={styles.vals}>{authCtx.user.school}</td>
                </tr>
                <tr>
                  <td className={styles.dets}>College</td>
                  <td className={styles.vals}>{authCtx.user.college}</td>
                </tr>
                <tr>
                  <td className={styles.dets}>Mobile No</td>
                  <td className={styles.vals}>{authCtx.user.contactNo}</td>
                </tr>
                {authCtx.user.access !== "USER" && (
                  <>
                    <tr>
                      <td className={styles.dets}>Designation</td>
                      <td className={styles.vals}>{authCtx.user.designation}</td>
                    </tr>
                    <tr>
                      <td className={styles.dets}>Github</td>
                      <td className={styles.vals}>{authCtx.user.github}</td>
                    </tr>
                    <tr>
                      <td className={styles.dets}>LinkedIn</td>
                      <td className={styles.vals}>{authCtx.user.linkedin}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        )
      )}
      {isOpen && authCtx.user.access !== "USER" && (
        <EditProfile handleModalClose={handleClose} />
      )}
    </div>
  );
};

Profile.propTypes = {
  editmodal: PropTypes.string.isRequired,
};

export default Profile;
