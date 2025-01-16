import React from "react";

function JobListPane({ jobData, onJobClick, selectedJobId }) {
  return (
    <div className="job-listing-pane">
      {Object.entries(jobData).map(([id, job]) => (
        <div
          key={id}
          className={`job-item ${selectedJobId === parseInt(id) ? "selected-job" : ""}`} // Add "selected-job" class if it's selected
          onClick={() => onJobClick(parseInt(id))} // Convert string ID to number
        >
          <div className="job-item-img-container">
            {job.imgUrl && (
              <img src={job.imgUrl} alt={job.title} className="job-item-img" />
            )}
          </div>
          <div className="job-item-content">
            <h2>{job.title}</h2>
            <p className="detail-snippetleft">{job.snippet}</p>
            <br />
            <p className="detail-faculty">{job.faculty}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobListPane;
