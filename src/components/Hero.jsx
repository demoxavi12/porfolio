function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-grid">
        <div className="hero-content">
          <div className="status-badge">
            <span className="status-indicator">
              <span className="status-ping"></span>
              <span className="status-dot"></span>
            </span>
            <span>Open to Opportunities & SDE Internships</span>
          </div>

          <p className="hero-greeting">Hello, I'm</p>
          <h1 className="hero-title">
            Swaraj <span className="gradient-text">Xavier</span>
          </h1>
          <h2 className="hero-subtitle">
            Full-Stack Developer &amp; Computer Science Student
          </h2>

          <p className="hero-description">
            I build full-stack web applications, secure backend APIs, and
            scalable software solutions with clean architecture while
            continuously honing my problem-solving skills.
          </p>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              <span>View Projects</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            <a
              href="/SWARAJXAVIER_CSE_NIST.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <span>View Resume</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </a>
          </div>

          <div className="hero-socials">
            <a
              href="https://github.com/demoxavi12"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="GitHub Profile"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/swaraj-6009a8332"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="LinkedIn Profile"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.94 0 1.7-.76 1.7-1.7s-.76-1.7-1.7-1.7-1.7.76-1.7 1.7.76 1.7 1.7 1.7m1.4 9.74v-8.37H5.06v8.37h2.8z" />
              </svg>
              <span>LinkedIn</span>
            </a>

            <a
              href="https://leetcode.com/u/swaraj_xavier_suna/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="LeetCode Profile"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 5.846 4.908 3.638a1.37 1.37 0 0 0-1.937 0 1.37 1.37 0 0 0 0 1.938l2.975 2.975a1.37 1.37 0 0 0 1.937 0l5.4-5.4A1.374 1.374 0 0 0 13.483 0zm4.568 6.78a1.37 1.37 0 0 0-.961.439l-8.6 8.6a1.37 1.37 0 0 0 0 1.938l4.4 4.4a1.37 1.37 0 0 0 1.938 0l8.6-8.6a1.37 1.37 0 0 0 0-1.938l-4.4-4.4a1.37 1.37 0 0 0-.977-.439zm-2.463 9.57l-3.43-3.43 5.17-5.17 3.43 3.43-5.17 5.17z" />
              </svg>
              <span>LeetCode</span>
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="terminal-card">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="terminal-title">developer.config.ts</div>
              <div className="terminal-badge">TypeScript</div>
            </div>
            <div className="terminal-body">
              <pre>
                <code>
                  <span className="syntax-keyword">const</span>{" "}
                  <span className="syntax-variable">engineer</span> = &#123;
                  {"\n"} <span className="syntax-prop">name</span>:{" "}
                  <span className="syntax-string">"Swaraj Xavier"</span>,{"\n"}{" "}
                  <span className="syntax-prop">role</span>:{" "}
                  <span className="syntax-string">"Full-Stack Developer"</span>,
                  {"\n"} <span className="syntax-prop">education</span>:{" "}
                  <span className="syntax-string">
                    "B.Tech CSE @ NIST University"
                  </span>
                  ,{"\n"} <span className="syntax-prop">cgpa</span>:{" "}
                  <span className="syntax-number">8.36</span>,{"\n"}{" "}
                  <span className="syntax-prop">coreStack</span>: [{"\n"}{" "}
                  <span className="syntax-string">"React"</span>,{" "}
                  <span className="syntax-string">"Node.js"</span>,{" "}
                  <span className="syntax-string">"Express"</span>,{" "}
                  <span className="syntax-string">"MongoDB"</span>,{" "}
                  <span className="syntax-string">"Redis"</span>
                  {"\n"} ],
                  {"\n"} <span className="syntax-prop">problemSolving</span>:{" "}
                  <span className="syntax-string">"200+ DSA Solved"</span>,
                  {"\n"} <span className="syntax-prop">openToRoles</span>:{" "}
                  <span className="syntax-boolean">true</span>
                  {"\n"}&#125;;
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
