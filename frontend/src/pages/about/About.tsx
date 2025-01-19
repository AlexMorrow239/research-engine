import { BannerType } from "@/common/enums";
import { Banner } from "@/components/common/banner/Banner";
import { Atom, BookOpen, Code } from "lucide-react";
import React from "react";
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
    icon: <Atom size={32} />,
    title: "Research Excellence",
    description:
      "Supporting groundbreaking research initiatives across multiple disciplines while fostering innovation and academic excellence.",
  },
  {
    icon: <BookOpen size={32} />,
    title: "Student Development",
    description:
      "Empowering students with hands-on research experience and mentorship opportunities to build their academic and professional careers.",
  },
  {
    icon: <Code size={32} />,
    title: "Technology Innovation",
    description:
      "Leveraging cutting-edge technology to connect students with research opportunities and facilitate meaningful collaborations.",
  },
];

const teamMembers: TeamMember[] = [
  {
    name: "Alex Kim",
    role: "President of Research Ambassadors",
    description:
      "Senior majoring in Neuroscience with a focus on cognitive development. Leading initiatives to expand research opportunities and foster interdisciplinary collaboration.",
  },
  {
    name: "Ethan Tieu",
    role: "Director of Operations",
    description:
      "Senior in Neuroscience with a minor in Business Administration. Coordinating research programs and developing strategic partnerships across departments.",
  },
  {
    name: "Alex Marrow",
    role: "Technical Lead",
    description:
      "Junior in Cell and Molecular Biology with expertise in bioinformatics. Managing platform development and implementing innovative technical solutions.",
  },
];

const About: React.FC = () => {
  return (
    <div className="about-page">
      <Banner type={BannerType.ABOUT} />

      <section className="hero-section" role="banner">
        <div className="content-wrapper">
          <div className="hero-content">
            <h1>
              Research Opportunities at Miami
              <span>Discover Your Potential</span>
            </h1>
            <p className="subtitle">
              Connect with world-class faculty and groundbreaking research
              projects across multiple disciplines at the University of Miami
            </p>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-value">200+</div>
                <div className="stat-label">Active Research Projects</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">50+</div>
                <div className="stat-label">Academic Departments</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">1000+</div>
                <div className="stat-label">Student Researchers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="content-section">
        <div className="mission-cards">
          {missionCards.map((card, index) => (
            <div key={index} className="mission-card" role="article">
              <div className="icon" aria-hidden="true">
                {card.icon}
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>

        <div className="content-block">
          <h2>Our Platform</h2>
          <p>
            The University of Miami Research Engine serves as a central hub for
            connecting students with diverse research opportunities across our
            campuses. Our platform streamlines the process of discovering and
            applying to research positions, making it easier for students to
            find projects that align with their academic interests and career
            goals.
          </p>
          <p>
            From marine science to artificial intelligence, from biomedical
            research to environmental studies, our platform showcases the
            breadth of Miami's research initiatives. We're committed to
            fostering an environment where innovation thrives and where students
            can engage with cutting-edge research that makes a real-world
            impact.
          </p>
        </div>

        <div className="content-block">
          <h2>Our Mission</h2>
          <p>
            At the heart of our mission is the belief that research experience
            is fundamental to academic excellence and professional growth. We
            strive to create meaningful connections between students and faculty
            mentors, facilitating opportunities that go beyond traditional
            classroom learning.
          </p>
          <p>
            Through our platform, students gain access to state-of-the-art
            facilities, mentorship from leading researchers, and opportunities
            to contribute to publications and presentations at prestigious
            conferences. These experiences help build the foundation for
            successful careers in research, academia, and industry.
          </p>
        </div>

        <div className="attribution">
          <p>
            Developed by{" "}
            <a
              href="https://bonsai.io"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Bonsai Applied Computations Group website"
            >
              Bonsai Applied Computations Group
            </a>{" "}
            in collaboration with the{" "}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Office of Undergraduate Research website"
            >
              Office of Undergraduate Research
            </a>
            . Supported by faculty guidance and alumni contributions.
          </p>
        </div>

        <section className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.name} className="team-member" role="article">
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
