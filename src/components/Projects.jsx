function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="section-container">
        <p className="section-label">MY PROJECTS</p>

        <h2>Things I've Built</h2>

        <div className="projects-grid">
          {/* Project 1 */}
          <div className="project-card">
            <h3>Notification & Analytics Dashboard</h3>

            <p className="project-type">Mini SaaS System</p>

            <p className="project-description">
              Built an analytics dashboard that aggregates events and
              notifications from multiple backend services. Implemented
              role-based access control, protected admin routes, Redis caching,
              and rate limiting.
            </p>

            <div className="project-tech">
              <span>React</span>
              <span>Node.js</span>
              <span>Express</span>
              <span>MongoDB</span>
              <span>Redis</span>
              <span>JWT</span>
            </div>

            <a href="#" className="project-link">
              GitHub →
            </a>
          </div>

          {/* Project 2 */}
          <div className="project-card">
            <h3>Real-Time Chat Application</h3>

            <p className="project-type">Real-Time Messaging Platform</p>

            <p className="project-description">
              Developed a real-time messaging platform supporting concurrent
              multi-user communication using WebSockets. Implemented secure JWT
              authentication with private and public chat rooms.
            </p>

            <div className="project-tech">
              <span>React.js</span>
              <span>Node.js</span>
              <span>Express</span>
              <span>MongoDB</span>
              <span>Socket.IO</span>
              <span>JWT</span>
            </div>

            <a href="#" className="project-link">
              GitHub →
            </a>
          </div>

          {/* Project 3 */}
          <div className="project-card">
            <h3>E-Commerce Platform</h3>

            <p className="project-type">Full-Stack Web Application</p>

            <p className="project-description">
              Built a full-stack e-commerce application with authentication,
              product management, cart functionality, and Stripe integration.
              Implemented role-based admin controls and secure API workflows.
            </p>

            <div className="project-tech">
              <span>React.js</span>
              <span>Node.js</span>
              <span>Express</span>
              <span>MongoDB</span>
              <span>JWT</span>
              <span>Stripe API</span>
            </div>

            <a href="#" className="project-link">
              GitHub →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;
