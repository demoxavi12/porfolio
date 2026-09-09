import { useState } from "react";

function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "swarajxaviersuna@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const contactLinks = [
    {
      name: "LinkedIn",
      handle: "in/swaraj-6009a8332",
      url: "https://www.linkedin.com/in/swaraj-6009a8332/",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.94 0 1.7-.76 1.7-1.7s-.76-1.7-1.7-1.7-1.7.76-1.7 1.7.76 1.7 1.7 1.7m1.4 9.74v-8.37H5.06v8.37h2.8z" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      handle: "demoxavi12",
      url: "https://github.com/demoxavi12",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      name: "LeetCode",
      handle: "swaraj_xavier_suna",
      url: "https://leetcode.com/u/swaraj_xavier_suna/",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 5.846 4.908 3.638a1.37 1.37 0 0 0-1.937 0 1.37 1.37 0 0 0 0 1.938l2.975 2.975a1.37 1.37 0 0 0 1.937 0l5.4-5.4A1.374 1.374 0 0 0 13.483 0zm4.568 6.78a1.37 1.37 0 0 0-.961.439l-8.6 8.6a1.37 1.37 0 0 0 0 1.938l4.4 4.4a1.37 1.37 0 0 0 1.938 0l8.6-8.6a1.37 1.37 0 0 0 0-1.938l-4.4-4.4a1.37 1.37 0 0 0-.977-.439zm-2.463 9.57l-3.43-3.43 5.17-5.17 3.43 3.43-5.17 5.17z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="contact" id="contact">
      <div className="section-container">
        <div className="section-header">
          <p className="section-label">GET IN TOUCH</p>
          <h2 className="section-title">Let&apos;s Connect</h2>
          <p className="section-subtitle">
            I am currently open to software engineering internships and junior
            developer roles. Whether you have a project, role, or question, I
            look forward to hearing from you.
          </p>
        </div>

        <div className="contact-card">
          <div className="contact-main-action">
            <p className="contact-prompt">Direct Communication</p>
            <div className="email-display-box">
              <span className="email-text">{email}</span>
              <div className="email-button-group">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="contact-btn copy-btn"
                  title="Copy email to clipboard"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      <span>Copy Email</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${email}`}
                  className="contact-btn mailto-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>Send Email</span>
                </a>
              </div>
            </div>
          </div>

          <div className="contact-profiles-grid">
            {contactLinks.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-link-card"
              >
                <div className="profile-icon">{item.icon}</div>
                <div className="profile-info">
                  <span className="profile-name">{item.name}</span>
                  <span className="profile-handle">{item.handle}</span>
                </div>
                <svg
                  className="profile-arrow"
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;

