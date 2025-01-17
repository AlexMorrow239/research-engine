import React from "react";
import Header from "../../components/layout/Header/Header";

function About({ onNavigate }) {
  return (
    <div>
      {/* Header */}
      <Header onNavigate={onNavigate} />

      {/* Banner */}
      <div className="banner">
        <img
          src="/images/architecture_2990_pbc-hpr-1280x852.jpg"
          alt="About Banner"
          style={{
            width: "100%",
            height: "340px",
          }}
        />
      </div>

      {/* About content */}
      <div className="about-container">
        <h1>About</h1>
        <p>
          The University of Miami Research Engine is designed to help students
          discover, connect with, and apply to research projects across our
          Coral Gables and Rosenstiel School campuses. Whether you’re an
          undergraduate seeking your first lab experience or a seasoned graduate
          researcher looking for cross-disciplinary collaborations, our platform
          provides a centralized space for opportunities within the UMiami
          research community.
        </p>
        <p>
          By searching through faculty-led projects, students can explore topics
          in marine affairs, biomedical innovations, data analytics, climate
          science, and more. Our curated listings span multiple departments and
          institutes, reflecting the University of Miami’s commitment to
          creative, interdisciplinary problem-solving. We encourage faculty
          mentors and principal investigators to use the “List a Position”
          option to share research openings with qualified students.
        </p>
        <p>
          Research is a core pillar of our mission, fostering hands-on learning
          experiences and supporting breakthroughs that impact communities at
          local, national, and global levels. Our students benefit from exposure
          to cutting-edge technology, mentorship from renowned experts, and the
          chance to co-author papers or present at international conferences.
        </p>
        <p>
          The University of Miami Research Engine is maintained by the Office of
          Undergraduate Research &amp; Community Outreach, with support from the
          Graduate School and faculty champions in each academic unit. We are
          grateful to our donors, alumni, and the Hurricanes community, who
          enable us to broaden research opportunities for every scholar on
          campus.
        </p>
        <p>
          This database was created by{" "}
          <a href="https://bonsaiACG.com">Bonsai Applied Computations Group</a>{" "}
          and is maintained by the{" "}
          <a href="https://ugr.miami.edu/">Office of Undergraduate Research</a>{" "}
          with faculty and student support, as well as a generous alumni gift.
        </p>
        <hr className="divider" />
        <h3>Undergraduate Research & Fellowships Staff</h3>
        {/* Staff Cards */}
        <div className="staff-container">
          <div className="staff-card">
            <h4>Alex Kim</h4>
            <p>
              <strong>President of Research Ambassadors</strong>
            </p>
            <p>
              Stephen is the President of The Research Ambassadors, and is a
              senior majoring in neuroscience from Long Island, New York.
            </p>
          </div>
          <div className="staff-card">
            <h4>Ethan Tieu </h4>
            <p>
              <strong>President of Research Ambassadors</strong>
            </p>
            <p>
              Emily is the Secretary of the Research Ambassadors and is a senior
              majoring in Neuroscience from Huntington Woods, Michigan.
            </p>
          </div>
          <div className="staff-card">
            <h4>Alex Marrow</h4>
            <p>
              <strong>Developer</strong>
            </p>
            <p>
              Brooke is the treasurer of the Research Ambassadors, and is a
              junior majoring in Cell and Molecular Biology from Southbury, CT.
            </p>
          </div>
          <div className="staff-card">
            <h4>Andrew Luthringer</h4>
            <p>
              <strong>Developer</strong>
            </p>
            <p>
              Paresh is the Director of Outreach and a native of Lafayette, LA.
              He is a third-year student majoring in Neuroscience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
