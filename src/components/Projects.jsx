function Projects() {
  const projects = [
    {
      id: "01",
      title: "Notification & Analytics Dashboard",
      type: "Mini SaaS System",
      description:
        "A full-stack dashboard for managing application events and notifications, with secure authentication, analytics, and backend services.",
      features: [
        "Aggregates application events and notifications from multiple backend services",
        "Role-based access control (RBAC) and protected admin routes using JWT",
        "Redis caching and rate limiting for backend request handling",
        "REST APIs for authentication, event ingestion, notifications, and analytics",
      ],
      tech: ["React", "Node.js", "Express", "MongoDB", "Redis", "JWT"],
      githubUrl:
        "https://github.com/demoxavi12/notification-analytics-dashboard",
      demoUrl: "https://mini-saas-system.vercel.app/",
    },

    {
      id: "02",
      title: "Real-Time Chat Application",
      type: "Real-Time Messaging Platform",
      description:
        "A real-time messaging application built with React and Socket.IO, supporting authenticated communication through private and public chat rooms.",
      features: [
        "Real-time multi-user communication using WebSockets and Socket.IO",
        "JWT-based authentication for secure user access",
        "Private and public chat room functionality",
        "Modular REST APIs following MVC architecture principles",
      ],
      tech: [
        "React.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Socket.IO",
        "JWT",
      ],
      githubUrl: "https://github.com/demoxavi12/real-time-chat-application",
      demoUrl: "https://real-time-chat-application-taupe-six.vercel.app/",
    },

    {
      id: "03",
      title: "E-Commerce Platform",
      type: "Full-Stack Web Application",
      description:
        "A full-stack e-commerce application featuring authentication, product management, shopping cart functionality, and Stripe payment integration.",
      features: [
        "User authentication and shopping cart functionality",
        "Product management and catalog operations",
        "Stripe API integration for payment processing",
        "Role-based admin controls and secure API workflows using JWT",
      ],
      tech: [
        "React.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "JWT",
        "Stripe API",
      ],
      githubUrl: "https://github.com/demoxavi12/e-commerce-platform",
      demoUrl: "https://e-commerce-platform-six-phi.vercel.app/",
    },
  ];

  return (
    <section className="projects" id="projects">
      <div className="section-container">
        <div className="section-header">
          <p className="section-label">FEATURED WORK</p>

          <h2 className="section-title">Featured Projects</h2>

          <p className="section-subtitle">
            Full-stack applications built with modern web technologies, focusing
            on backend development, APIs, authentication, and real-time
            communication.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.id}>
              <div className="project-card-top">
                <div className="project-meta-row">
                  <span className="project-type-tag">{project.type}</span>

                  <span className="project-index">PROJECT {project.id}</span>
                </div>

                <h3 className="project-title">{project.title}</h3>

                <p className="project-description">{project.description}</p>
              </div>

              <div className="project-features">
                <h4 className="features-title">Engineering Highlights:</h4>

                <ul>
                  {project.features.map((feature, idx) => (
                    <li key={idx}>
                      <span className="feature-bullet">▸</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="project-footer">
                <div className="project-tech-tags">
                  {project.tech.map((t) => (
                    <span className="tech-badge" key={t}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className="project-links-row">
                  {/* GitHub */}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-action-btn github-btn"
                    aria-label={`View ${project.title} source on GitHub`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>

                    <span>Source Code</span>
                  </a>

                  {/* Preview */}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-action-btn demo-btn"
                      aria-label={`Preview ${project.title}`}
                    >
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
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>

                      <span>Preview</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
