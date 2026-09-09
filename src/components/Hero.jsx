function Hero() {
  return (
    <section className="hero" id="home">
      <p className="hero-greeting">Hello, I'm</p>

      <h1>Swaraj Xavier</h1>

      <h2>Full-Stack Developer & Computer Science Student</h2>

      <p className="hero-description">
        I build full-stack web applications, secure backend APIs, and scalable
        software solutions while continuously improving my problem-solving
        skills.
      </p>

      <div className="hero-buttons">
        <a href="#projects" className="btn primary-btn">
          View My Projects
        </a>

        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn secondary-btn"
        >
          View Resume
        </a>
      </div>
    </section>
  );
}

export default Hero;
