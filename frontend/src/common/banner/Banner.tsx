import React from "react";
import { BannerType } from "@/common/enums";
import "./Banner.scss";

interface BannerProps {
  type: BannerType;
  title?: string;
  subtitle?: string;
}

const bannerImages: Record<BannerType, string> = {
  [BannerType.ABOUT]: "/images/banners/about-banner.jpg",
  [BannerType.RESEARCH]: "/images/banners/research-banner.jpg",
  [BannerType.LISTINGS]: "/images/banners/listings-banner.jpg",
  [BannerType.PROFILE]: "/images/banners/profile-banner.jpg",
};

export const Banner: React.FC<BannerProps> = ({ type, title, subtitle }) => {
  return (
    <div className="banner">
      <img
        src={bannerImages[type]}
        alt={`${type} banner`}
        className="banner-image"
      />
      {(title || subtitle) && (
        <div className="banner-content">
          {title && <h1>{title}</h1>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
    </div>
  );
};
