import { useEffect, useRef, useState } from "react";
import { X, Menu } from "lucide-react";
import "./Navbar.css";
import logo from "../../assets/logo/logo2.png";

const NAV_LINKS = [
  { href: "#home",    label: "Home" },
  { href: "#values-expertise", label: "Values" },
  { href: "#team",    label: "Team" },
  { href: "#contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled,   setScrolled]   = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const handleNav = (e, href) => {
    e.preventDefault();
    setDrawerOpen(false);
    const target = document.querySelector(href);
    if (!target) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* ── Desktop / Tablet Navbar ─────────────────────── */}
      <nav className={`navbar-custom ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="navbar-content">

            <a href="#home" className="navbar-brand-custom" onClick={(e) => handleNav(e, "#home")}>
              <span className="brand-text">BUILDMINDZ</span>
            </a>

            <ul className="navbar-menu desktop-menu">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={(e) => handleNav(e, link.href)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mobile-topbar">
              <button
                className="drawer-toggle"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                aria-expanded={drawerOpen}
              >
                <Menu size={22} />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer Backdrop ──────────────────────── */}
      <div
        className={`drawer-backdrop ${drawerOpen ? "open" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile Drawer Panel ─────────────────────────── */}
      <aside
        ref={drawerRef}
        className={`drawer-panel ${drawerOpen ? "open" : ""}`}
        aria-label="Mobile navigation"
        role="dialog"
        aria-modal="true"
      >
        {/* Header row */}
        <div className="drawer-header">
          <div className="drawer-brand">
            <img src={logo} alt="BuildMindz" className="drawer-logo-img" />
            <span>BUILDMINDZ</span>
          </div>
          <button
            className="drawer-close-btn"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Divider */}
        <div className="drawer-rule" aria-hidden="true" />

        {/* Nav links */}
        <nav className="drawer-nav" aria-label="Primary navigation">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="drawer-link"
              style={{ "--i": i }}
              onClick={(e) => handleNav(e, link.href)}
            >
              <span className="drawer-link-num">0{i + 1}</span>
              <span className="drawer-link-label">{link.label}</span>
              <span className="drawer-link-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="drawer-footer">
          <div className="drawer-rule" aria-hidden="true" />
          <p className="drawer-tagline">Elite builders collective.</p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;