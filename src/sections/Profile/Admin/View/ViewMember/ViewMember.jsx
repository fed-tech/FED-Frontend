import React, { useState, useEffect, useContext, useMemo } from "react";
import styles from "./styles/ViewMember.module.scss";
import { TeamCard } from "../../../../../components";
import AddMemberForm from "../../Form/MemberForm/AddMemberForm";
import localTeamMembers from "../../../../../data/Team.json";
import AuthContext from "../../../../../context/AuthContext";
import { api } from "../../../../../services";
import { Alert, ComponentLoading } from "../../../../../microInteraction";

// Domain tabs configuration — order matters for display
const DOMAIN_TABS = [
  { key: "board", label: "Board" },
  { key: "technical", label: "Technical" },
  { key: "creative", label: "Creative" },
  { key: "marketing", label: "Marketing" },
  { key: "operations", label: "Operations" },
  { key: "pr and finance", label: "PR & Finance" },
  { key: "human resource", label: "Human Resource" },
  { key: "alumni", label: "Alumni" },
  { key: "ex member", label: "Ex Member" },
];

function ViewMember() {
  const [activeTab, setActiveTab] = useState("board");
  const [showAddForm, setShowAddForm] = useState(false);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [enablingUpdate, setEnable] = useState(false);
  const [alert, setAlert] = useState(null);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
    }
  }, [alert]);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/user/fetchTeam");
        setMembers(response.data.data);
      } catch (error) {
        console.error("Error fetching member data:", error);
        setMembers(localTeamMembers);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, []);

  // Filter members by current tab
  const getFilteredMembers = useMemo(() => {
    let filtered = [];

    if (activeTab === "board") {
      filtered = members.filter(
        (member) =>
          member.access.startsWith("DIRECTOR_") ||
          member.access.startsWith("DEPUTY_") ||
          member.access === "PRESIDENT" ||
          member.access === "VICEPRESIDENT"
      );
    } else {
      filtered = members.filter((member) => {
        const accessCategory = member.access
          .replace(/_/g, " ")
          .toLowerCase();

        const activeDepartment = activeTab.toLowerCase();

        const seniorExecutivePrefix = "senior executive ";
        const isSeniorExecutive =
          accessCategory.startsWith(seniorExecutivePrefix) &&
          accessCategory.substring(seniorExecutivePrefix.length) ===
          activeDepartment;

        return accessCategory === activeDepartment || isSeniorExecutive;
      });
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort alphabetically
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [members, activeTab, searchQuery]);

  // Compute member counts per tab for badges
  const memberCounts = useMemo(() => {
    const counts = {};
    DOMAIN_TABS.forEach(({ key }) => {
      if (key === "board") {
        counts[key] = members.filter(
          (m) =>
            m.access.startsWith("DIRECTOR_") ||
            m.access.startsWith("DEPUTY_") ||
            m.access === "PRESIDENT" ||
            m.access === "VICEPRESIDENT"
        ).length;
      } else {
        counts[key] = members.filter((m) => {
          const ac = m.access.replace(/_/g, " ").toLowerCase();
          const dept = key.toLowerCase();
          const sep = "senior executive ";
          return ac === dept || (ac.startsWith(sep) && ac.substring(sep.length) === dept);
        }).length;
      }
    });
    return counts;
  }, [members]);

  const handleTabClick = (tabKey) => {
    setShowAddForm(false);
    setActiveTab(tabKey);
  };

  const handleAddMemberClick = () => {
    if (showAddForm && enablingUpdate) {
      authCtx.memberData = null;
      authCtx.croppedImageFile = null;
      setEnable(false);
      setShowAddForm(false);
      setTimeout(() => setShowAddForm(true), 0);
    } else {
      setShowAddForm((prev) => !prev);
    }
  };

  const handleUpdate = (member) => {
    setShowAddForm(true);
    setEnable(true);
  };

  const handleRemove = async () => {
    try {
      const id = authCtx.memberData.id;
      const response = await api.delete(`/api/user/deleteMember/${id}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        setAlert({
          type: "success",
          message: "Member deleted successfully.",
          position: "bottom-right",
          duration: 3000,
        });
        setMembers((prev) => prev.filter((m) => m.id !== response.data.user.id));
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const customStyles = {
    teamMember: styles.teamMemberCustom,
    teamMemberBackh5: styles.teamMemberBackh5Custom,
    socialLinksa: styles.socialLinksaCustom,
    button: styles.buttonCustom,
    knowPara: styles.knowParaCustom,
    updatebtn: styles.updatebtnCustom,
    teamMemberBack: styles.teamMemberBackCustom,
  };

  return (
    <div className={styles.mainMember}>
      <div className={styles.eventmember}>
        <div className={styles.right}>
          {/* ── Page Header ── */}
          <div className={styles.pageHeader}>
            <h3 className={styles.headInnerText}>
              <span>Manage</span> Members
            </h3>

            <div className={styles.headerActions}>
              <div className={styles.searchContainer}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <button
                className={`${styles.addMemberBtn} ${showAddForm ? styles.active : ""}`}
                onClick={handleAddMemberClick}
              >
                <span className={styles.addIcon}>{showAddForm ? "✕" : "+"}</span>
                <span>{showAddForm ? "Cancel" : "Add Member"}</span>
              </button>
            </div>
          </div>

          {/* ── Domain Tab Navigation ── */}
          {!showAddForm && (
            <div className={styles.tabNav}>
              {DOMAIN_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  className={`${styles.tab} ${activeTab === key ? styles.active : ""}`}
                  onClick={() => handleTabClick(key)}
                >
                  {label}
                  <span className={styles.tabCount}>{memberCounts[key] || 0}</span>
                </button>
              ))}
            </div>
          )}

          {/* ── Content Area ── */}
          {loading ? (
            <ComponentLoading />
          ) : showAddForm ? (
            <AddMemberForm />
          ) : getFilteredMembers.length > 0 ? (
            <div className={styles.teamGrid}>
              {getFilteredMembers.map((member, idx) => (
                <TeamCard
                  key={idx}
                  member={member}
                  customStyles={customStyles}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>👥</div>
              <p className={styles.emptyText}>No members found</p>
              <p className={styles.emptySubtext}>
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : `No members in this domain yet`}
              </p>
            </div>
          )}
        </div>
      </div>
      <Alert />
    </div>
  );
}

export default ViewMember;
