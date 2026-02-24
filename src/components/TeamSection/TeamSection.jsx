import { useEffect, useRef, useState } from "react";
import SectionHeader from "../SectionHeader/SectionHeader";
import "./TeamSection.css";

// ---- TeamMember ----
const TeamMember = ({ member, delay }) => {
  const [expanded, setExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const memberRef = useRef(null);

  useEffect(() => {
    const el = memberRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return (
    <div
      ref={memberRef}
      className={`col-md-3 mb-4 fade-in-up ${isVisible ? "visible" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="card h-100 shadow-sm text-center team-card"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") setExpanded(!expanded);
        }}
      >
        <div className="team-image-wrapper">
          <img src={member.avatar} className="card-img-top" alt={member.name} />
          <div className="team-overlay">
            <span className="view-skills">View Skills</span>
          </div>
        </div>
        <div className="card-body">
          <h5 className="card-title fw-bold">{member.name}</h5>
          <p className="card-text text-muted">{member.role}</p>
          {expanded && (
            <div className="mt-3 skills-reveal">
              <p className="fw-medium mb-2">Expertise:</p>
              <div className="d-flex justify-content-center flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <span key={skill.name} className="badge bg-dark text-white skill-badge">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---- TeamSection ----
const TEAM = [
  {
    name: "Marcus",
    role: "Lead Blockchain Architect",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    skills: [{ name: "Solidity" }, { name: "Web3" }, { name: "Security" }],
  },
  {
    name: "Emma",
    role: "Full-Stack Engineer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    skills: [{ name: "React" }, { name: "Node.js" }, { name: "Cloud" }],
  },
];

const TeamSection = () => {
  return (
    <section id="team" className="container py-5 section-spacing team-section">
      <SectionHeader
        title="Meet The Team"
        subtitle="The brilliant minds behind BuildMindz"
      />
      <div className="row">
        {TEAM.map((member, index) => (
          <TeamMember key={member.name} member={member} delay={index * 150} />
        ))}
      </div>
    </section>
  );
};

export default TeamSection;