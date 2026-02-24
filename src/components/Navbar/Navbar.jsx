import { useEffect, useState } from "react";
import { X, Menu } from "lucide-react";
import "./Navbar.css";
import logo from "../../assets/logo/logo2.png";

// ---- BuildMindz Logo SVG ----
const Logo = () => (
  <img 
    src={logo} 
    alt="Logo" 
    className="navbar-logo-svg"
  />
);

const NAV_LINKS = [
  { href: "#home",      label: "Home" },
  { href: "#values",    label: "Values" },
  { href: "#expertise", label: "Expertise" },
  { href: "#team",      label: "Team" },
  { href: "#contact",   label: "Contact" },
];

const Navbar = () => {
  const [scrolled,    setScrolled]    = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const scrollTo = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setDrawerOpen(false);
  };

  return (
    <>
      {/* ── Desktop / Tablet Navbar ─────────────────────── */}
      <nav className={`navbar-custom ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="navbar-content">

            {/* Brand */}
            <a href="#home" className="navbar-brand-custom" onClick={(e) => scrollTo(e, "#home")}>
              <span className="brand-text">BUILDMINDZ</span>
            </a>

            {/* Desktop Links */}
            <ul className="navbar-menu desktop-menu">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={(e) => scrollTo(e, link.href)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile Top Bar */}
            <div className="mobile-topbar">
              {/* Hamburger → opens drawer */}
              <button
                className="drawer-toggle"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              {/* Book a call button */}
              <a href="#contact" className="book-call-btn" onClick={(e) => scrollTo(e, "#contact")}>
                <span className="book-call-dot" />
                <span>Book a call</span>
              </a>
            </div>

          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ───────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${drawerOpen ? "open" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside className={`drawer-panel ${drawerOpen ? "open" : ""}`} aria-label="Mobile navigation">

        {/* Close button */}
        <button
          className="drawer-close-btn"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        {/* Brand inside drawer */}
        <div className="drawer-brand">
          <Logo />
          <span>BUILDMINDZ</span>
        </div>

        {/* Nav links */}
        <nav className="drawer-nav">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="drawer-link"
              onClick={(e) => scrollTo(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Navbar;