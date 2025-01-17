import React from "react";
import { Users, Globe, Microscope } from "lucide-react";
import "./About.scss";

interface TeamMember {
  name: string;
  role: string;
  description: string;
}

interface MissionCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const missionCards: MissionCard[] = [
  {
    icon: <Microscope size={32} />,
    title: "Research Excellence",
    description:
      "Supporting groundbreaking research across multiple disciplines and fostering innovation.",
  },
  {
    icon: <Users size={32} />,
    title: "Student Engagement",
    description:
      "Connecting students with mentors and providing hands-on research experience.",
  },
  {
    icon: <Globe size={32} />,
    title: "Global Impact",
    description:
      "Contributing to solutions for real-world challenges through collaborative research.",
  },
];

const teamMembers: TeamMember[] = [
  {
    name: "Alex Kim",
    role: "President of Research Ambassadors",
    description:
      "Senior majoring in neuroscience from Long Island, New York, leading initiatives to expand research opportunities.",
  },
  {
    name: "Ethan Tieu",
    role: "Director of Operations",
    description:
      "Senior majoring in Neuroscience from Huntington Woods, Michigan, coordinating research programs and events.",
  },
  {
    name: "Alex Marrow",
    role: "Technical Lead",
    description:
      "Junior majoring in Cell and Molecular Biology, managing the platform's technical infrastructure.",
  },
  {
    name: "Andrew Luthringer",
    role: "Outreach Coordinator",
    description: "Fuck this sorry ass kid",
  },
];

const About: React.FC = () => {
  return (
    <div className="about-page">
      <section className="hero-section">
        <div className="content-wrapper">
          <h1>Advancing Research at Miami</h1>
          <p className="subtitle">
            Connecting passionate students with groundbreaking research
            opportunities across the University of Miami's campuses.
          </p>
        </div>
      </section>

      <div className="content-section">
        <div className="mission-cards">
          {missionCards.map((card, index) => (
            <div key={index} className="mission-card">
              <div className="icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>

        <div className="content-block">
          <h2>Our Platform</h2>
          <p>
            The University of Miami Research Engine is designed to help students
            discover, connect with, and apply to research projects across our
            Coral Gables and Rosenstiel School campuses. Whether you're an
            undergraduate seeking your first lab experience or a seasoned
            graduate researcher looking for cross-disciplinary collaborations,
            our platform provides a centralized space for opportunities within
            the UMiami research community.
          </p>
          <p>
            By searching through faculty-led projects, students can explore
            topics in marine affairs, biomedical innovations, data analytics,
            climate science, and more. Our curated listings span multiple
            departments and institutes, reflecting the University of Miami's
            commitment to creative, interdisciplinary problem-solving.
          </p>
        </div>

        <div className="content-block">
          <h2>Our Mission</h2>
          <p>
            Research is a core pillar of our mission, fostering hands-on
            learning experiences and supporting breakthroughs that impact
            communities at local, national, and global levels. Our students
            benefit from exposure to cutting-edge technology, mentorship from
            renowned experts, and the chance to co-author papers or present at
            international conferences.
          </p>
        </div>

        <div className="attribution">
          <p>
            This platform was created by{" "}
            <a
              href="https://bonsai.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bonsai Applied Computations Group
            </a>{" "}
            and is maintained by the{" "}
            <a href="#" target="_blank" rel="noopener noreferrer">
              Office of Undergraduate Research
            </a>{" "}
            with faculty and student support, as well as a generous alumni gift.
          </p>
        </div>

        <section className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.name} className="team-member">
                <h3>{member.name}</h3>
                <h4>{member.role}</h4>
                <p>{member.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
