import { Link, useLocation } from "react-router-dom";
import "./Navbar.module.scss";

export default function Navbar(props) {
  let location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg position-fixed w-100 top-0">
      <div className="container">
        <Link className="navbar-brand text-light" to="#">
          <i className="fa-regular fa-note-sticky pe-1"></i>Notes
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {location.pathname === "/home" ? (
              <li className="nav-item">
                <a
                  onClick={props.logingOut}
                  className="nav-item text-white fw-bold"
                >
                  <i className="fa-solid fa-door-open"></i> Logout
                </a>
              </li>
            ) : (
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle text-light"
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  login
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="login">
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="register">
                      Sign up
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
