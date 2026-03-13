
/**
 * HorizontalSection — GSAP ScrollTrigger (fully GSAP-driven, no RAF reveal)
 *
 * Architecture:
 *  ┌─ wrapperRef (tall div, height = vh + horizontal distance) ──────────────┐
 *  │  ScrollTrigger pins this div. Its height is the "scroll room".          │
 *  │                                                                          │
 *  │  ┌─ sectionRef (.horizontal-section, height:100vh, overflow:hidden) ──┐ │
 *  │  │   ┌─ trackRef (.hs-track, flex row, width = N×vw) ──────────────┐  │ │
 *  │  │   │  Panel 0: Values text (GSAP stagger reveal)                  │  │ │
 *  │  │   │  Panels 1-5: Card panels                                     │  │ │
 *  │  │   └──────────────────────────────────────────────────────────────┘  │ │
 *  │  └──────────────────────────────────────────────────────────────────────┘ │
 *  └──────────────────────────────────────────────────────────────────────────┘
 *
 * Text reveal:
 *   GSAP timeline on a dedicated ScrollTrigger that fires BEFORE the main
 *   horizontal pin. start:"top 85%" end:"top 5%" — so the text animates in
 *   as the section approaches from below. The horizontal pin starts only at
 *   "top top", so there's no conflict.
 *
 * Install: npm install gsap
 */

import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HorizontalSection.css";

import image1 from "../../assets/images/image1.jpg";
import image2 from "../../assets/images/image2.jpg";
import image3 from "../../assets/images/image3.png";
import image4 from "../../assets/images/image4.png";
import image5 from "../../assets/images/image5.png";
gsap.registerPlugin(ScrollTrigger);

// ─── Constants ────────────────────────────────────────────────────────────────

const CARDS = [
  {
    color: "#0026ff",
    label: "Government Duo",
    image: image1,
    description:
      "Strategic partnerships between government institutions and innovation leaders to accelerate digital transformation, policy development, and national technology initiatives.",
    tags: ["Public Sector", "Innovation", "Policy"],
  },
  {
    color: "#0026ff",
    label: "Empowers Universities",
    image: image2,
    description:
      "Collaborating with universities to advance research, develop talent, and equip the next generation of technologists with cutting-edge tools and knowledge.",
    tags: ["Research", "Education", "Talent"],
  },
  {
    color: "#0026ff",
    label: "Emerging Tech Pioneers",
    image: image3,
    description:
      "Exploring and building solutions with emerging technologies such as AI, blockchain, and advanced computing to shape the future of digital ecosystems.",
    tags: ["AI", "Blockchain", "Innovation"],
  },
  {
    color: "#0026ff",
    label: "Backed by Communities",
    image: image4,
    description:
      "Driven by passionate communities that collaborate, contribute, and support the growth of open innovation and decentralized technology movements.",
    tags: ["Community", "Collaboration", "Open Tech"],
  },
  {
    color: "#0026ff",
    label: "Multi-disciplinary",
    image: image5,
    description:
      "A diverse network of experts across technology, research, policy, and design working together to create holistic solutions for complex challenges.",
    tags: ["Technology", "Research", "Design"],
  },
];

const PALETTE = [
  [255,   0, 136],
  [221,   0, 238],
  [153,  17, 255],
  [ 13,  99, 248],
  [ 12, 220, 247],
];

const NODE_COUNT   = 55;
const CONNECT_DIST = 220;

// ─── Canvas palette helper ────────────────────────────────────────────────────

function palColor(wx, worldW) {
  const t  = Math.max(0, Math.min(1, wx / worldW));
  const s  = t * (PALETTE.length - 1);
  const lo = Math.floor(s);
  const hi = Math.min(lo + 1, PALETTE.length - 1);
  const f  = s - lo;
  const [ar, ag, ab] = PALETTE[lo];
  const [br, bg, bb] = PALETTE[hi];
  return [
    Math.round(ar + (br - ar) * f),
    Math.round(ag + (bg - ag) * f),
    Math.round(ab + (bb - ab) * f),
  ];
}

// ─── Node-graph canvas hook ───────────────────────────────────────────────────

