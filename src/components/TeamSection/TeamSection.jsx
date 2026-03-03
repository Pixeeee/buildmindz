import { useEffect, useRef, useState } from "react";
import founderImg from "../../assets/teams/founder.jpg";
import "./TeamSection.css";

// ── Scroll reveal hook ────────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Founder card — enhanced hero treatment ───────────────────────────────────
function FounderCard() {
  const [ref, visible] = useReveal(0.1);
  // eslint-disable-next-line no-unused-vars
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      ref={ref}
      className={"ts-founder" + (visible ? " ts-founder--visible" : "")}
    >
      {/* Image — left column */}
      <div className="ts-founder-image-wrap">
        <img src={founderImg} alt="Founder" className="ts-founder-image" />
        <div className="ts-founder-image-overlay" />

        {/* Floating label on image */}
        <div className="ts-founder-badge">
          <span className="ts-founder-badge-text">Founder</span>
        </div>
      </div>

      {/* Content — right column */}
      <div className="ts-founder-content">
        <span className="ts-label">01 — Leadership</span>

        <div className="ts-founder-name-block">
          <h2 className="ts-founder-name">
            {/* Name TBD — placeholder until filled */}
            The Founder
          </h2>
          <p className="ts-founder-role">Chief Executive Officer &amp; Founder</p>
        </div>

        <p className="ts-founder-bio">
          Visionary builder at the intersection of technology and design.
          Driving BuildMindz from concept to reality — one mind at a time.
        </p>

        <div className="ts-founder-skills">
          {["Strategy", "Architecture", "Web3", "Leadership", "Design Systems"].map(s => (
            <span key={s} className="ts-skill">{s}</span>
          ))}
        </div>

        <div className="ts-founder-rule" />

        <div className="ts-founder-meta">
          <span className="ts-meta-item">BuildMindz — Founder</span>
          <span className="ts-meta-dot" aria-hidden="true">·</span>
          <span className="ts-meta-item">2024 – Present</span>
        </div>
      </div>
    </div>
  );
}

// ── Regular team member card ──────────────────────────────────────────────────
function MemberCard({ member, index }) {
  const [ref, visible] = useReveal(0.15);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      ref={ref}
      className={"ts-member" + (visible ? " ts-member--visible" : "")}
      style={{ transitionDelay: `${index * 120}ms` }}
      onClick={() => setExpanded(e => !e)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") setExpanded(v => !v); }}
    >
      <div className="ts-member-image-wrap">
        <img src={member.avatar} alt={member.name} className="ts-member-image" />
        <div className="ts-member-overlay">
          <span className="ts-member-overlay-text">
            {expanded ? "Close" : "Skills"}
          </span>
        </div>
      </div>

      <div className="ts-member-body">
        <div className="ts-member-header">
          <h3 className="ts-member-name">{member.name}</h3>
          <span className="ts-member-role">{member.role}</span>
        </div>

        {expanded && (
          <div className="ts-member-skills">
            {member.skills.map(s => (
              <span key={s.name} className="ts-skill">{s.name}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function TeamSection() {
  const [headerRef, headerVisible] = useReveal(0.2);

  return (
    <section id="team" className="ts-section">

      {/* Header */}
      <div
        ref={headerRef}
        className={"ts-header" + (headerVisible ? " ts-header--visible" : "")}
      >
        <span className="ts-label">The Team</span>
        <h2 className="ts-headline">Minds behind<br />the mission.</h2>
        <p className="ts-subtitle">
          A small, focused team building the future of decentralised technology.
        </p>
      </div>

      {/* Founder — full-width feature card */}
      <FounderCard />

      {/* Divider */}
      <div className="ts-divider" aria-hidden="true" />

    </section>
  );
}