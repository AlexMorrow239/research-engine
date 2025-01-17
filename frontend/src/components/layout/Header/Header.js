import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.scss";

function Header({ openLoginModal }) {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-logo-btn">
          <img src="/images/ResearchIMG.png" alt="Logo" />
        </Link>
      </div>
      <div className="header-center">
        <nav>
          <Link
            to="/"
            className={`nav-button ${
              location.pathname === "/" ? "active" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`nav-button ${
              location.pathname === "/about" ? "active" : ""
            }`}
          >
            About
          </Link>
          <Link
            to="/listposition"
            className={`nav-button ${
              location.pathname === "/listposition" ? "active" : ""
            }`}
          >
            List a Position
          </Link>
          <Link
            to="/your-listings"
            className={`nav-button ${
              location.pathname === "/your-listings" ? "active" : ""
            }`}
          >
            Your Listings
          </Link>

          {/* <button className="nav-button" onClick={openLoginModal}>
            List a Position
          </button> */}
        </nav>
      </div>
      <div className="header-right">
        <a
          href="https://bonsaiACG.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/images/powered_by_bonsai.png" alt="Logo" />
        </a>
      </div>
    </header>
  );
}

export default Header;