function useNodeGraph(canvasRef, xPosRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let nodes = [], W = 0, H = 0, lastX = 0, raf;

    const build = () => {
      W = canvas.width; H = canvas.height;
      const wW = W * 7;
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        wx: Math.random() * wW,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.22,
      }));
    };

    const resize = () => {
      canvas.width  = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      build();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.visualViewport?.addEventListener("resize", resize);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);
      const xOff = xPosRef.current ?? 0;
      const vel  = Math.min(Math.abs(xOff - lastX) * 0.012, 0.35);
      lastX = xOff;
      const wW = W * 7;

      for (const n of nodes) {
        n.wx += n.vx; n.y += n.vy;
        if (n.wx < 0 || n.wx > wW) n.vx *= -1;
        if (n.y  < 0 || n.y  > H)  n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        const ax = nodes[i].wx + xOff, ay = nodes[i].y;
        for (let j = i + 1; j < nodes.length; j++) {
          const bx = nodes[j].wx + xOff, by = nodes[j].y;
          const d  = Math.hypot(ax - bx, ay - by);
          if (d >= CONNECT_DIST) continue;
          const [r1,g1,b1] = palColor(nodes[i].wx, wW);
          const [r2,g2,b2] = palColor(nodes[j].wx, wW);
          const a = Math.min((1 - d / CONNECT_DIST) * 0.28 * (1 + vel), 0.65);
          const g = ctx.createLinearGradient(ax, ay, bx, by);
          g.addColorStop(0, `rgba(${r1},${g1},${b1},${a.toFixed(3)})`);
          g.addColorStop(1, `rgba(${r2},${g2},${b2},${a.toFixed(3)})`);
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
          ctx.strokeStyle = g; ctx.lineWidth = 0.65 + vel * 0.6; ctx.stroke();
        }
        if (ax > -20 && ax < W + 20) {
          const [r,g,b] = palColor(nodes[i].wx, wW);
          ctx.beginPath();
          ctx.arc(ax, ay, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(0.30 + vel * 0.5, 0.82)})`;
          ctx.fill();
        }
      }
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.visualViewport?.removeEventListener("resize", resize);
    };
  }, [canvasRef, xPosRef]);
}

// ─── CardModal ────────────────────────────────────────────────────────────────

const CardModal = ({ card, onClose }) => {
  const btnRef = useRef(null);

  useEffect(() => {
    btnRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="card-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="card-modal"
        style={{ "--modal-color": card.color }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-image-container">
          <span className="modal-image-number" aria-hidden="true">0{card.id}</span>
          <div className="modal-image-frame">
            <img src={card.image} alt={card.label} className="modal-image" loading="lazy" />
          </div>
        </div>
        <div className="modal-content">
          <button ref={btnRef} className="modal-close" onClick={onClose} aria-label="Close dialog">✕</button>
          <span className="modal-category">EXPERTISE</span>
          <h2 id="modal-title" className="modal-title">{card.label}</h2>
          <div className="modal-divider" aria-hidden="true" />
          <p className="modal-description">{card.description}</p>
          <ul className="modal-tags" aria-label="Tags">
            {card.tags.map((tag) => <li key={tag} className="modal-tag">{tag}</li>)}
          </ul>
          <button className="modal-cta" onClick={onClose}>
            <span>Learn more</span>
            <span className="modal-cta-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── HorizontalSection ────────────────────────────────────────────────────────

const HorizontalSection = forwardRef(function HorizontalSection({ valuesRef, hxPosRef }) {
  const wrapperRef      = useRef(null);
  const sectionRef      = useRef(null);
  const trackRef        = useRef(null);
  const canvasRef       = useRef(null);
  const svgRef          = useRef(null);
  const progressFillRef = useRef(null);

  const xPos = hxPosRef;

  const stMainRef   = useRef(null);
  const stRevealRef = useRef(null);
  const stProgressRef = useRef(0); // 0→1 overall ST progress, shared with ScrollingLogo

  const [activeCard, setActiveCard] = useState(null);

  useNodeGraph(canvasRef, xPos);

  // ── Per-card enter/exit animation via scroll progress ────────────────────
  // Instead of SVG lines, each card animates in from the right as it enters
  // and fades/slides out to the left as it exits. Driven by xPos in onUpdate.

  const updateCards = useCallback((currentX) => {
    if (!sectionRef.current) return;
    const vw = window.innerWidth;
    sectionRef.current.querySelectorAll(".card-page-panel").forEach((el) => {
      const left  = el.offsetLeft + currentX; // panel left edge in viewport coords
      const right = left + el.offsetWidth;

      // Entry: panel coming from the right (fromCentre > 0)
      // Exit:  panel leaving to the left   (fromCentre < 0)
      const enterProgress = Math.max(0, Math.min(1, 1 - (left / vw)));        // 0→1 as left edge crosses viewport
      const exitProgress  = Math.max(0, Math.min(1, -(right / vw)));           // 0→1 as right edge leaves left

      const inView = left < vw * 0.95 && right > 0;
      if (inView) el.classList.add("in-view");

      // Entry animation: slide in from right + fade
      const entryOpacity   = Math.min(1, enterProgress * 2);
      const entryTranslateX = (1 - Math.min(1, enterProgress * 1.5)) * 60;

      // Exit animation: fade + slight scale down as it leaves left
      const exitOpacity = Math.max(0, 1 - exitProgress * 2.5);
      const exitScale   = 1 - exitProgress * 0.06;

      if (inView) {
        el.style.opacity   = Math.min(entryOpacity, exitOpacity).toFixed(3);
        el.style.transform = exitProgress > 0
          ? `translateX(0) scale(${exitScale.toFixed(4)})`
          : `translateX(${entryTranslateX.toFixed(2)}px)`;
      } else if (right <= 0) {
        // Fully off-screen left — reset for re-entry from right
        el.style.opacity   = "0";
        el.style.transform = "translateX(0)";
      }
    });
  }, []);

  // ── SVG ref kept but cleared — no connector lines ────────────────────────
  const clearSVG = useCallback(() => {
    if (svgRef.current) svgRef.current.innerHTML = "";
  }, []);

  // ── Text reveal — pure GSAP ScrollTrigger ────────────────────────────────
  //
  // Runs on a separate ST that fires BEFORE the pin (start:"top 85%", end:"top 5%").
  // scrub:0.6 makes it 1:1 with scroll position — text is always in the
  // correct state, never frozen mid-animation.
  // onLeave snaps to final state so it stays visible during the horizontal scroll.

  const initTextReveal = useCallback(() => {
    stRevealRef.current?.kill();
    if (!wrapperRef.current) return;

    // Hard-set starting state (overrides CSS, ensures consistency on re-init)
    gsap.set(".values-eyebrow", { opacity: 0, clearProps: "transform,filter" });
    gsap.set(".vh-word", { opacity: 0, y: 28, rotation: 1.8, filter: "blur(6px)" });
    gsap.set(".values-hint", { opacity: 0, clearProps: "transform,filter" });

    const tl = gsap.timeline();

    tl.to(".values-eyebrow", { opacity: 1, duration: 0.25, ease: "power1.out" }, 0)
      .to(".vh-word", {
        opacity: 1,
        y: 0,
        rotation: 0,
        filter: "blur(0px)",
        duration: 0.45,
        stagger: 0.07,
        ease: "power2.out",
      }, 0.1)
      .to(".values-hint", { opacity: 1, duration: 0.25, ease: "power1.out" }, 0.65);

    stRevealRef.current = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top 90%",    // start when section top hits 90% from viewport top
      end: "top 8%",       // end just before the pin locks in
      scrub: 0.5,
      animation: tl,
      onLeave() {
        // Snap to final visible state — prevents any residual blur/opacity
        gsap.set(".values-eyebrow", { opacity: 1 });
        gsap.set(".vh-word", { opacity: 1, y: 0, rotation: 0, filter: "blur(0px)" });
        gsap.set(".values-hint", { opacity: 1 });
      },
      onLeaveBack() {
        // When user scrolls back up past the reveal zone, reset to hidden
        gsap.set(".values-eyebrow", { opacity: 0 });
        gsap.set(".vh-word", { opacity: 0, y: 28, rotation: 1.8, filter: "blur(6px)" });
        gsap.set(".values-hint", { opacity: 0 });
      },
    });
  }, []);

  // ── Main horizontal ScrollTrigger ─────────────────────────────────────────
  //
  // Scroll delay: the tween starts with a GSAP timeline that holds x=0 for
  // `DELAY_VW` viewport-widths of scroll before beginning horizontal travel.
  // This gives the user time to read the values panel text before cards appear.

  const initGSAP = useCallback(() => {
    if (!wrapperRef.current || !trackRef.current) return;
    stMainRef.current?.kill();

    const track    = trackRef.current;
    const wrapper  = wrapperRef.current;
    const trackW   = track.scrollWidth;
    const vw       = window.innerWidth;
    const distance = trackW - vw;

    // Extra scroll distance to hold on the values panel (in px, = 1 × vw here)
    const DELAY_PX = vw * 1.0;
    const totalEnd = distance + DELAY_PX;

    wrapper.style.height = "";
    gsap.set(track, { x: 0 });

    // Timeline: hold at x=0 for DELAY_PX of scroll, then travel distance
    const tl = gsap.timeline();
    tl.to(track, { x: 0,         ease: "none", duration: DELAY_PX  })   // hold
      .to(track, { x: -distance, ease: "none", duration: distance   });  // scroll

    stMainRef.current = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: `+=${totalEnd}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      animation: tl,
      invalidateOnRefresh: true,
      onUpdate(self) {
        stProgressRef.current = self.progress;
        // Also expose on hxPosRef so ScrollingLogo can read it without a new prop
        xPos.stProgress = self.progress;
        const currentX = gsap.getProperty(track, "x");
        xPos.current = currentX;
        updateCards(currentX);

        if (progressFillRef.current) {
          // Progress bar only reflects horizontal travel (not the delay)
          const p = Math.max(0, Math.min(1, Math.abs(currentX) / distance));
          progressFillRef.current.style.transform = `scaleX(${p})`;
        }
      },
      onEnter()     { sectionRef.current?.classList.add("section-active"); },
      onLeave()     { sectionRef.current?.classList.remove("section-active"); },
      onEnterBack() { sectionRef.current?.classList.add("section-active"); },
      onLeaveBack() { sectionRef.current?.classList.remove("section-active"); },
    });
  }, [xPos, updateCards]);

  // ── IntersectionObserver — section fade-in ────────────────────────────────

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { section.classList.add("hs-visible"); io.disconnect(); }
      },
      { threshold: 0.05 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // ── Initial layout ────────────────────────────────────────────────────────

  useLayoutEffect(() => {
    clearSVG();
    const id = setTimeout(() => {
      initGSAP();
      initTextReveal();
      updateCards(0);
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(id);
  }, [clearSVG, initGSAP, initTextReveal, updateCards]);

  // ── Resize ────────────────────────────────────────────────────────────────

  useEffect(() => {
    const onResize = () => {
      clearSVG();
      initGSAP();
      initTextReveal();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, [clearSVG, initGSAP, initTextReveal]);

  // ── Cleanup ───────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      stMainRef.current?.kill();
      stRevealRef.current?.kill();
    };
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div ref={wrapperRef} className="hs-wrapper" id="values-expertise">
        <section ref={sectionRef} className="horizontal-section">
          <div className="hs-grain" aria-hidden="true" />
          <canvas ref={canvasRef} className="hs-lines-canvas" aria-hidden="true" />

          <div ref={trackRef} className="hs-track">

            {/* ── Panel 0 — Values intro ──────────────────────────────────── */}
            <div ref={valuesRef} className="hs-panel values-panel">
              <div className="values-inner">
                <p className="values-eyebrow">OUR CORE VALUES</p>
                <h2
                  className="values-headline"
                  aria-label="BuildMindz is the elite builders collective."
                >
                  {["BuildMindz", "is", "the", "elite", "builders", "collective."].map((word, i) => (
                    <span key={i} className="vh-word-wrap">
                      <span className="vh-word" style={{ "--wi": i }}>{word}</span>
                    </span>
                  ))}
                </h2>
                <p className="values-hint" aria-label="Scroll to explore">
                  SCROLL TO EXPLORE →
                </p>
              </div>
            </div>

            {/* ── Panels 1–N — Card panels ────────────────────────────────── */}
            {CARDS.map((card) => (
              <div
                key={card.id}
                className="hs-panel card-page-panel"
                style={{ "--card-color": card.color, "--card-image": `url(${card.image})` }}
              >
                <div
                  className="cpp-image-col"
                  onClick={() => setActiveCard(card)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setActiveCard(card)}
                  aria-label={`Expand ${card.label}`}
                >
                  <span className="cpp-num" aria-hidden="true">0{card.id}</span>
                  <div className="cpp-img-overlay" aria-hidden="true" />
                  <div className="cpp-img-shine"   aria-hidden="true" />
                  <span className="cpp-expand-hint" aria-hidden="true">Click to explore →</span>
                </div>
                <div className="cpp-content-col">
                  <span className="cpp-eyebrow">EXPERTISE</span>
                  <h3 className="cpp-title">{card.label}</h3>
                  <div className="cpp-divider" aria-hidden="true" />
                  <p className="cpp-description">{card.description}</p>
                  <ul className="cpp-tags" aria-label="Tags">
                    {card.tags.map((t) => <li key={t} className="cpp-tag">{t}</li>)}
                  </ul>
                  <button className="cpp-cta" onClick={() => setActiveCard(card)}>
                    <span>Explore</span>
                    <span className="cpp-cta-arrow" aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            ))}

            <svg ref={svgRef} className="hs-connect-svg" aria-hidden="true" />
          </div>

          {/* Progress bar */}
          <div className="hs-progress-line" aria-hidden="true">
            <div ref={progressFillRef} className="hs-progress-fill" />
            {CARDS.map((card, i) => (
              <span
                key={card.id}
                className="hs-progress-dot"
                style={{
                  "--dot-color": card.color,
                  left: `${((i + 1) / (CARDS.length + 1)) * 100}%`,
                }}
              />
            ))}
          </div>
        </section>
      </div>

      {activeCard && (
        <CardModal card={activeCard} onClose={() => setActiveCard(null)} />
      )}
    </>
  );
});

export default HorizontalSection;