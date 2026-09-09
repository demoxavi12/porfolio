function Achievements() {
  return (
    <section className="achievements">
      <div className="section-container">
        <p className="section-label">ACHIEVEMENTS</p>

        <h2>What I've Accomplished</h2>

        <div className="achievements-grid">
          <div className="achievement-card">
            <h3>200+</h3>
            <p>DSA Problems Solved</p>
          </div>

          <div className="achievement-card">
            <h3>4+</h3>
            <p>Full-Stack MVPs Built</p>
          </div>

          <div className="achievement-card">
            <h3>1,000+</h3>
            <p>API Calls / Day in Development</p>
          </div>

          <div className="achievement-card">
            <h3>SIH 2025</h3>
            <p>Smart India Hackathon Participant</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Achievements;
