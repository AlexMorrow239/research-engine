import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/features/auth/authSlice";
import ugrLogo from "@public/images/navBar/miami-ugr.png";
import poweredBy from "@public/images/navBar/powered-by-bonsai.png";
import { Link, NavLink } from "react-router-dom";
import "./NavBar.scss";

export const NavBar = (): JSX.Element => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = (): void => {
    dispatch(logout());
  };

  return (
    <nav className="nav">
      <div className="nav__container">
        <div className="nav__brand">
          <Link to="/" className="nav__logo">
            <img
              src={ugrLogo}
              alt="University Logo"
              className="nav__university-logo"
            />
          </Link>
        </div>

        <div className="nav__menu">
          {/* Always visible links */}
          <NavLink to="/" className="nav__link">
            Positions
          </NavLink>
          <NavLink to="/about" className="nav__link">
            About
          </NavLink>

          {isAuthenticated ? (
            // Links for authenticated professors
            <>
              <NavLink to="faculty/dashboard" className="nav__link">
                Your Listings
              </NavLink>
              <NavLink to="/faculty/projects/new" className="nav__link">
                List Position
              </NavLink>
              <button className="nav__link" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/faculty/login" className="nav__link">
              Faculty Login/Register
            </NavLink>
          )}
        </div>

        {/* Powered By section */}
        <div className="nav__powered-by">
          <img src={poweredBy} alt="Bonsai Logo" className="nav__bonsai-logo" />
        </div>

        {/* Mobile menu toggle button */}
        <button className="nav__menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
