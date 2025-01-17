import React from "react";
import "./About.scss";

interface TeamMember {
  name: string;
  role: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Alex Kim",
    role: "President of Research Ambassadors",
    description:
      "Stephen is the President of The Research Ambassadors, and is a senior majoring in neuroscience from Long Island, New York.",
  },
  {
    name: "Ethan Tieu",
    role: "President of Research Ambassadors",
    description:
      "Emily is the Secretary of the Research Ambassadors and is a senior majoring in Neuroscience from Huntington Woods, Michigan.",
  },
  {
    name: "Alex Marrow",
    role: "Developer",
    description:
      "Brooke is the treasurer of the Research Ambassadors, and is a junior majoring in Cell and Molecular Biology from Southbury, CT.",
  },
  {
    name: "Andrew Luthringer",
    role: "Developer",
    description:
      "Paresh is the Director of Outreach and a native of Lafayette, LA. He is a third-year student majoring in Neuroscience.",
  },
];

const About: React.FC = () => {
  return (
    <div className="about-page">
      <div className="content-section">
        <h1>About</h1>

        <p>
          The University of Miami Research Engine is designed to help students
          discover, connect with, and apply to research projects across our
          Coral Gables and Rosenstiel School campuses. Whether you're an
          undergraduate seeking your first lab experience or a seasoned graduate
          researcher looking for cross-disciplinary collaborations, our platform
          provides a centralized space for opportunities within the UMiami
          research community.
        </p>

        <p>
          By searching through faculty-led projects, students can explore topics
          in marine affairs, biomedical innovations, data analytics, climate
          science, and more. Our curated listings span multiple departments and
          institutes, reflecting the University of Miami's commitment to
          creative, interdisciplinary problem-solving. We encourage faculty
          mentors and principal investigators to use the "List a Position"
          option to share research openings with qualified students.
        </p>

        <p>
          Research is a core pillar of our mission, fostering hands-on learning
          experiences and supporting breakthroughs that impact communities at
          local, national, and global levels. Our students benefit from exposure
          to cutting-edge technology, mentorship from renowned experts, and the
          chance to co-author papers or present at international conferences.
        </p>

        <div className="attribution">
          <p>
            This database was created by{" "}
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
          <h2>Undergraduate Research & Fellowships Staff</h2>
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
