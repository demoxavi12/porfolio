function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <a href="#home" className="footer-logo">
            <span className="logo-symbol">&lt;</span>
            <span className="logo-name">Swaraj Xavier</span>
            <span className="logo-symbol"> /&gt;</span>
          </a>
          <p className="footer-tagline">
            Full-Stack Developer &amp; Computer Science Student focused on scalable
            backends, clean APIs, and modern web applications.
          </p>
        </div>

        <div className="footer-links-group">
          <div className="footer-col">
            <span className="footer-col-title">Navigation</span>
            <div className="footer-col-links">
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#skills">Skills</a>
              <a href="#projects">Projects</a>
              <a href="#achievements">Achievements</a>
              <a href="#contact">Contact</a>
            </div>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Connect</span>
            <div className="footer-col-links">
              <a
                href="https://github.com/demoxavi12"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/swaraj-6009a8332/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://leetcode.com/u/swaraj_xavier_suna/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LeetCode
              </a>
              <a href="mailto:swarajxaviersuna@gmail.com">
                Email
              </a>
              <a
                href="/SWARAJ_XAVIER_SUNA_RESUME.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Swaraj Xavier. All rights reserved.</p>
        <a href="#home" className="back-to-top" aria-label="Back to top of page">
          <span>Back to top</span>
          <svg
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
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </a>
      </div>
    </footer>
  );
}

export default Footer;