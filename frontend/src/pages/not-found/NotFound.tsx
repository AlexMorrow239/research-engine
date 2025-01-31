import React from "react";

import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

import "./NotFound.scss";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="hero-section" role="banner">
        <div className="content-wrapper">
          <div className="hero-content">
            <h1>
              404
              <span>Page Not Found</span>
            </h1>
            <p className="subtitle">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <button className="btn btn--primary" onClick={() => navigate(-1)}>
              <ArrowLeft className="icon" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
