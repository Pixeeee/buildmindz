import { useState, useEffect, useRef, useCallback } from "react";
import "./Footer.css";

// ── Navigation links ─────────────────────────────
const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

// ── Social links ────────────────────────────────
const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61577965092535",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  // Add other social links here...
];

// ── Wordmark letters ────────────────────────────
function AnimatedWordmark({ text }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVis(true);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="ft-wordmark" aria-label={text}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className={"ft-wm-char" + (vis ? " ft-wm-char--vis" : "")}
          style={{ transitionDelay: vis ? `${i * 0.04}s` : "0s" }}
          aria-hidden="true"
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </div>
  );
}

// ── Newsletter form ─────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sent");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <form onSubmit={submit} className="ft-newsletter">
      <div className="ft-nl-bar">
        <input
          className="ft-nl-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          aria-label="Newsletter email"
        />
        <button className="ft-nl-btn" type="submit" aria-label="Subscribe">
          {status === "sent" ? "✓" : "→"}
        </button>
      </div>
      {status === "sent" && <p className="ft-nl-confirm">You're on the list.</p>}
    </form>
  );
}

// ── Footer ──────────────────────────────────────
export default function Footer() {

  const handleNavClick = useCallback((href, e) => {
    e.preventDefault();

    if (href === "#hero") {
      // Refresh the page and spawn at HeroSection
      setTimeout(() => {
        window.location.assign(window.location.pathname);
      }, 0);
    } else {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <footer className="ft-footer">
      {/* Top band */}
      <div className="ft-top">
        <div className="ft-top-left">
          <p className="ft-eyebrow">Stay in the loop</p>
          <h3 className="ft-nl-heading">
            Get our latest<br />
            <em>thinking & work.</em>
          </h3>
          <Newsletter />
        </div>

        <nav className="ft-nav-cols">
          <div className="ft-nav-col">
            <span className="ft-col-label">Sitemap</span>
            <ul className="ft-nav-list">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="ft-nav-link"
                    onClick={(e) => handleNavClick(href, e)}
                  >
                    <span className="ft-nav-link-inner">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="ft-nav-col">
            <span className="ft-col-label">Social</span>
            <ul className="ft-nav-list">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="ft-nav-link ft-social-link"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                  >
                    <span className="ft-social-icon">{icon}</span>
                    <span className="ft-nav-link-inner">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Wordmark band */}
      <div className="ft-wm-band">
        <AnimatedWordmark text="BuildMindz" />
      </div>

      {/* Bottom bar */}
      <div className="ft-bottom">
        <span className="ft-copy">© 2026 Web3Forward BuildMindz. All rights reserved.</span>
        <a href="#" className="ft-policy">Privacy Policy</a>
      </div>
    </footer>
  );
}