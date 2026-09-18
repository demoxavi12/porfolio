function Resume() {
  return (
    <section className="resume-banner-section" id="resume">
      <div className="section-container">
        <div className="resume-banner-card">
          <div className="resume-banner-info">
            <h3 className="resume-banner-title">
              Interested in my full background?
            </h3>
            <p className="resume-banner-desc">
              View or download my verified resume detailing my technical skills,
              NIST University coursework, and engineering projects.
            </p>
          </div>
          <a
            href="/SWARAJXAVIER_CSE_NIST.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <span>View Resume (PDF)</span>
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
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Resume;
