import { BANNER_CONTENT } from "@/common/constants";
import { type BannerType } from "@/common/enums";

import "./Banner.scss";

interface BannerProps {
  type: BannerType;
}

export const Banner: React.FC<BannerProps> = ({ type }) => {
  const content = BANNER_CONTENT[type];

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
