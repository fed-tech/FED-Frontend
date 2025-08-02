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
import { ChatBot } from "../../features";


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
          const validMembers = response.data.data.filter(
            (member) => member.name !== null
          );
          const sortedMembers = validMembers.sort((a, b) => {
            if (b.year !== a.year) {
              return b.year - a.year;
            }
            return a.name.localeCompare(b.name);
          });
          setTeamMembers(sortedMembers);
        } else {
          console.error("Error fetching team members:", response.data.message);
          setError({
            message:
              "Sorry for the inconvenience, we are having issues fetching our Team Members",
          });
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
        setError({
          message:
            "Sorry for the inconvenience, we are having issues fetching our Team Members",
        });
        // const testMembers = MemberData.sort((a, b) => {
        //   if (b.year !== a.year) {
        //     return b.year - a.year;
        //   }
        //   return a.name.localeCompare(b.name);
        // });
        // setTeamMembers(testMembers);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAccessTypes = async () => {
      try {
        const response = await api.get("/api/user/fetchAccessTypes");

        if (response.status === 200) {
          const filteredAccess = response.data.data.filter(
            (accessType) =>
              !["ADMIN", "USER", "ALUMNI", "EX_MEMBER"].includes(accessType)
          );
          setAccess(filteredAccess);
        } else {
          setError({
            message:
              "Sorry for the inconvenience, we are having issues fetching our Team Members",
          });
          console.error("Error fetching Access Types:", response.data.message);
          // const testAccess = AccessTypes.data;
          // const filteredAccess = testAccess.filter(
          //   (accessType) => !["ADMIN", "USER", "ALUMNI"].includes(accessType)
          // );
          // setAccess(filteredAccess);
        }
      } catch (error) {
        setError({
          message:
            "Sorry for the inconvenience, we are having issues fetching our Team Members",
        });
        console.error("Error fetching Access Types:", error);
        // const testAccess = AccessTypes.data;
        // const filteredAccess = testAccess.filter(
        //   (accessType) => !["ADMIN", "USER", "ALUMNI"].includes(accessType)
        // );
        // setAccess(filteredAccess);
      }
    };

    fetchAccessTypes();
    fetchTeamMembers();
  }, []);

  // Define the director access codes in the desired order
  const boardAccessCodes = [
    "PRESIDENT",
    "VICEPRESIDENT",
    "DIRECTOR_TECHNICAL",
    "DIRECTOR_CREATIVE",
    "DIRECTOR_MARKETING",
    "DIRECTOR_OPERATIONS",
    "DIRECTOR_PR_AND_FINANCE",
    "DIRECTOR_HUMAN_RESOURCE",
    "DEPUTY_DIRECTOR_TECHNICAL",
    "DEPUTY_DIRECTOR_CREATIVE",
    "DEPUTY_DIRECTOR_MARKETING",
    "DEPUTY_DIRECTOR_OPERATIONS",
    "DEPUTY_DIRECTOR_PR_AND_FINANCE",
    "DEPUTY_DIRECTOR_HUMAN_RESOURCE",
  ];

  // Function to extract team name from SENIOR_EXECUTIVE access codes
  const extractTeamFromAccess = (access) => {
    if (access.startsWith("SENIOR_EXECUTIVE_")) {
      return access.replace("SENIOR_EXECUTIVE_", "");
    }
    return access;
  };

  // Function to get display role name
  const getDisplayRole = (access) => {
    const teamCode = extractTeamFromAccess(access);
    let role = teamCode
      .split("_")
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
    
    // Ensure consistent capitalization for role names
    switch (role.toLowerCase()) {
      case "pr and finance":
        role = "PR And Finance";
        break;
      case "human resource":
        role = "Human Resource";
        break;
      // Add other cases if needed for consistent capitalization
    }
    return role;
  };

  // Separate directors from other members
  const directorsAndAbove = teamMembers
    .filter((member) => boardAccessCodes.includes(member.access))
    .sort((a, b) => {
      const aIndex = boardAccessCodes.indexOf(a.access);
      const bIndex = boardAccessCodes.indexOf(b.access);

      return aIndex - bIndex; // Sort by access code order

      // return a.name.localeCompare(b.name); // Sort alphabetically within the same role
    });

  const otherMembers = teamMembers.filter(
    (member) => !boardAccessCodes.includes(member.access)
  );

  // Create a role map for non-director roles
  const roleMap = access.reduce((map, code) => {
    if (!boardAccessCodes.includes(code)) {
      const displayRole = getDisplayRole(code);
      const teamCode = extractTeamFromAccess(code);
      
      if (!map[displayRole]) {
        map[displayRole] = [];
      }
      map[displayRole].push(code);
    }
    return map;
  }, {});

  const teamByRole = Object.keys(roleMap)
    .map((role) => {
      const members = otherMembers.filter((member) => 
        roleMap[role].includes(member.access)
      );

      // Sort members: Senior Executives first, then others
      const seniorExecutives = members.filter((member) => 
        member.access.startsWith("SENIOR_EXECUTIVE_") || 
        member.extra?.designation === "Senior Executive"
      );
      const otherMembersWithoutSenior = members.filter((member) => 
        !member.access.startsWith("SENIOR_EXECUTIVE_") && 
        member.extra?.designation !== "Senior Executive"
      );

      return {
        role,
        members: [...seniorExecutives, ...otherMembersWithoutSenior],
      };
    })
    .filter((roleGroup) => roleGroup.members.length > 0)
    .sort((a, b) => {
      const order = [
        "Technical",
        "Creative",
        "Marketing",
        "Operations",
        "PR And Finance",
        "Human Resource",
      ];
      return order.indexOf(a.role) - order.indexOf(b.role);
    });

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
            <TeamCard key={idx} className="teamMember" member={member} />
          ))}
        </div>
        {lastRowMembers.length > 0 && (
          <div className={styles.lastRowCentered}>
            {lastRowMembers.map((member, idx) => (
              <TeamCard key={idx} className="teamMember" member={member} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.Team}>
         <ChatBot />
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
        <ComponentLoading
          customStyles={{
            width: "100%",
            height: "100%",
            display: "flex",
            marginTop: "5rem",
            marginBottom: "10rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      ) : (
        <>
          {error && <div className={styles.error}>{error.message}</div>}

          <TeamSection members={directorsAndAbove} isDirector={true} />

          <div className={styles.alumniBut}>
            <div className={styles.ulhover}>
              <Link to="/Alumni">
                <span style={{ color: "#fff" }}>Our</span> Alumni
              </Link>
              <FaRegArrowAltCircleRight />
            </div>
          </div>
          {teamByRole.map(
            (section, index) =>
              section.members.length > 0 && (
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
              )
          )}
        </>
      )}
    </div>
  );
};

export default Team;