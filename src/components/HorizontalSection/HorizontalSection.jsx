/* eslint-disable react-hooks/immutability */
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import "./HorizontalSection.css";

import image1 from "../../assets/images/image1.jpg";
import image2 from "../../assets/images/image2.jpg";
import image3 from "../../assets/images/image3.png";
import image4 from "../../assets/images/image4.png";
import image5 from "../../assets/images/image5.png";

// ─── Constants ────────────────────────────────────────────────────────────────

const CARDS = [
  {
    id: 1,
    color: "#ff0088",
    label: "Build Scalable Web3 Solutions",
    image: image1,
    description:
      "We architect decentralized infrastructures from the ground up — smart contracts, layer-2 integrations, and protocol design that handles millions of transactions without breaking a sweat.",
    tags: ["Smart Contracts", "Layer-2", "Protocol Design"],
  },
  {
    id: 2,
    color: "#dd00ee",
    label: "Empower Decentralized Communities",
    image: image2,
    description:
      "Governance models, DAO frameworks, and community tooling that put power back into the hands of builders. We believe Web3 is nothing without the people who drive it.",
    tags: ["DAO", "Governance", "Community"],
  },
  {
    id: 3,
    color: "#9911ff",
    label: "Innovate with Blockchain Technology",
    image: image3,
    description:
      "From zero-knowledge proofs to cross-chain bridges, we stay ahead of the curve so you don't have to. Innovation isn't a buzzword here — it's the baseline.",
    tags: ["ZK Proofs", "Cross-chain", "R&D"],
  },
  {
    id: 4,
    color: "#0d63f8",
    label: "Create Secure Smart Contracts",
    image: image4,
    description:
      "Audited, battle-tested, and built for edge cases. Our security-first approach means every line of Solidity is reviewed for vulnerabilities before it ever touches mainnet.",
    tags: ["Audit", "Solidity", "Security"],
  },
  {
    id: 5,
    color: "#0cdcf7",
    label: "Drive Web3 Adoption",
    image: image5,
    description:
      "Education, onboarding flows, and developer tooling that lower the barrier to entry. We're building the bridge between Web2 curiosity and Web3 confidence.",
    tags: ["Onboarding", "Education", "Dev Tools"],
  },
];

// Mirrors CARD colors as [r, g, b] for gradient interpolation in the canvas.
const PALETTE = [
  [255,   0, 136],
  [221,   0, 238],
  [153,  17, 255],
  [ 13,  99, 248],
  [ 12, 220, 247],
];

const NODE_COUNT   = 55;
const CONNECT_DIST = 220;

// ─── visualViewport helpers ───────────────────────────────────────────────────
//
// Always read the REAL rendered size. At zoom ≠ 100%, window.innerWidth stays
// fixed to the CSS-pixel layout viewport, while visualViewport.width correctly
// reflects the narrower visual viewport. Using innerWidth for --vvw or section
// height causes panels to be sized for the layout viewport instead of what is
// actually visible, producing misaligned layouts at any non-100% zoom level.
//
const vvWidth  = () => window.visualViewport?.width  ?? window.innerWidth;
const vvHeight = () => window.visualViewport?.height ?? window.innerHeight;

// ─── Canvas helpers ───────────────────────────────────────────────────────────

/** Linearly interpolate a colour from PALETTE at a given world-x position. */
function samplePaletteColor(wx, worldWidth) {
  const t      = Math.max(0, Math.min(1, wx / worldWidth));
  const scaled = t * (PALETTE.length - 1);
  const lo     = Math.floor(scaled);
  const hi     = Math.min(lo + 1, PALETTE.length - 1);
  const f      = scaled - lo;
  const [ar, ag, ab] = PALETTE[lo];
  const [br, bg, bb] = PALETTE[hi];
  return [
    Math.round(ar + (br - ar) * f),
    Math.round(ag + (bg - ag) * f),
    Math.round(ab + (bb - ab) * f),
  ];
}

// ─── Hook: scroll-synced interconnecting lines ────────────────────────────────

/**
 * Renders an animated node-graph on `canvasRef`.
 * Nodes live in a world 5× the canvas width; `xPosRef` pans them in sync
 * with the horizontal scroll position so lines appear world-anchored.
 *
 * Both args are stable refs — intentionally omitted from the dep array.
 */
