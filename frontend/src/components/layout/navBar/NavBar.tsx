import { Link, useLocation } from "react-router-dom";
import "./NavBar.scss";
import { useState } from "react";

export const NavBar = () => {
  const location = useLocation();
  const isAuthenticated = false; // Replace with your auth logic
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? "nav__link--active" : "";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="nav">
      <div className="nav__container">
        {/* University Logo Section */}
        <div className="nav__brand">
          <Link to="/" className="nav__logo">
            <img
              src="/images/navBar/miami-ugr.png"
              alt="University of Miami Office of Undergraduate Research and Community Outreach"
              className="nav__university-logo"
            />
          </Link>
        </div>

        {/* Hamburger Menu Button */}
        <button
          className={`nav__menu-toggle ${
            isMenuOpen ? "nav__menu-toggle--open" : ""
          }`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Main Navigation */}
        <div className={`nav__menu ${isMenuOpen ? "nav__menu--open" : ""}`}>
          <Link
            to="/"
            className={`nav__link ${isActive("/")}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`nav__link ${isActive("/about")}`}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/positions"
            className={`nav__link ${isActive("/positions")}`}
            onClick={() => setIsMenuOpen(false)}
          >
            List a Position
          </Link>
          <Link
            to="/listings"
            className={`nav__link ${isActive("/listings")}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Your Listings
          </Link>
        </div>

        {/* Powered By Section */}
        <div className="nav__powered-by">
          <img
            src="/images/navBar/powered-by-bonsai.png"
            alt="Powered by Bonsai"
            className="nav__bonsai-logo"
          />
        </div>
      </div>
    </nav>
  );
};
