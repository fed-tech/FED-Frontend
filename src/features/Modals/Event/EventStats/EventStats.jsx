import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { SkeletonTheme } from "react-loading-skeleton";
import { FaDownload } from "react-icons/fa";
import "react-loading-skeleton/dist/skeleton.css";
import { Alert, ComponentLoading } from "../../../../microInteraction";
import { X } from "lucide-react";
import Text from "../../../../components/Core/Text";
import defaultImg from "../../../../assets/images/defaultImg.jpg";
import { api } from "../../../../services";
import styles from "../EventModal/styles/EventModal.module.scss";
import AuthContext from "../../../../context/AuthContext";
import PropTypes from 'prop-types';

const EventStats = ({ onClosePath }) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const { eventId } = useParams();
  const [info, setInfo] = useState({});
  const [data, setData] = useState({});
  const [year, setYear] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [viewTeams, setViewTeams] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(
          `/api/form/getFormAnalytics/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          setData(response.data.form.formAnalytics);
          setInfo(response.data.form.info);
          setYear(response.data.yearCounts);
        } else {
          setAlert({
            type: "error",
            message:
              "There was an error fetching event details. Please try again.",
            position: "bottom-right",
            duration: 3000,
          });
          throw new Error(response.data.message || "Error fetching event");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setAlert({
          type: "error",
          message:
            error.response.data.message ||
            "There was an error fetching event details. Please try again.",
          position: "bottom-right",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
      setAlert(null);
    }
  }, [alert]);

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleModalClose = () => {
    navigate(onClosePath);
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/api/form/download/${eventId}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        setAlert({
          type: "success",
          message: "File downloaded successfully",
          position: "bottom-right",
          duration: 3000,
        });
        const blob = new Blob([response.data], { type: response.data.type });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `registration_data_${eventId}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        setAlert({
          type: "error",
          message: "There was an error downloading the file. Please try again.",
          position: "bottom-right",
          duration: 3000,
        });
        throw new Error(response.data.message || "Error downloading the file");
      }
    } catch (error) {
      console.error("Error downloading the file", error);
      setAlert({
        type: "error",
        message:
          error.response.data.message ||
          "There was an error downloading the file. Please try again.",
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  const filteredUsers = (users) => {
    if (!users) return [];
    return users.filter((user) =>
      user.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredTeams = data[0]?.regTeamNames?.filter((team) =>
    team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const yearCounts = year || {};

  const renderUserList = (users, title, count) => (
    <div className={styles.userSection}>
      <Text
        style={{
          color: "#fff",
          fontSize: "1rem",
          fontWeight: "600",
          marginBottom: "0.5rem",
          marginLeft: "1.5rem",
        }}
      >
        {title} ({count})
      </Text>
      <div className={styles.eventEmails}>
        {isSearching ? (
          <ComponentLoading
            customStyles={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "-0.4rem",
            }}
          />
        ) : filteredUsers(users).length > 0 ? (
          filteredUsers(users).map((user, index) => (
            <div 
              key={index} 
              className={styles.userCard}
              style={{
                padding: "0.5rem",
                marginBottom: "0.5rem",
                height: "auto",
                minHeight: "40px",
              }}
            >
              <img
                src={defaultImg}
                alt="User"
                className={styles.userImg}
                style={{
                  width: "30px",
                  height: "30px",
                  marginRight: "0.8rem",
                }}
              />
              <div 
                className={styles.userEmail}
                style={{
                  fontSize: "0.9rem",
                }}
              >
                {user}
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "25%",
            }}
          >
            <text style={{ fontSize: "16px" }}>No Users found</text>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        zIndex: "10",
        left: 0,
        top: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          zIndex: "5",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            zIndex: "10",
            borderRadius: "10px",
            padding: "1.5rem",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: ".3rem",
            maxHeight: "90vh",
            overflow: "hidden",
          }}
        >
          {data && (
            <>
              <SkeletonTheme baseColor="#313131" highlightColor="#525252">
                <Skeleton height={120} style={{ marginBottom: "0.5rem" }} />
                <Skeleton
                  count={2}
                  height={15}
                  width="100%"
                  style={{ marginBottom: "0.3rem" }}
                />
              </SkeletonTheme>
              <div
                style={{
                  overflowY: "auto",
                  maxHeight: "calc(90vh - 100px)",
                }}
                className={styles.card}
              >
                {isLoading ? (
                  <ComponentLoading
                    customStyles={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: "relative",
                      padding: "1rem",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        padding: "1rem",
                        zIndex: "20",
                      }}
                    >
                      <button
                        onClick={handleModalClose}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: "0.5rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          transition: "all 0.2s ease",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.color = "#FF8A00";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.color = "#FF8A00";
                        }}
                      >
                        <X size={28} />
                      </button>
                    </div>

                    <div className={styles.backbtn}>
                      <div
                        className={styles.eventname}
                        style={{ paddingTop: "10px" }}
                      >
                        {info.eventTitle}
                      </div>
                      {authCtx.user.access === "ADMIN" && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "0.5rem",
                            padding: "0.3rem",
                            borderRadius: "0.5rem",
                            cursor: "pointer",
                          }}
                          onClick={handleDownload}
                        >
                          <FaDownload
                            size={16}
                            style={{
                              marginRight: "1.5rem",
                              color: "#FF8A00",
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", justifyContent: "left" }}>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "0.8rem",
                          alignItems: "left",
                          textAlign: "left",
                        }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div
                            className={styles.toggleSwitchContainer}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: "0.8rem",
                            }}
                          >
                            <Text
                              style={{
                                color: "#fff",
                                fontSize: "0.9rem",
                                fontWeight: "500",
                                marginLeft: "1.5rem",
                                marginTop: "0.3rem",
                              }}
                            >
                              {viewTeams ? "Back to Users" : "Switch to Teams"}
                            </Text>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                checked={viewTeams}
                                onChange={() => setViewTeams(!viewTeams)}
                              />
                              <span className={styles.slider}></span>
                            </label>
                          </div>

                          <Text
                            style={{
                              color: "#fff",
                              fontSize: "0.9rem",
                              fontWeight: "500",
                              textAlign: "left",
                              marginBottom: "0.8rem",
                              marginLeft: "1.5rem",
                            }}
                          >
                            Total{" "}
                            {viewTeams
                              ? "Registered Teams"
                              : "Registered Users"}{" "}
                            :{" "}
                            <span
                              style={{
                                color: "#FF8A00",
                              }}
                            >
                              {viewTeams
                                ? data[0]?.regTeamNames?.length || 0
                                : data[0]?.totalRegistrationCount || 0}
                            </span>
                          </Text>
                        </div>

                        <Text
                          style={{
                            color: "#fff",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                            textAlign: "left",
                            marginBottom: "0.8rem",
                            marginLeft: "1.2rem",
                            marginTop: "0.3rem",
                          }}
                        >
                          Year Counts:
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(3, 1fr)",
                              gap: "0.5rem",
                              marginTop: "0.5rem",
                              maxWidth: "100%",
                            }}
                          >
                            {Object.keys(yearCounts.paid || {}).length > 0 ? (
                              Object.entries(yearCounts.paid).map(
                                ([year, count]) => (
                                  <div
                                    key={year}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      color: "#FF8A00",
                                      padding: "0.3rem",
                                      // backgroundColor: "rgba(255, 138, 0, 0.1)",
                                      borderRadius: "4px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: "#fff",
                                        fontWeight: "bold",
                                        marginRight: "0.3rem",
                                      }}
                                    >
                                      {year}:
                                    </span>{" "}
                                    {count} (Paid)
                                  </div>
                                )
                              )
                            ) : (
                              <span>No paid users data available</span>
                            )}
                            {Object.keys(yearCounts.pending || {}).length > 0 ? (
                              Object.entries(yearCounts.pending).map(
                                ([year, count]) => (
                                  <div
                                    key={year}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      color: "#FF8A00",
                                      padding: "0.3rem",
                                      // backgroundColor: "rgba(255, 138, 0, 0.1)",
                                      borderRadius: "4px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: "#fff",
                                        fontWeight: "bold",
                                        marginRight: "0.3rem",
                                      }}
                                    >
                                      {year}:
                                    </span>{" "}
                                    {count} (Pending)
                                  </div>
                                )
                              )
                            ) : (
                              <span>No pending users data available</span>
                            )}
                          </div>
                        </Text>
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder={`Search by ${viewTeams ? "team" : "email"}`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={styles.searchInput}
                      style={{
                        marginTop: "0.5rem",
                        marginBottom: "0.5rem",
                        padding: "0.5rem",
                        fontSize: "0.9rem",
                      }}
                    />

                    {viewTeams ? (
                      <div className={styles.eventEmails}>
                        {isSearching ? (
                          <ComponentLoading
                            customStyles={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "-0.4rem",
                            }}
                          />
                        ) : filteredTeams && filteredTeams.length > 0 ? (
                          filteredTeams.map((team, index) => (
                            <div key={index} className={styles.userCard}>
                              <img
                                src={defaultImg}
                                alt="Team"
                                className={styles.userImg}
                              />
                              <div className={styles.userEmail}>{team}</div>
                            </div>
                          ))
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginLeft: "25%",
                            }}
                          >
                            <text style={{ fontSize: "20px" }}>
                              No Teams found
                            </text>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        {renderUserList(
                          data[0]?.paidUsers,
                          "Paid Users",
                          data[0]?.paidUsers?.length || 0
                        )}
                        {renderUserList(
                          data[0]?.pendingUsers,
                          "Pending Payment Users",
                          data[0]?.pendingUsers?.length || 0
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Alert />
    </div>
  );
};

EventStats.propTypes = {
  onClosePath: PropTypes.string.isRequired
};

export default EventStats;