import React from "react";
import "./JobListPane.scss";
import { Job } from "@/types";



interface JobListPaneProps {
  jobData: Record<string, Job>;
  onJobClick: (id: number) => void;
  selectedJobId: number | null;
}

const JobListPane: React.FC<JobListPaneProps> = ({
  jobData,
  onJobClick,
  selectedJobId,
}) => {
  return (
    <div className="job-list">
      {Object.entries(jobData).map(([id, job]) => (
        <div
          key={id}
          className={`job-list__item ${
            selectedJobId === parseInt(id) ? "job-list__item--selected" : ""
          }`}
          onClick={() => onJobClick(parseInt(id))}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onJobClick(parseInt(id));
            }
          }}
        >
          <div className="job-list__image-container">
            {job.imgUrl && (
              <img
                src={job.imgUrl}
                alt={`${job.title} thumbnail`}
                className="job-list__image"
              />
            )}
          </div>
          <div className="job-list__content">
            <h2 className="job-list__title">{job.title}</h2>
            <p className="job-list__snippet">{job.snippet}</p>
            <p className="job-list__faculty">{job.faculty}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobListPane;