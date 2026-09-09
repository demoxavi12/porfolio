function Projects() {
  const projects = [
    {
      id: "01",
      title: "Notification & Analytics Dashboard",
      type: "Mini SaaS System",
      description:
        "An enterprise-ready analytics dashboard that aggregates events and notifications across distributed microservices with robust security and high-throughput caching.",
      features: [
        "Aggregates events/notifications from 3+ backend services",
        "Role-based access control (RBAC) & protected admin routes using JWT",
        "Improved API performance by approximately 45% through Redis caching & rate limiting",
        "Scalable backend APIs and optimized analytics request handling",
      ],
      metric: "~45% API Performance Boost (Redis)",
      tech: ["React", "Node.js", "Express", "MongoDB", "Redis", "JWT"],
      githubUrl: "https://github.com/demoxavi12",
      demoUrl: null, // Only render when a real demo URL exists
    },
    {
      id: "02",
      title: "Real-Time Chat Application",
      type: "Real-Time Messaging Platform",
      description:
        "High-concurrency messaging application supporting real-time two-way communication, active presence, room-based isolation, and session security.",
      features: [
        "Concurrent multi-user communication powered by WebSockets / Socket.IO",
        "Secure JWT authentication with isolated private & public chat rooms",
        "Reduced average message latency by approximately 35%",
        "Modular REST APIs designed with strict MVC architecture",
      ],
      metric: "~35% Message Latency Reduction",
      tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Socket.IO", "JWT"],
      githubUrl: "https://github.com/demoxavi12",
      demoUrl: null,
    },
    {
      id: "03",
      title: "E-Commerce Platform",
      type: "Full-Stack Web Application",
      description:
        "Comprehensive full-stack commerce solution with authentication, end-to-end checkout, product catalog management, and payment gateway integration.",
      features: [
        "Full-stack commerce flow with authentication & stateful shopping cart",
        "End-to-end payment processing powered by Stripe API integration",
        "Role-based admin dashboard for catalog & inventory controls",
        "Optimized backend response times consistently below 400ms in testing",
      ],
      metric: "< 400ms Backend Latency in Testing",
      tech: [
        "React.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "JWT",
        "Stripe API",
      ],
      githubUrl: "https://github.com/demoxavi12",
      demoUrl: null,
    },
  ];

  return (
    <section className="projects" id="projects">
      <div className="section-container">
        <div className="section-header">
          <p className="section-label">FEATURED WORK</p>
          <h2 className="section-title">Production-Ready Projects</h2>
          <p className="section-subtitle">
            Engineered systems focusing on backend scalability, API security,
            and seamless user experiences.
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

              {project.metric && (
                <div className="project-metric-banner">
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
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </svg>
                  <span>{project.metric}</span>
                </div>
              )}

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
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                    <span>Source Code</span>
                  </a>

                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-action-btn demo-btn"
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
                      <span>Live Demo</span>
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

