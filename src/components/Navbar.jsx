import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="navbar-container">
      <nav className="navbar" aria-label="Main Navigation">
        <a href="#home" className="logo" onClick={closeMenu}>
          <span className="logo-symbol">&lt;</span>
          <span className="logo-name">Swaraj Xavier</span>
          <span className="logo-symbol"> /&gt;</span>
        </a>

        <div className={`nav-links ${isOpen ? "active" : ""}`}>
          <a href="#about" onClick={closeMenu}>
            About
          </a>
          <a href="#skills" onClick={closeMenu}>
            Skills
          </a>
          <a href="#projects" onClick={closeMenu}>
            Projects
          </a>
          <a href="#achievements" onClick={closeMenu}>
            Achievements
          </a>
          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>
          <a
            href="/SWARAJ_XAVIER_SUNA_RESUME.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-resume-btn"
            onClick={closeMenu}
          >
            <span>Resume</span>
            <svg
              className="nav-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </a>
        </div>

        <button
          type="button"
          className={`mobile-toggle ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </nav>
    </header>
  );
}

export default Navbar;

