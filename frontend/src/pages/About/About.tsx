import React from "react";
import Header from "../../components/layout/Header/Header";
import "./About.scss";

interface StaffMember {
  name: string;
  title: string;
  description: string;
}

interface AboutProps {
  onNavigate: () => void;
}

const staffMembers: StaffMember[] = [
  {
    name: "Alex Kim",
    title: "President of Research Ambassadors",
    description:
      "Stephen is the President of The Research Ambassadors, and is a senior majoring in neuroscience from Long Island, New York.",
  },
  {
    name: "Ethan Tieu",
    title: "President of Research Ambassadors",
    description:
      "Emily is the Secretary of the Research Ambassadors and is a senior majoring in Neuroscience from Huntington Woods, Michigan.",
  },
  {
    name: "Alex Marrow",
    title: "Developer",
    description:
      "Brooke is the treasurer of the Research Ambassadors, and is a junior majoring in Cell and Molecular Biology from Southbury, CT.",
  },
  {
    name: "Andrew Luthringer",
    title: "Developer",
    description:
      "Paresh is the Director of Outreach and a native of Lafayette, LA. He is a third-year student majoring in Neuroscience.",
  },
];

const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="about">
      <Header/>

      <div className="about__banner">
        <img
          src="/images/architecture_2990_pbc-hpr-1280x852.jpg"
          alt="About Banner"
        />
      </div>

      <div className="about__container">
        <h1 className="about__title">About</h1>
        <p className="about__paragraph">
          The University of Miami Research Engine is designed to help students
          discover, connect with, and apply to research projects across our
          Coral Gables and Rosenstiel School campuses. Whether you're an
          undergraduate seeking your first lab experience or a seasoned graduate
          researcher looking for cross-disciplinary collaborations, our platform
          provides a centralized space for opportunities within the UMiami
          research community.
        </p>
        <p className="about__paragraph">
          By searching through faculty-led projects, students can explore topics
          in marine affairs, biomedical innovations, data analytics, climate
          science, and more. Our curated listings span multiple departments and
          institutes, reflecting the University of Miami's commitment to
          creative, interdisciplinary problem-solving. We encourage faculty
          mentors and principal investigators to use the "List a Position"
          option to share research openings with qualified students.
        </p>
        <p className="about__paragraph">
          Research is a core pillar of our mission, fostering hands-on learning
          experiences and supporting breakthroughs that impact communities at
          local, national, and global levels. Our students benefit from exposure
          to cutting-edge technology, mentorship from renowned experts, and the
          chance to co-author papers or present at international conferences.
        </p>
        <p className="about__paragraph">
          The University of Miami Research Engine is maintained by the Office of
          Undergraduate Research &amp; Community Outreach, with support from the
          Graduate School and faculty champions in each academic unit. We are
          grateful to our donors, alumni, and the Hurricanes community, who
          enable us to broaden research opportunities for every scholar on
          campus.
        </p>
        <p className="about__paragraph">
          This database was created by{" "}
          <a href="https://bonsaiACG.com">Bonsai Applied Computations Group</a>{" "}
          and is maintained by the{" "}
          <a href="https://ugr.miami.edu/">Office of Undergraduate Research</a>{" "}
          with faculty and student support, as well as a generous alumni gift.
        </p>
        <hr className="about__divider" />
        <h3 className="about__staff-heading">
          Undergraduate Research & Fellowships Staff
        </h3>

        <div className="about__staff-container">
          {staffMembers.map((member, index) => (
            <div key={index} className="about__staff-card">
              <h4>{member.name}</h4>
              <p>
                <strong>{member.title}</strong>
              </p>
              <p>{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
