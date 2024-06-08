import React from 'react';
import styles from './Styles/TeamPage.module.scss'; // Adjust the path to your styles
import teamMembers from '../../data/teamMembers.json'; // Import the JSON data

const TeamMember = ({ name, image }) => {
  return (
    <div className={styles['team-member']}>
      <img src={image} alt={name} className={styles['team-member-img']} />
      <div className={styles['team-member-info']}>
        <h3 style={{ color: '#fff' }}>{name}</h3>
      </div>
    </div>
  );
};


const TeamSection = ({ title, members }) => {
  return (
    <div className={styles['team-section']}>
      <h3>{title}</h3>
      <div className={styles['team-grid']}>
        {members.map((member, idx) => (
          <TeamMember
            key={idx}
            name={member.name}
            image={member.image}
          />
        ))}
      </div>
    </div>
  );
};

const Team = () => {
  const roles = ['Director', 'Technical', 'Creative', 'Marketing', 'Operations' , 'Sponsorship & PR'];
  const teamByRole = roles.map(role => ({
    role,
    members: teamMembers.filter(member => member.role === role)
  }));

  return (
    <div>
      <h2>Meet Our <span>Team</span></h2>
      {teamByRole.filter(section => section.role === 'Director').map((section, index) => (
        <TeamSection
          key={index}
          // title="Directors"
          members={section.members}
        />
      ))}
      {teamByRole.filter(section => section.role !== 'Director').map((section, index) => (
      <TeamSection
      key={index}
      title={
        <span>
          <span style={{ color: '#fff' }}>Team </span>{section.role}
        </span>
      }
      members={section.members}
    />
      ))}
    </div>
  );
};

function Teams() {
  return (
    <div className={styles.Team}>
      <Team />
    </div>
  );
}

export default Teams;
