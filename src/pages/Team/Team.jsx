import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services";
import styles from "./styles/Team.module.scss";
import { TeamCard } from "../../components";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import useWindowWidth from "../../utils/hooks/useWindowWidth";
import MemberData from "../../data/Team.json";
import AccessTypes from "../../data/Access.json";
import { ComponentLoading } from "../../microInteraction";

const Team = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [teamMembers, setTeamMembers] = useState([]);
  const [access, setAccess] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await api.get("/api/user/fetchTeam");

        if (response.status === 200) {
          setTeamMembers(response.data.data);
        } else {
          console.error("Error fetching team members:", response.data.message);
          setError({
            message:
              "Sorry for the inconvenience, we are having issues fetching our Team Members",
          });
          console.error("Error fetching team members:", error);
        }
      } catch (error) {
        setError({
          message:
            "Sorry for the inconvenience, we are having issues fetching our Team Members",
        });
        console.error("Error fetching team members:", error);
        // using local JSON data
        const testMembers = MemberData;
        setTeamMembers(testMembers);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAccessTypes = async () => {
      try {
        const response = await api.get("/api/user/fetchAccessTypes");

        if (response.status === 200) {
          const filteredAccess = response.data.filter(
            (accessType) => !["ADMIN", "USER", "ALUMNI"].includes(accessType)
          );
          setAccess(filteredAccess);
        } else {
          console.error("Error fetching Access Types:", response.data.message);
          // using local JSON data
          const testAccess = AccessTypes.data;
          const filteredAccess = testAccess.filter(
            (accessType) => !["ADMIN", "USER", "ALUMNI"].includes(accessType)
          );
          setAccess(filteredAccess);
        }
      } catch (error) {
        console.error("Error fetching Access Types:", error);
        // using local JSON data
        const testAccess = AccessTypes.data;
        const filteredAccess = testAccess.filter(
          (accessType) => !["ADMIN", "USER", "ALUMNI"].includes(accessType)
        );
        setAccess(filteredAccess);
      }
    };

    fetchAccessTypes();
    fetchTeamMembers();
  }, []);

  console.log(access);

  const directorAccessCodes = access.filter(
    (code) =>
      code.startsWith("PRESIDENT") ||
      code.startsWith("VICEPRESIDENT") ||
      code.startsWith("DIRECTOR_")
  );
  const roleMap = access.reduce((map, code) => {
    if (!directorAccessCodes.includes(code)) {
      let role = code
        .split("_")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
      if (role === "Operation") role = "Operations"; // Special case for Operations
      if (role === "Sponsorship") role = "Sponsorship & PR"; // Special case for Sponsorship & PR
      map[role] = code;
    }
    return map;
  }, {});

  const directorsAndAbove = teamMembers.filter((member) =>
    directorAccessCodes.includes(member.access)
  );
  const teamByRole = Object.keys(roleMap).map((role) => ({
    role,
    members: teamMembers.filter((member) => member.access === roleMap[role]),
  }));

  const TeamSection = ({ title, members, isDirector }) => {
    const membersPerRow = windowWidth < 500 ? 2 : 4;
    const remainderMembersCount = members.length % membersPerRow;
    const lastRowMembers =
      remainderMembersCount > 0 ? members.slice(-remainderMembersCount) : [];
    const otherMembers =
      remainderMembersCount > 0
        ? members.slice(0, -remainderMembersCount)
        : members;

    return (
      <div
        className={`${styles.teamSection} ${
          isDirector ? styles.directorSection : ""
        }`}
      >
        {title && <h3>{title}</h3>}
        <div
          className={`${styles.teamGrid} ${
            isDirector ? styles.directorGrid : ""
          }`}
        >
          {otherMembers.map((member, idx) => (
            <TeamCard
              key={idx}
              className="teamMember"
              name={member.name}
              image={member.img}
              social={member.extra}
              title={member.extra.title}
              role={member.access}
              know={member.extra.know}
            />
          ))}
        </div>
        {lastRowMembers.length > 0 && (
          <div className={styles.lastRowCentered}>
            {lastRowMembers.map((member, idx) => (
              <TeamCard
                key={idx}
                className="teamMember"
                name={member.name}
                image={member.img}
                social={member.extra}
                title={member.extra.title}
                role={member.access}
                know={member.extra.know}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.Team}>
      <h2>
        Meet Our{" "}
        <span
          style={{
            background: "var(--primary)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Team
        </span>
      </h2>
      <div className={styles.para}>
        <p>
          We are a tight-knit community of passionate people devoted to bringing
          about vibrant and awe-inspiring changes in the field of
          Entrepreneurship. The pillars of our crew are the Marketing group, the
          Creative group, the Technical group, and the Operations group.
        </p>
      </div>
      <div className={styles.circle}></div>
      {/* <div className={styles.circle2}></div> */}

      {isLoading ? (
        <ComponentLoading />
      ) : (
        <>
          {error && <div className={styles.error}>{error.message}</div>}

          <TeamSection members={directorsAndAbove} isDirector={true} />

          {teamByRole.map((section, index) => (
            <TeamSection
              key={index}
              title={
                <span>
                  <span style={{ color: "#fff" }}>Team </span>
                  <strong
                    style={{
                      background: "var(--primary)",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {section.role}
                  </strong>
                </span>
              }
              members={section.members}
              isDirector={false}
            />
          ))}
        </>
      )}

      <div className={styles.alumniBut}>
        <div className={styles.ulhover}>
          <Link to="/Alumni">
            <span style={{ color: "#fff" }}>Meet</span> Our Alumni
          </Link>
          <FaRegArrowAltCircleRight />
        </div>
      </div>
    </div>
  );
};

export default Team;
