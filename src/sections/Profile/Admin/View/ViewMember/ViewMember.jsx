import React, { useState, useEffect, useContext, useRef } from "react";
import styles from "./styles/ViewMember.module.scss";
import { Button, TeamCard } from "../../../../../components";
import AddMemberForm from "../../Form/MemberForm/AddMemberForm";
import localTeamMembers from "../../../../../data/Team.json";
import AccessTypes from "../../../../../data/Access.json";
import AuthContext from "../../../../../context/AuthContext";
import { api } from "../../../../../services";
import { Alert, ComponentLoading } from "../../../../../microInteraction";

function ViewMember() {
  const [memberActivePage, setMemberActivePage] = useState("Board");
  const [members, setMembers] = useState([]);
  const [access, setAccess] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [enablingUpdate, setEnable] = useState(false);
  const [alert, setAlert] = useState(null);

  const authCtx = useContext(AuthContext);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
    }
  }, [alert]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/user/fetchTeam");
        setMembers(response.data.data);
      } catch (error) {
        setMembers(localTeamMembers);
      } finally {
        setLoading(false);
      }
    };

    const fetchAccessTypes = async () => {
      try {
        const testAccess = [
          "BOARD",
          "TECHNICAL",
          "CREATIVE",
          "MARKETING",
          "OPERATIONS",
          "PR_AND_FINANCE",
          "HUMAN_RESOURCE",
          "ALUMNI",
          "EX_MEMBER",
          "ADD_MEMBER",
        ];

        const formatted = testAccess.map((item) =>
          item
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase())
        );

        setAccess(formatted);
      } catch (error) {
        setAccess(AccessTypes.data);
      }
    };

    fetchAccessTypes();
    fetchMemberData();
  }, []);

  const handleSelect = (value) => {
    setMemberActivePage(value);
    setDropdownOpen(false);
  };

  const getMembersByPage = () => {
    if (memberActivePage === "Add Member") return [];

    let filtered = [];

    if (memberActivePage === "Board") {
      filtered = members.filter(
        (m) =>
          m.access.startsWith("DIRECTOR_") ||
          m.access.startsWith("DEPUTY_") ||
          m.access === "PRESIDENT" ||
          m.access === "VICEPRESIDENT"
      );
    } else {
      const active = memberActivePage.toLowerCase();
      filtered = members.filter((m) =>
        m.access.replace(/_/g, " ").toLowerCase().includes(active)
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  };

  const membersToDisplay = getMembersByPage();

  return (
    <div className={styles.mainMember}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h3 className={styles.headInnerText}>
            <span>View</span> Member
          </h3>

          <div className={styles.dropdownWrapper} ref={dropdownRef}>
            <div
              className={styles.dropdownHeader}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {memberActivePage}
              <span className={styles.arrow}>{dropdownOpen ? "▲" : "▼"}</span>
            </div>

            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                {access.map((item, i) => (
                  <div
                    key={i}
                    className={`${styles.dropdownItem} ${
                      memberActivePage === item ? styles.activeItem : ""
                    }`}
                    onClick={() => handleSelect(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {loading ? (
        <ComponentLoading />
      ) : memberActivePage === "Add Member" ? (
        <AddMemberForm />
      ) : (
        <div className={styles.teamGrid}>
          {membersToDisplay.map((member, idx) => (
            <TeamCard key={idx} member={member} />
          ))}
        </div>
      )}

      <Alert />
    </div>
  );
}

export default ViewMember;