import React from "react";
import { useNavigate } from "react-router-dom";

function JobDetailPane({ job }) {
  const navigate = useNavigate();

  if (!job) {
    return (
      <div className="job-detail-pane">
        <div className="detail-content">
          <h2>Click a job on the left to see its details here</h2>
          <p>Details will appear in this panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="job-detail-pane">
      <div className="detail-content">
        <h2 className="detail-title-right">{job.title}</h2>
        <br />
        <h4>Overview of general focus of lab</h4>
        <p>{job.labFocus || "No information provided"}</p>
        <br />
        <h4>List of active research projects</h4>
        <p>{job.researchProjects || "No information provided"}</p>
        <br />
        <h4>Number of open lab positions</h4>
        <p>{job.openPositions || "Not specified"}</p>
        <br />
        <h4>Research Category</h4>
        <p>{(job.researchCategory || []).join(", ") || "No categories listed"}</p>
        <br />
        <h4>Office Location</h4>
        <p>{job.officeLocation || "Location not specified"}</p>
        <br />
        <h4>Expectations</h4>
        <p>Number of hours per week: {job.hoursPerWeek || "Not specified"}</p>
        <p>Length of project: {job.projectLength || "Not specified"}</p>
        <p>Specific courses required: {job.requiredCourses || "None"}</p>
        <br />
        {/* <h4>List of Publications and Citations</h4> */}
        {/* <ul>
          {(job.publications || []).map((pub, index) => (
            <li key={index}>
              <a href={pub.link} target="_blank" rel="noopener noreferrer">
                {pub.title}
              </a>
            </li>
          ))}
        </ul>
        <br /> */}
        <button
          className="apply-button"
          onClick={() => navigate(`/job/${job.id}/apply`)} // Navigate to the apply page
        >
          Apply now
        </button>
      </div>
    </div>
  );
}

export default JobDetailPane;
