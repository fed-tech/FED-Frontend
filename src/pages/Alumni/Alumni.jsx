import { useState, useEffect } from "react";
import { api } from "../../services";
import styles from "./styles/Alumni.module.scss";
import { TeamCard } from "../../components";
import useWindowWidth from "../../utils/hooks/useWindowWidth"; // Import useWindowWidth hook
import MemberData from "../../data/Team.json"; // Local fallback data
import { ComponentLoading } from "../../microInteraction";

const Alumni = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [alumni, setAlumni] = useState([]);
  const [Error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await api.get("/api/user/fetchTeam");

        if (response.status === 200) {
          const fileteredAlumni = response.data.filter(
            (member) => member.access === "ALUMNI"
          );
          setAlumni(fileteredAlumni);
        } else {
          console.error("Error fetching our Alumnis:", response.data.message);
          // using local JSON data
          const testMembers = MemberData;
          const fileteredAlumni = testMembers.filter(
            (member) => member.access === "ALUMNI"
          );
          setAlumni(fileteredAlumni);
        }
      } catch (error) {
        setError({
          message:
            "Sorry for the inconvenience, we are having issues fetching our Alumni",
        });
        console.error("Error fetching our Alumnis:", error);
        // using local JSON data
        // const testMembers = MemberData;
        // const fileteredAlumni = testMembers.filter(
        //   (member) => member.access === "ALUMNI"
        // );
        // setAlumni(fileteredAlumni);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  const AlumniSection = ({ alumni }) => {
    const windowWidth = useWindowWidth();
    const membersPerRow = windowWidth < 500 ? 2 : 4;
    const remainderMembersCount = alumni.length % membersPerRow;
    const lastRowMembers =
      remainderMembersCount > 0 ? alumni.slice(-remainderMembersCount) : [];
    const otherMembers =
      remainderMembersCount > 0
        ? alumni.slice(0, -remainderMembersCount)
        : alumni;

    return (
      <div className={styles.alumniSection}>
        <div className={styles.alumniGrid}>
          {otherMembers.map((member, idx) => (
            <TeamCard
              key={idx}
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
    <div className={styles.Alumni}>
      <h2>
        Meet Our{" "}
        <span
          style={{
            background: "var(--primary)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Alumni
        </span>
      </h2>
      {/* <div className={styles.circle}></div> */}
      {/* <div className={styles.circle2}></div> */}
      {isLoading ? (
        <ComponentLoading />
      ) : (
        <>
          {Error && <div className={styles.error}>{Error.message}</div>}
          <AlumniSection alumni={alumni} />
        </>
      )}
    </div>
  );
};

export default Alumni;
