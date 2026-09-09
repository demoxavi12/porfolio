function About() {
  return (
    <section className="about" id="about">
      <div className="section-container">
        <div className="section-header">
          <p className="section-label">ABOUT ME</p>
          <h2 className="section-title">Who I Am &amp; What I Do</h2>
          <p className="section-subtitle">
            A developer dedicated to building reliable software systems, clean
            APIs, and responsive web experiences.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-story">
            <h3 className="story-heading">
              Engineering with curiosity, precision, and drive
            </h3>
            <p className="about-text">
              I am a B.Tech Computer Science &amp; Engineering student at{" "}
              <strong className="text-highlight">NIST University</strong>{" "}
              (2023–2027). My technical focus is centered on software
              engineering, full-stack web applications, and backend optimization.
            </p>
            <p className="about-text">
              I enjoy architecting scalable web applications, engineering secure
              RESTful APIs, and solving complex algorithmic challenges using
              Java, JavaScript, and Python. Having built multiple full-stack
              MVPs, I prioritize clean code, modular architecture, and tangible
              performance improvements.
            </p>

            <div className="about-badges">
              <div className="about-badge-item">
                <span className="badge-icon">⚡</span>
                <span>Scalable System Design</span>
              </div>
              <div className="about-badge-item">
                <span className="badge-icon">🔒</span>
                <span>JWT &amp; RBAC Security</span>
              </div>
              <div className="about-badge-item">
                <span className="badge-icon">🚀</span>
                <span>Redis Caching &amp; Optimization</span>
              </div>
            </div>
          </div>

          <div className="about-cards">
            {/* Education Card */}
            <div className="info-card education-card">
              <div className="info-card-header">
                <div className="card-icon-wrap">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </div>
                <div>
                  <span className="card-tag">Academics</span>
                  <h4 className="card-heading">Education</h4>
                </div>
              </div>
              <div className="info-card-content">
                <p className="degree-title">B.Tech in Computer Science &amp; Engineering</p>
                <p className="institution-name">NIST University</p>
                <div className="education-meta">
                  <span className="meta-timeline">2023 – 2027</span>
                  <span className="meta-cgpa">CGPA: 8.36 / 10</span>
                </div>
              </div>
            </div>

            {/* Core Focus Card */}
            <div className="info-card focus-card">
              <div className="info-card-header">
                <div className="card-icon-wrap">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div>
                  <span className="card-tag">Specialization</span>
                  <h4 className="card-heading">Primary Focus</h4>
                </div>
              </div>
              <div className="focus-tags">
                <span className="focus-pill">Full-Stack Development</span>
                <span className="focus-pill">Backend Architecture</span>
                <span className="focus-pill">Data Structures &amp; Algorithms</span>
                <span className="focus-pill">RESTful API Design</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;

