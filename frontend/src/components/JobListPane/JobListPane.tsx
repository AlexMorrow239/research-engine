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
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLDivElement>, 
    id: number
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onJobClick(id);
    }
  };

  return (
    <div className="job-list">
      {Object.entries(jobData).map(([id, job]) => {
        const jobId = parseInt(id);
        const isSelected = selectedJobId === jobId;
        
        return (
          <div
            key={id}
            className={`job-list__item ${
              isSelected ? "job-list__item--selected" : ""
            }`}
            onClick={() => onJobClick(jobId)}
            onKeyPress={(e) => handleKeyPress(e, jobId)}
            role="button"
            tabIndex={0}
            aria-selected={isSelected}
          >
            {job.imgUrl && (
              <div className="job-list__image-container">
                <img
                  src={job.imgUrl}
                  alt={`${job.title}`}
                  className="job-list__image"
                />
              </div>
            )}
            <div className="job-list__content">
              <h2 className="job-list__title">{job.title}</h2>
              <p className="job-list__snippet">{job.snippet}</p>
              <p className="job-list__faculty">{job.faculty}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobListPane;