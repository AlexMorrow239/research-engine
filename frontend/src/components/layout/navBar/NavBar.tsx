import { Link, useLocation } from "react-router-dom";
import "./NavBar.scss";

export const NavBar = () => {
  const location = useLocation();
  const isAuthenticated = false; // Replace with your auth logic

  const isActive = (path: string) => {
    return location.pathname === path ? "nav__link--active" : "";
  };

  return (
    <nav className="nav">
      <div className="container nav__container">
        <div className="nav__logo">
          <Link to="/" className="nav__logo-link">
            Research Engine
          </Link>
        </div>

        <div className="nav__links">
          <Link to="/" className={`nav__link ${isActive("/")}`}>
            Positions
          </Link>
          <Link to="/about" className={`nav__link ${isActive("/about")}`}>
            About
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/faculty/list-position"
                className={`nav__link ${isActive("/faculty/list-position")}`}
              >
                List Position
              </Link>
              <Link
                to="/faculty/dashboard"
                className={`nav__link ${isActive("/faculty/dashboard")}`}
              >
                Dashboard
              </Link>
              <button className="btn btn--secondary nav__button">Logout</button>
            </>
          ) : (
            <Link to="/faculty/login" className="btn btn--primary nav__button">
              Faculty Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
