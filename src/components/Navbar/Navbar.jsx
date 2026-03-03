import { useEffect, useState } from "react";
import { X, Menu } from "lucide-react";
import "./Navbar.css";

const Logo = () => (
  <svg className="navbar-logo-svg" viewBox="0 0 97 108" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M55.5 0C61.0005 0.00109895 64.5005 2.50586 64.5 7.5V17C64.5 24.5059 68.5005 27.5 81 27.5H88C94.0005 27.5059 96.5 29.5059 96.5 37.5V98.5C96.5 106.006 95.0005 107.5 88 107.5H41.5C36.5005 107.5 32 104.506 32 98.5V88C32 84.5 28.5 80 20.5 80H8.5C3 80 0 76.5 0 71.5V6.5C0.00048844 1.50586 2.50049 0.00585937 8.5 0H55.5ZM31 20C28.7909 20 27 21.7909 27 24V74C27 76.2091 28.7909 78 31 78H58C60.2091 78 62 76.2091 62 74V24C62 21.7909 60.2091 20 58 20H31Z" />
  </svg>
);

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#values", label: "Values" },
  { href: "#expertise", label: "Expertise" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setDrawerOpen(false);

    if (href === "#home") {
      // Refresh page → spawn at HeroSection
      window.location.href = window.location.pathname;
    } else {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Desktop / Tablet Navbar */}
      <nav className={`navbar-custom ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="navbar-content">
            <a href="#home" className="navbar-brand-custom" onClick={(e) => handleNavClick(e, "#home")}>
              <span className="brand-text">BUILDMINDZ</span>
            </a>

            <ul className="navbar-menu desktop-menu">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mobile-topbar">
              <button className="drawer-toggle" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
                <Menu size={22} />
              </button>
              <a href="#contact" className="book-call-btn" onClick={(e) => handleNavClick(e, "#contact")}>
                <span className="book-call-dot" />
                <span>Book a call</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`drawer-backdrop ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} />
      <aside className={`drawer-panel ${drawerOpen ? "open" : ""}`} aria-label="Mobile navigation">
        <button className="drawer-close-btn" onClick={() => setDrawerOpen(false)}>
          <X size={20} />
        </button>
        <div className="drawer-brand">
          <Logo />
          <span>BUILDMINDZ</span>
        </div>
        <nav className="drawer-nav">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} className="drawer-link" onClick={(e) => handleNavClick(e, link.href)}>
              {link.label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Navbar;