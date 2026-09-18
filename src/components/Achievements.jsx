function Achievements() {
  const achievements = [
    {
      value: "200+",
      label: "DSA Problems Solved",
      detail:
        "Consistent algorithmic problem-solving across LeetCode & competitive platforms.",
      icon: (
        <svg
          width="24"
          height="24"
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
      ),
    },
    {
      value: "4+",
      label: "Full-Stack MVPs Built",
      detail:
        "Built full-stack applications with authentication, databases, APIs, and modern web technologies.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
    {
      value: "MERN",
      label: "Full-Stack Development",
      detail:
        "Building full-stack applications with React, Node.js, Express, and MongoDB.",
      icon: (
        <svg
          width="24"
          height="24"
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
      ),
    },
    {
      value: "SIH 2025",
      label: "Hackathon Participant",
      detail:
        "Smart India Hackathon 2025 participant, collaborating on practical software solutions.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      ),
    },
  ];

  return (
    <section className="achievements" id="achievements">
      <div className="section-container">
        <div className="section-header">
          <p className="section-label">TRACK RECORD</p>

          <h2 className="section-title">Key Milestones</h2>

          <p className="section-subtitle">
            Highlights from my development experience, technical learning, and
            project work.
          </p>
        </div>

        <div className="achievements-grid">
          {achievements.map((item, index) => (
            <div className="achievement-card" key={index}>
              <div className="achievement-icon-wrapper">{item.icon}</div>

              <h3 className="achievement-value">{item.value}</h3>

              <h4 className="achievement-label">{item.label}</h4>

              <p className="achievement-detail">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Achievements;
