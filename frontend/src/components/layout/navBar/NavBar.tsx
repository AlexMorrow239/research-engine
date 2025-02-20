import { useState } from "react";

import { Link, NavLink } from "react-router-dom";

import ugrLogo from "@/assets/images/miami-ugr.png";
import poweredBy from "@/assets/images/powered-by-bonsai.png";
import { navigationItems } from "@/config/navigation";

import "./NavBar.scss";

export const NavBar = ({
  hideUgrLogo = true,
}: {
  hideUgrLogo?: boolean;
}): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = (): void => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="nav">
      <div className="nav__container">
        {!hideUgrLogo && (
          <div className="nav__brand">
            <Link to="/" className="nav__logo" onClick={handleNavLinkClick}>
              <img
                src={ugrLogo}
                alt="University Logo"
                className="nav__university-logo"
              />
            </Link>
          </div>
        )}

        <div
          className={`nav__menu ${isMobileMenuOpen ? "nav__menu--open" : ""}`}
        >
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav__link ${isActive ? "nav__link--active" : ""}`
              }
              onClick={handleNavLinkClick}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Powered By section */}
        <div className="nav__powered-by">
          <Link to="https://bonsaiacg.com/" className="nav__logo">
            <img
              src={poweredBy}
              alt="Bonsai Logo"
              className="nav__bonsai-logo"
            />
          </Link>
        </div>

        {/* Mobile menu toggle button */}
        <button
          className={`nav__menu-toggle ${
            isMobileMenuOpen ? "nav__menu-toggle--open" : ""
          }`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
