import React from "react";
import { BannerType } from "../../../common/enums";
import "./Banner.scss";

interface BannerProps {
  type: BannerType;
}

interface BannerContent {
  title: string;
  subtitle: string;
  image: string;
}

const bannerContent: Record<BannerType, BannerContent> = {
  [BannerType.ABOUT]: {
    title: "About Our Research Platform",
    subtitle: "Learn about our mission and the team behind the platform",
    image: "/images/banners/about-banner.jpg",
  },
  [BannerType.RESEARCH]: {
    title: "Research Opportunities",
    subtitle: "Explore and apply to research positions across campus",
    image: "/images/banners/research-banner.jpg",
  },
};

export const Banner: React.FC<BannerProps> = ({ type }) => {
  const content = bannerContent[type];

  return (
    <div className="banner">
      <img src={content.image} alt={content.title} className="banner-image" />
      <div className="banner-content">
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
      </div>
    </div>
  );
};
