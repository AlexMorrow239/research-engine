import React from "react";
import { useParams } from "react-router-dom";

const JobApplicationPage = ({ jobData }) => {
  const { id } = useParams();
  const job = jobData[id];

  if (!job) {
    return <div>Job not found!</div>;
  }

  return (
    <div className="job-application-page">
      <a href="/" className="back-to-research">← Back to Research</a>
      <br/><br />

      <h2 className="job-title">{job.title}</h2>

      {job.imgUrl && job.imgUrl.trim() !== "" && (
        <img src={job.imgUrl} alt={job.title} className="job-image" />
      )}

      <div className="job-details">
        <div className="detail-section">
          <h4>Associated Faculty</h4>
          <p>{job.faculty}</p>
        </div>
        <div className="detail-section">
          {/* <h4>Website</h4>
          <p>
            <a href="https://example.com" target="_blank" rel="noopener noreferrer">
              https://example.com
            </a>
          </p> */}
        </div>
      </div>

      <h4 className="description-title">Description</h4>
      <p className="job-description">{job.snippet}</p>

      <h4 className="description-title">Overview of general focus of lab</h4>
      <p className="job-description">{job.labFocus}</p>

      <h4 className="description-title">Number of open lab positions</h4>
      <p className="job-description">{job.openPositions}</p>

      <h4 className="description-title">Research Category</h4>
      <p className="job-description">{job.researchCategory}</p>

      <h4 className="description-title">Office Location</h4>
      <p className="job-description">{job.officeLocation}</p>

      <h4 className="description-title">Expectations</h4>
      <p className="job-description">Number of hours per week: {job.hoursPerWeek}</p>
      <p className="job-description">Length of project:  {job.projectLength}</p>
      <p className="job-description">Specific courses required:  {job.requiredCourses}</p>


      <hr className="thin-divider" />

      <h3>Connect</h3>

      <form className="application-form">
        <label>
          Your Name:
          <input type="text" name="name" placeholder="Name" required />
        </label>
        <label>
          CNumber:
          <input type="cnumber" name="cnumber" placeholder="CNumber " required />
        </label>
        <label>
          Email Address:
          <input type="email" name="email" placeholder="Email" required />
        </label>
        <label>
          Phone Number:
          <input type="phonenumber" name="phonenumber"  placeholder="Phone Number" required />
        </label>
        <label>
          Major(s):
          <input type="major" name="major" placeholder="Major(s)" required />
        </label>
        <label>
          Minor(s):
          <input type="minor" name="minor" placeholder="Minor(s)" required />
        </label>
        <label>
          Academic Standing:
          <input type="standing" name="standing"  placeholder="eg. Junior" required />
        </label>
        <label>
          Graduation Date:
          <input type="graddate" name="graddate" placeholder="eg. May 2026" required />
        </label>
        <label>
          Current Cumulative GPA:
          <input type="gpa" name="gpa"  placeholder="GPA" required />
        </label>
        <label>
          Weekly Availability:
          <input type="availability" name="availability"  placeholder="Weekly Availability" required />
        </label>
        <label>
          Resume and Optional Cover Letter:
          <input type="file" accept=".pdf,.docx,.doc" required />
        </label>
        <label>
          Why are you interested in this position?
          <textarea name="interest" required></textarea>
        </label>
        <button type="submit" className="submit-button">Submit Application</button>
      </form>
    </div>
  );
};

export default JobApplicationPage;
