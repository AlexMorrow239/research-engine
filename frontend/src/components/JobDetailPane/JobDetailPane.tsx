import React from "react";
import { useNavigate } from "react-router-dom";
import "./JobDetailPane.scss";
import { Job } from "@/types";

interface JobDetailPaneProps {
  job: Job | null;
}

const JobDetailPane: React.FC<JobDetailPaneProps> = ({ job }) => {
  const navigate = useNavigate();

  if (!job) {
    return (
      <div className="job-detail">
        <div className="job-detail__empty">
          <h2 className="job-detail__empty-title">
            Click a job on the left to see its details here
          </h2>
          <p className="job-detail__empty-text">
            Details will appear in this panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="job-detail">
      <div className="job-detail__content">
        <h2 className="job-detail__title">{job.title}</h2>
        
        <div className="job-detail__section">
          <h4 className="job-detail__subtitle">Overview of general focus of lab</h4>
          <p className="job-detail__text">{job.labFocus || "No information provided"}</p>
        </div>

        <div className="job-detail__section">
          <h4 className="job-detail__subtitle">List of active research projects</h4>
          <p className="job-detail__text">{job.researchProjects || "No information provided"}</p>
        </div>

        <div className="job-detail__section">
          <h4 className="job-detail__subtitle">Number of open lab positions</h4>
          <p className="job-detail__text">{job.openPositions || "Not specified"}</p>
        </div>

        <div className="job-detail__section">
          <h4 className="job-detail__subtitle">Research Category</h4>
          <p className="job-detail__text">
            {(job.researchCategory || []).join(", ") || "No categories listed"}
          </p>
        </div>

        <div className="job-detail__section">
          <h4 className="job-detail__subtitle">Office Location</h4>
          <p className="job-detail__text">{job.officeLocation || "Location not specified"}</p>
        </div>

        <div className="job-detail__section">
          <h4 className="job-detail__subtitle">Expectations</h4>
          <p className="job-detail__text">
            Number of hours per week: {job.hoursPerWeek || "Not specified"}
          </p>
          <p className="job-detail__text">
            Length of project: {job.projectLength || "Not specified"}
          </p>
          <p className="job-detail__text">
            Specific courses required: {job.requiredCourses || "None"}
          </p>
        </div>

        {/* Publications section commented out for now */}
        {/* <div className="job-detail__section">
          <h4 className="job-detail__subtitle">List of Publications and Citations</h4>
          <ul className="job-detail__publications">
            {(job.publications || []).map((pub, index) => (
              <li key={index} className="job-detail__publication">
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="job-detail__publication-link"
                >
                  {pub.title}
                </a>
              </li>
            ))}
          </ul>
        </div> */}

        <button
          className="job-detail__apply-button"
          onClick={() => navigate(`/job/${job.id}/apply`)}
        >
          Apply now
        </button>
      </div>
    </div>
  );
};

export default JobDetailPane;