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
    {
    label: 'Twitter / X',
    href: 'https://x.com/buildmindz',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/GBAyyEQP',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
  },
  {
    label: 'Telegram',
    href: 'https://t.me/BuildMindz',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },

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