import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.scss"

interface HeaderProps {
  onNavigate?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const location = useLocation();

  const isActiveRoute = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header__left">
        <Link to="/" className="header__logo-link">
          <img 
            src="/images/ResearchIMG.png" 
            alt="Research Logo" 
            className="header__logo"
          />
        </Link>
      </div>

      <nav className="header__nav">
        <Link
          to="/"
          className={`header__nav-link ${
            isActiveRoute("/") ? "header__nav-link--active" : ""
          }`}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`header__nav-link ${
            isActiveRoute("/about") ? "header__nav-link--active" : ""
          }`}
        >
          About
        </Link>
        <Link
          to="/listposition"
          className={`header__nav-link ${
            isActiveRoute("/listposition") ? "header__nav-link--active" : ""
          }`}
        >
          List a Position
        </Link>
        <Link
          to="/your-listings"
          className={`header__nav-link ${
            isActiveRoute("/your-listings") ? "header__nav-link--active" : ""
          }`}
        >
          Your Listings
        </Link>
      </nav>

      <div className="header__right">
        <a
          href="https://bonsaiACG.com"
          target="_blank"
          rel="noopener noreferrer"
          className="header__partner-link"
        >
          <img 
            src="/images/powered_by_bonsai.png" 
            alt="Powered by Bonsai" 
            className="header__partner-logo"
          />
        </a>
      </div>
    </header>
  );
};

export default Header;