function useInterconnectLines(canvasRef, xPosRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let nodes = [];
    let W = 0, H = 0;
    let lastX = 0;
    let raf;

    const buildNodes = () => {
      W = canvas.width;
      H = canvas.height;
      const worldW = W * 5;
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        wx: Math.random() * worldW,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.22,
      }));
    };

    const resize = () => {
      canvas.width  = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      buildNodes();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onVVChange = () => resize();
    window.visualViewport?.addEventListener("resize", onVVChange);
    window.visualViewport?.addEventListener("scroll", onVVChange);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      const xOffset   = xPosRef.current ?? 0;
      const scrollVel = Math.abs(xOffset - lastX);
      lastX           = xOffset;
      const velBoost  = Math.min(scrollVel * 0.012, 0.35);
      const worldW    = W * 5;

      // Advance nodes, bouncing off world edges
      for (const n of nodes) {
        n.wx += n.vx;
        n.y  += n.vy;
        if (n.wx < 0 || n.wx > worldW) n.vx *= -1;
        if (n.y  < 0 || n.y  > H)     n.vy *= -1;
      }

      // Draw edges between nearby nodes with palette-sampled gradient colour
      for (let i = 0; i < nodes.length; i++) {
        const ax = nodes[i].wx + xOffset;
        const ay = nodes[i].y;

        for (let j = i + 1; j < nodes.length; j++) {
          const bx   = nodes[j].wx + xOffset;
          const by   = nodes[j].y;
          const dist = Math.hypot(ax - bx, ay - by);
          if (dist >= CONNECT_DIST) continue;

          const [r1, g1, b1] = samplePaletteColor(nodes[i].wx, worldW);
          const [r2, g2, b2] = samplePaletteColor(nodes[j].wx, worldW);
          const baseAlpha    = (1 - dist / CONNECT_DIST) * 0.28;
          const alpha        = Math.min(baseAlpha + velBoost * baseAlpha, 0.65);

          const grad = ctx.createLinearGradient(ax, ay, bx, by);
          grad.addColorStop(0, `rgba(${r1},${g1},${b1},${alpha.toFixed(3)})`);
          grad.addColorStop(1, `rgba(${r2},${g2},${b2},${alpha.toFixed(3)})`);

          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.strokeStyle = grad;
          ctx.lineWidth   = 0.65 + velBoost * 0.6;
          ctx.stroke();
        }

        // Only draw dots for on-screen nodes to avoid wasted GPU calls
        if (ax > -20 && ax < W + 20) {
          const [r, g, b] = samplePaletteColor(nodes[i].wx, worldW);
          const dotAlpha  = Math.min(0.30 + velBoost * 0.5, 0.82);
          ctx.beginPath();
          ctx.arc(ax, ay, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${dotAlpha})`;
          ctx.fill();
        }
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.visualViewport?.removeEventListener("resize", onVVChange);
      window.visualViewport?.removeEventListener("scroll", onVVChange);
    };
  }, [canvasRef, xPosRef]); // stable refs — no deps needed
}

// ─── CardModal ────────────────────────────────────────────────────────────────

const CardModal = ({ card, onClose }) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    // Move focus into the modal immediately
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="card-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="card-modal"
        style={{ "--modal-color": card.color }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Left — image */}
        <div className="modal-image-container">
          <span className="modal-image-number" aria-hidden="true">
            0{card.id}
          </span>
          <div className="modal-image-frame">
            <img
              src={card.image}
              alt={card.label}
              className="modal-image"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right — content */}
        <div className="modal-content">
          <button
            ref={closeButtonRef}
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>

          <span className="modal-category">EXPERTISE</span>
          <h2 id="modal-title" className="modal-title">
            {card.label}
          </h2>

          <div className="modal-divider" aria-hidden="true" />

          <p className="modal-description">{card.description}</p>

          {/* ul>li for correct list semantics (was div>span) */}
          <ul className="modal-tags" aria-label="Tags">
            {card.tags.map((tag) => (
              <li key={tag} className="modal-tag">
                {tag}
              </li>
            ))}
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

const HorizontalSection = forwardRef(function HorizontalSection({
  valuesRef,
  hxPosRef,
}) {
  const sectionRef  = useRef(null);
  const trackRef    = useRef(null);
  const canvasRef   = useRef(null);
  const maxX        = useRef(0);
  const rafId       = useRef(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const wasLocked   = useRef(false);
  const [activeCard, setActiveCard] = useState(null);

  // hxPosRef IS the shared x-position ref passed from the parent
  const xPos = hxPosRef;

  useInterconnectLines(canvasRef, xPos);

  // ── Measurements ─────────────────────────────────────────────────────────

  const calcMaxX = useCallback(() => {
    if (trackRef.current) {
      maxX.current = -(trackRef.current.scrollWidth - vvWidth());
    }
  }, []);

  // ── DOM mutations ─────────────────────────────────────────────────────────

  const applyHeight = useCallback(() => {
    if (sectionRef.current) {
      sectionRef.current.style.height = `${vvHeight()}px`;
    }
  }, []);

  // Sync --vvw to visualViewport width so panel widths are correct at any zoom
  const applyViewportWidth = useCallback(() => {
    document.documentElement.style.setProperty("--vvw", `${vvWidth()}px`);
  }, []);

  // Add .in-view once a card enters the visible horizontal viewport
  const updateCardVisibility = useCallback((currentX) => {
    if (!sectionRef.current) return;
    const vw = vvWidth();
    sectionRef.current.querySelectorAll(".gallery-item").forEach((card) => {
      const cardLeft  = card.offsetLeft + currentX;
      const cardRight = cardLeft + card.offsetWidth;
      if (cardLeft < vw * 0.95 && cardRight > 0) {
        card.classList.add("in-view");
      }
    });
  }, []);

  const applyX = useCallback(
    (newX) => {
      const clamped = Math.min(0, Math.max(maxX.current, newX));
      xPos.current = clamped;
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${clamped}px)`;
      }
      updateCardVisibility(clamped);
    },
    [xPos, updateCardVisibility]
  );

  // ── Scroll locking ────────────────────────────────────────────────────────

  /**
   * Returns true while the section should "own" scroll input.
   * Two lock conditions:
   *   1. Section is pinned at the top with horizontal travel remaining.
   *   2. Section is about to become pinned (snap-back zone near top).
   */
  const checkLock = useCallback(() => {
    if (!sectionRef.current) return false;
    const rect = sectionRef.current.getBoundingClientRect();
    const H    = vvHeight();

    const locked =
      (rect.top <= 1 && rect.bottom > H * 0.5) ||
      (rect.top > 0 && rect.top < H * 0.08 && xPos.current < -4);

    if (locked && !wasLocked.current) {
      wasLocked.current = true;
      sectionRef.current.classList.add("section-active");
    }
    if (!locked && rect.bottom < 0) {
      wasLocked.current = false;
      sectionRef.current.classList.remove("section-active");
    }
    return locked;
  }, [xPos]);

  /**
   * Snaps the page scroll to the section's top edge.
   * Null-guards offsetTop to avoid a crash if the ref is momentarily detached.
   */
  const pinSection = useCallback(() => {
    const target = sectionRef.current?.offsetTop;
    if (target != null && Math.abs(window.scrollY - target) > 1) {
      window.scrollTo({ top: target, behavior: "instant" });
    }
  }, []);

  // ── Input handlers ────────────────────────────────────────────────────────

  const onWheel = useCallback(
    (e) => {
      if (activeCard || !checkLock()) return;
      const delta = e.deltaY || e.deltaX;
      // Let the page scroll naturally when already at horizontal edges
      if (delta < 0 && xPos.current >= 0)            return;
      if (delta > 0 && xPos.current <= maxX.current) return;
      e.preventDefault();
      pinSection();
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() =>
        applyX(xPos.current - delta * 1.2)
      );
    },
    [checkLock, pinSection, applyX, xPos, activeCard]
  );

  const onTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchMove = useCallback(
    (e) => {
      if (activeCard || !checkLock()) return;
      const dy    = touchStartY.current - e.touches[0].clientY;
      const dx    = touchStartX.current - e.touches[0].clientX;
      const delta = Math.abs(dy) > Math.abs(dx) ? dy : dx;
      if (delta < 0 && xPos.current >= 0)            return;
      if (delta > 0 && xPos.current <= maxX.current) return;
      e.preventDefault();
      pinSection();
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() =>
        applyX(xPos.current - delta * 1.8)
      );
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    },
    [checkLock, pinSection, applyX, xPos, activeCard]
  );

  /** Prevents the page from over-scrolling past the section boundaries. */
  const onScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const sectionTop = sectionRef.current.offsetTop;
    const sy         = window.scrollY;

    if (sy > sectionTop + 4 && xPos.current > maxX.current + 4) {
      window.scrollTo({ top: sectionTop, behavior: "instant" });
      return;
    }
    if (sy < sectionTop - 4 && xPos.current < -4) {
      window.scrollTo({ top: sectionTop, behavior: "instant" });
      return;
    }
    const rect = sectionRef.current.getBoundingClientRect();
    if (rect.top <= 1 && rect.top > -10) pinSection();
  }, [xPos, pinSection]);

  // ── Layout sync (runs synchronously before paint) ─────────────────────────
  //
  // useLayoutEffect ensures --vvw and section height are applied on the very
  // first paint, eliminating the one-frame flash at zoom ≠ 100% where panels
  // briefly render at layout-viewport width before JS corrects them.
  //
  useLayoutEffect(() => {
    applyHeight();
    applyViewportWidth();
    calcMaxX();
    updateCardVisibility(xPos.current);
  }, [applyHeight, applyViewportWidth, calcMaxX, updateCardVisibility, xPos]);

  // ── Event listeners ───────────────────────────────────────────────────────

  useEffect(() => {
    const onVVChange = () => {
      applyHeight();
      applyViewportWidth();
      calcMaxX();
      applyX(xPos.current); // re-clamp immediately after any resize
    };

    const ro = new ResizeObserver(onVVChange);
    if (sectionRef.current) ro.observe(sectionRef.current);

    window.visualViewport?.addEventListener("resize", onVVChange);
    window.visualViewport?.addEventListener("scroll", onVVChange);
    window.addEventListener("resize",     onVVChange);
    window.addEventListener("wheel",      onWheel,      { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true  });
    window.addEventListener("touchmove",  onTouchMove,  { passive: false });
    window.addEventListener("scroll",     onScroll,     { passive: true  });

    return () => {
      window.visualViewport?.removeEventListener("resize", onVVChange);
      window.visualViewport?.removeEventListener("scroll", onVVChange);
      window.removeEventListener("resize",     onVVChange);
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("scroll",     onScroll);
      ro.disconnect();
      cancelAnimationFrame(rafId.current);
    };
  }, [
    onWheel, onTouchStart, onTouchMove, onScroll,
    applyHeight, applyViewportWidth, applyX, calcMaxX,
    xPos, updateCardVisibility,
  ]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <section
        id="values-expertise"
        ref={sectionRef}
        className="horizontal-section"
      >
        <div className="hs-grain" aria-hidden="true" />
        <canvas
          ref={canvasRef}
          className="hs-lines-canvas"
          aria-hidden="true"
        />

        <div ref={trackRef} className="hs-track">

          {/* Panel 1 — Values */}
          <div ref={valuesRef} className="hs-panel values-panel">
            <div className="values-inner">
              <p className="values-eyebrow">OUR CORE VALUES</p>
              <h2 className="values-headline">
                The principles<br />
                that drive<br />
                everything<br />
                we do.
              </h2>
              <p className="values-hint" aria-label="Scroll to explore">
                SCROLL TO EXPLORE →
              </p>
            </div>
          </div>

          {/* Panel 2 — Cards */}
          <div className="hs-panel cards-panel" role="list">
            {CARDS.map((card) => (
              <div
                key={card.id}
                className="gallery-item"
                style={{
                  "--item-color": card.color,
                  "--item-image": `url(${card.image})`,
                }}
                onClick={() => setActiveCard(card)}
                role="listitem"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setActiveCard(card)}
                aria-label={`Expand ${card.label}`}
              >
                <div className="item-content">
                  <span className="item-number" aria-hidden="true">
                    0{card.id}
                  </span>
                  <h3>{card.label}</h3>
                  <span className="item-expand-hint" aria-hidden="true">
                    Click to explore →
                  </span>
                </div>
                <div className="item-shine" aria-hidden="true" />
              </div>
            ))}
          </div>

        </div>
      </section>

      {activeCard && (
        <CardModal card={activeCard} onClose={() => setActiveCard(null)} />
      )}
    </>
  );
});

export default HorizontalSection;