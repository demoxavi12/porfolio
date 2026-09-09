function About() {
  return (
    <section className="about" id="about">
      <div className="section-container">
        <p className="section-label">ABOUT ME</p>

        <h2>Who I Am</h2>

        <p className="about-text">
          I am a B.Tech Computer Science & Engineering student at NIST
          University, currently pursuing my degree from 2023 to 2027. I have a
          strong interest in software engineering, full-stack development, and
          backend optimization.
        </p>

        <p className="about-text">
          I enjoy building scalable web applications, developing secure APIs,
          and solving problems using Java, JavaScript, and Python. I have built
          multiple full-stack MVPs and enjoy working with technologies across
          the MERN stack.
        </p>

        <div className="about-details">
          <div>
            <h3>Education</h3>
            <p>B.Tech — Computer Science & Engineering</p>
            <p>NIST University</p>
            <p>2023 – 2027</p>
            <p>CGPA: 8.38 / 10</p>
          </div>

          <div>
            <h3>Focus</h3>
            <p>Full-Stack Development</p>
            <p>Backend Development</p>
            <p>Data Structures & Algorithms</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
