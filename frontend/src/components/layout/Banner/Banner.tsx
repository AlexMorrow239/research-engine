import React from "react";
import "./Banner.scss";

const Banner: React.FC = () => {
  return (
    <div className="banner">
      <img 
        src="/images/banner.png" 
        alt="Research opportunities banner" 
        className="banner__image"
      />
    </div>
  );
};

export default Banner;