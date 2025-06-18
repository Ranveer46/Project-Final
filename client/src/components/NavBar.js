import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ theme, onThemeToggle, logoSrc }) => {
  return (
    <header>
      <nav className={`navbar navbar-expand-lg navbar-${theme === 'dark' ? 'dark' : 'light'} bg-${theme === 'dark' ? 'dark' : 'light'}`}>
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            {logoSrc && <img src={logoSrc} alt="Logo" style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 12, boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)' }} />}
            <strong>StudentTracker</strong>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse d-flex justify-content-end"
            id="navbarNav"
          >
            {/* Updated search form to hide on smaller screens */}
            <form className="d-none d-lg-flex me-3">
              <input
                className="form-control me-2" 
                style={{ marginTop: '16px' }} 
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit" style={{ marginTop: '16px' }}>
                Search
              </button>
            </form>
            <button
              className={`btn btn-${theme === 'dark' ? 'light' : 'dark'}`}
              onClick={onThemeToggle}
              style={{ minWidth: 90 }}
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
