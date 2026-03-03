import { useEffect, useRef } from "react";
import logo1 from "../../assets/logo/logo1.png";
import logo2 from "../../assets/logo/logo2.png";
import "./ScrollingLogo.css";

const clamp     = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const lerp      = (a, b, t)   => a + (b - a) * t;
const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// ─── Viewport helper ─────────────────────────────────────────────
const vp = () => {
  const vv = window.visualViewport;
  return {
    width:  vv ? vv.width  : window.innerWidth,
    height: vv ? vv.height : window.innerHeight,
  };
};

const ScrollingLogo = ({ heroRef, valuesRef, logoAreaRef, hxPosRef }) => {
  const wrapRef    = useRef(null);
  const rafRef     = useRef(null);
  const arrivedRef = useRef(false);

  useEffect(() => {
    const update = () => {
      rafRef.current = requestAnimationFrame(update);

      const wrap = wrapRef.current;
      if (!wrap || !heroRef.current || !valuesRef.current || !logoAreaRef.current) return;

      const hero     = heroRef.current.getBoundingClientRect();
      const values   = valuesRef.current.getBoundingClientRect();
      const logoArea = logoAreaRef.current.getBoundingClientRect();

      const { width: vw } = vp();

      // ── Logo size (define BEFORE using it) ─────────────────────
      const logoSize = clamp(vw * 0.22, 140, 300);

      // ── Scroll progress ─────────────────────────────────────────
      const raw  = clamp(-hero.top / hero.height, 0, 1);
      const ease = easeInOut(raw);

      // ── Vertical position ───────────────────────────────────────
      const startY = logoArea.top + logoArea.height * 0.5;

      const landingScale = 0.72;
      const halfLogo     = (logoSize * landingScale) / 2;
      const topClearance = Math.max(halfLogo + 16, values.height * 0.14);
      const endY         = values.top + topClearance + halfLogo;

      const logoY = lerp(startY, endY, ease);

      // ── Arrival state ───────────────────────────────────────────
      if (raw >= 0.999) arrivedRef.current = true;
      if (raw < 0.05)   arrivedRef.current = false;

      // ── Horizontal position ─────────────────────────────────────
      const hx    = hxPosRef.current ?? 0;
      const leftX = arrivedRef.current
        ? vw / 2 + hx
        : vw / 2;

      // ── Scale animation ─────────────────────────────────────────
      const journeyScale = lerp(1, 0.72, ease);

      // ── Visibility ──────────────────────────────────────────────
      const sectionGone = values.bottom < 0;
      const opacity     = sectionGone ? 0 : 1;

      // ── Apply styles ────────────────────────────────────────────
      wrap.style.width     = `${logoSize}px`;
      wrap.style.height    = `${logoSize}px`;
      wrap.style.top       = `${logoY}px`;
      wrap.style.left      = `${leftX}px`;
      wrap.style.opacity   = opacity;
      wrap.style.transform = `translate(-50%, -50%) scale(${journeyScale})`;
      wrap.classList.toggle("glowing", raw > 0.55);

      const logo1El = wrap.querySelector(".sl-logo1");
      const logo2El = wrap.querySelector(".sl-logo2");
      const ringEl  = wrap.querySelector(".sl-glow-ring");
      const showL2  = raw >= 0.70;

      if (logo1El) logo1El.style.opacity = showL2 ? "0" : "1";
      if (logo2El) logo2El.style.opacity = showL2 ? "1" : "0";
      if (ringEl)  ringEl.classList.toggle("active", raw > 0.55);
    };

    rafRef.current = requestAnimationFrame(update);

    const onVVChange = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onVVChange);
      window.visualViewport.addEventListener("scroll", onVVChange);
    }
    window.addEventListener("resize", onVVChange);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", onVVChange);
        window.visualViewport.removeEventListener("scroll", onVVChange);
      }
      window.removeEventListener("resize", onVVChange);
    };
  }, [heroRef, valuesRef, logoAreaRef, hxPosRef]);

  return (
    <div
      ref={wrapRef}
      className="scrolling-logo-wrap"
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      <img src={logo1} alt="" className="sl-img sl-logo1" style={{ opacity: 1 }} />
      <img src={logo2} alt="" className="sl-img sl-logo2" style={{ opacity: 0 }} />
      <div className="sl-glow-ring" />
    </div>
  );
};

export default ScrollingLogo;