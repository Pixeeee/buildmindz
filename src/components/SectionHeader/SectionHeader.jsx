import { useEffect, useRef, useState } from "react";
import "./SectionHeader.css";

const SectionHeader = ({ title, subtitle }) => {
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const currentHeader = headerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.4 }
    );
    if (currentHeader) observer.observe(currentHeader);
    return () => { if (currentHeader) observer.unobserve(currentHeader); };
  }, []);

  return (
    <div
      ref={headerRef}
      className={`section-header ${isVisible ? "visible" : ""}`}
    >
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      <div className="section-divider"></div>
    </div>
  );
};

export default SectionHeader;