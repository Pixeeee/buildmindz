/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import logo1 from "../../assets/logo/logo1.png";
import logo2 from "../../assets/logo/logo2.png";
import "./ScrollingLogo.css";

const clamp     = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const lerp      = (a, b, t)   => a + (b - a) * t;
const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// hxPosRef: shared ref written by HorizontalSection every frame
const ScrollingLogo = ({ heroRef, valuesRef, logoAreaRef, hxPosRef }) => {
  const wrapRef    = useRef(null);
  const rafRef     = useRef(null);
  const arrivedRef = useRef(false); // true once logo has landed at values panel

  // Only need React state for the initial mount guard
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // All updates are done imperatively via refs — no setState on hot path
    const update = () => {
      rafRef.current = requestAnimationFrame(update);

      const wrap = wrapRef.current;
      if (!wrap || !heroRef.current || !valuesRef.current || !logoAreaRef.current) return;

      const hero     = heroRef.current.getBoundingClientRect();
      const values   = valuesRef.current.getBoundingClientRect();
      const logoArea = logoAreaRef.current.getBoundingClientRect();

      // --- vertical progress: 0 = hero, 1 = landed at values ---
      const raw  = clamp(-hero.top / hero.height, 0, 1);
      const ease = easeInOut(raw);

      // Vertical Y
      const startY = logoArea.top  + logoArea.height  * 0.5;
      const endY   = values.top    + values.height    * 0.22;
      const logoY  = lerp(startY, endY, ease);

      // Mark arrival
      if (raw >= 0.999) arrivedRef.current = true;
      if (raw < 0.05)   arrivedRef.current = false; // reset when scrolled back up

      // --- horizontal offset ---
      // Once the logo has arrived it must track the values panel as it slides.
      // The values panel centre in screen-space = 50vw + hxPos
      // (because it starts centred and translateX shifts it leftward)
      const hx   = hxPosRef.current ?? 0;
      const leftX = arrivedRef.current
        ? window.innerWidth / 2 + hx   // locked to panel centre
        : window.innerWidth / 2;       // centred during travel

      // Scale
      const scale = lerp(1, 0.72, easeInOut(clamp(raw, 0, 1)));

      // Glow / logo swap
      const isGlowing = raw > 0.55;
      const showLogo2 = raw >= 0.70;

      // Visibility: hide when section has scrolled fully out of view
      const sectionGone = values.bottom < 0;
      const opacity     = sectionGone ? 0 : 1;

      // --- write directly to DOM ---
      wrap.style.top       = `${logoY}px`;
      wrap.style.left      = `${leftX}px`;
      wrap.style.opacity   = opacity;
      wrap.style.transform = `translate(-50%, -50%) scale(${scale})`;
      wrap.classList.toggle("glowing", isGlowing);

      const logo1El = wrap.querySelector(".sl-logo1");
      const logo2El = wrap.querySelector(".sl-logo2");
      const ringEl  = wrap.querySelector(".sl-glow-ring");

      if (logo1El) logo1El.style.opacity = showLogo2 ? "0" : "1";
      if (logo2El) logo2El.style.opacity = showLogo2 ? "1" : "0";
      if (ringEl)  ringEl.classList.toggle("active", isGlowing);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mounted, heroRef, valuesRef, logoAreaRef, hxPosRef]);

  return (
    <div
      ref={wrapRef}
      className="scrolling-logo-wrap"
      style={{ opacity: 0 }}   // start invisible until first rAF
      aria-hidden="true"
    >
      <img src={logo1} alt="" className="sl-img sl-logo1" style={{ opacity: 1 }} />
      <img src={logo2} alt="" className="sl-img sl-logo2" style={{ opacity: 0 }} />
      <div className="sl-glow-ring" />
    </div>
  );
};

export default ScrollingLogo;