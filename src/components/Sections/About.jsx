"use client"
import { useState } from "react";
export default function About() {
   const [expanded, setExpanded] = useState(false);
  const skills = [
    "React",
    "Next.js",
    "Tailwind CSS",
    "HTML / CSS",
    "JavaScript",
    "React Query",
    "Node.js",
    "Git / GitHub",
    "Bootstrap"
  ];

  return (
    <section id="about" className="section-bg" aria-label={""}>
      <div className="about-grid">
        {/* Left */}
        <div data-aos="fade-up">
          <div className="sec-head">
            <div className="sec-line" aria-hidden="true"></div>
            <h2 className="sec-title">درباره من</h2>
          </div>

          <div className="about-text-wrap">
            <div className={`about-full ${expanded ? "expanded" : ""}`}>
              <p style={{ marginBottom: "14px" }}>
              سلام، من پارسا اسدزاده هستم. من توسعه‌دهنده وب‌سایت و اپلیکیشن با بیش از 3 سال سابقه کار هستم. امیدوارم بتوانیم در کنار هم گام‌های بلندی به سوی موفقیت برداریم.
              </p>
            </div>

            {!expanded && <div className="about-full-fade"></div>}
          </div>

          <button
            className="read-more-btn"
            onClick={() => setExpanded(!expanded)}
            aria-label={""}
          >
            <span>
              {expanded ? "Close" : "Read more"}
            </span>

            <i
              className={`fas fa-chevron-down ${
                expanded ? "rotate-180" : ""
              }`}
              style={{
                fontSize: "11px",
                transition: "transform .3s",
              }}
            />
          </button>

          <div style={{ marginTop: "28px" }}>
            <div className="info-row">
              <span className="info-key">تخصص</span>
              <span className="info-val">
                FullStack Developer
              </span>
            </div>

            <div className="info-row">
              <span className="info-key">تجربه</span>
              <span className="info-val">3+ Years</span>
            </div>

          </div>
        </div>

        {/* Right */}
        <div data-aos="fade-up" data-aos-delay="150">
          <p className="skill-label">ابزار و تکنولوژی‌ها</p>

          <div className="skills-tags">
            {skills.map((skill) => (
              <span
                key={skill}
                className={`skill-tag ${
                  skill === "React" || skill === "Next.js"
                    ? "hl"
                    : ""
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}