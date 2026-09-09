function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="section-container">
        <p className="section-label">MY SKILLS</p>

        <h2>Technologies I Work With</h2>

        <div className="skills-grid">
          <div className="skill-card">
            <h3>Languages</h3>

            <div className="skill-list">
              <span>Java</span>
              <span>JavaScript</span>
              <span>Python</span>
              <span>C</span>
              <span>SQL</span>
            </div>
          </div>

          <div className="skill-card">
            <h3>Frontend</h3>

            <div className="skill-list">
              <span>React.js</span>
              <span>HTML5</span>
              <span>CSS3</span>
              <span>Tailwind CSS</span>
            </div>
          </div>

          <div className="skill-card">
            <h3>Backend</h3>

            <div className="skill-list">
              <span>Node.js</span>
              <span>Express.js</span>
              <span>REST APIs</span>
              <span>JWT</span>
              <span>MVC Architecture</span>
            </div>
          </div>

          <div className="skill-card">
            <h3>Database</h3>

            <div className="skill-list">
              <span>MongoDB</span>
              <span>Mongoose</span>
              <span>Redis</span>
              <span>DBMS</span>
            </div>
          </div>

          <div className="skill-card">
            <h3>Core CS</h3>

            <div className="skill-list">
              <span>Data Structures & Algorithms</span>
              <span>OOP</span>
              <span>Operating Systems</span>
              <span>Computer Networks</span>
            </div>
          </div>

          <div className="skill-card">
            <h3>Tools</h3>

            <div className="skill-list">
              <span>Git</span>
              <span>GitHub</span>
              <span>Postman</span>
              <span>Docker</span>
              <span>Linux</span>
              <span>VS Code</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;
