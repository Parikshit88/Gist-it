import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  let location = useLocation();
  let navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">
          Gist-It
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                aria-current="page"
                to="/home"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/about" ? "active" : ""
                }`}
                to="/about"
              >
                About
              </Link>
            </li>
          </ul>
          {!localStorage.getItem("token") ? (
            <form className="d-flex">
              <Link
                className="btn btn-bd-primary btn-sm mx-2"
                to="/login"
                role="button"
              >
                <i className="fa-solid fa-circle-user mx-1"></i>Login
              </Link>
              <Link
                className="btn btn-bd-primary btn-sm mx-2"
                to="/signup"
                role="button"
              >
                <i className="fa-solid fa-user-plus mx-1"></i>Sign In
              </Link>
            </form>
          ) : (
            <button
              onClick={handleLogout}
              className="btn btn-bd-primary btn-sm mx-2"
            >
              <i className="fa-solid fa-power-off mx-1"></i>Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
