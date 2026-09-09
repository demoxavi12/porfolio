function Navbar() {
  return (
    <nav className="navbar">
      <a href="#home" className="logo">
        Swaraj Xavier
      </a>

      <div className="nav-links">
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
          Resume
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
