/* eslint-disable react-hooks/immutability */
import { forwardRef, useEffect, useRef, useCallback, useState } from "react";
import "./HorizontalSection.css";

import image1 from "../../assets/images/image1.jpg";
import image2 from "../../assets/images/image2.jpg";
import image3 from "../../assets/images/image3.png";
import image4 from "../../assets/images/image4.png";
import image5 from "../../assets/images/image5.png";

const CARDS = [
  {
    id: 1, color: "#ff0088", label: "Build Scalable Web3 Solutions", image: image1,
    description: "We architect decentralized infrastructures from the ground up — smart contracts, layer-2 integrations, and protocol design that handles millions of transactions without breaking a sweat.",
    tags: ["Smart Contracts", "Layer-2", "Protocol Design"],
  },
  {
    id: 2, color: "#dd00ee", label: "Empower Decentralized Communities", image: image2,
    description: "Governance models, DAO frameworks, and community tooling that put power back into the hands of builders. We believe Web3 is nothing without the people who drive it.",
    tags: ["DAO", "Governance", "Community"],
  },
  {
    id: 3, color: "#9911ff", label: "Innovate with Blockchain Technology", image: image3,
    description: "From zero-knowledge proofs to cross-chain bridges, we stay ahead of the curve so you don't have to. Innovation isn't a buzzword here — it's the baseline.",
    tags: ["ZK Proofs", "Cross-chain", "R&D"],
  },
  {
    id: 4, color: "#0d63f8", label: "Create Secure Smart Contracts", image: image4,
    description: "Audited, battle-tested, and built for edge cases. Our security-first approach means every line of Solidity is reviewed for vulnerabilities before it ever touches mainnet.",
    tags: ["Audit", "Solidity", "Security"],
  },
  {
    id: 5, color: "#0cdcf7", label: "Drive Web3 Adoption", image: image5,
    description: "Education, onboarding flows, and developer tooling that lower the barrier to entry. We're building the bridge between Web2 curiosity and Web3 confidence.",
    tags: ["Onboarding", "Education", "Dev Tools"],
  },
];

// ─── Scroll-synced interconnecting lines ─────────────────────────────────────
function useInterconnectLines(canvasRef, xPosRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const NODE_COUNT   = 55;
    const CONNECT_DIST = 220;

    let nodes = [], W = 0, H = 0;
    // scrollVelocity is used to make lines pulse more when scrolling fast
    let lastX = 0, scrollVel = 0;

    const buildNodes = () => {
      W = canvas.width;
      H = canvas.height;
      const WW = W * 5;
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        wx:  Math.random() * WW,
        y:   Math.random() * H,
        vx:  (Math.random() - 0.5) * 0.35,
        vy:  (Math.random() - 0.5) * 0.22,
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

    let raf;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      const xOffset = xPosRef.current ?? 0;

      // Measure scroll velocity for dynamic line brightness
      scrollVel = Math.abs(xOffset - lastX);
      lastX     = xOffset;

      // Extra alpha boost when scrolling fast (capped at 0.35 extra)
      const velBoost = Math.min(scrollVel * 0.012, 0.35);

      const WW = W * 5;
      nodes.forEach(n => {
        n.wx += n.vx;
        n.y  += n.vy;
        if (n.wx < 0 || n.wx > WW) n.vx *= -1;
        if (n.y  < 0 || n.y  > H)  n.vy *= -1;
      });

      // Lines
      for (let i = 0; i < nodes.length; i++) {
        const ax = nodes[i].wx + xOffset;
        const ay = nodes[i].y;

        for (let j = i + 1; j < nodes.length; j++) {
          const bx = nodes[j].wx + xOffset;
          const by = nodes[j].y;
          const dx = ax - bx, dy = ay - by;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const baseAlpha = (1 - dist / CONNECT_DIST) * 0.38;
            const alpha     = Math.min(baseAlpha + velBoost * baseAlpha, 0.75);
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.strokeStyle = `rgba(0,0,0,${alpha.toFixed(3)})`;
            ctx.lineWidth   = 0.7 + velBoost * 0.6;
            ctx.stroke();
          }
        }

        // Dots — only when visible on screen
        if (ax > -20 && ax < W + 20) {
          const dotAlpha = 0.35 + velBoost * 0.5;
          ctx.beginPath();
          ctx.arc(ax, ay, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,0,0,${Math.min(dotAlpha, 0.85)})`;
          ctx.fill();
        }
      }
    };
    draw();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [canvasRef, xPosRef]);
}

// ─── Expanded card modal ──────────────────────────────────────────────────────
const CardModal = ({ card, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="card-modal-backdrop" onClick={onClose}>
      <div
        className="card-modal"
        style={{ "--modal-color": card.color }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image */}
        <div
          className="modal-image"
          style={{ backgroundImage: `url(${card.image})` }}
        >
          <div className="modal-image-overlay" />
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
          <span className="modal-number">0{card.id}</span>
        </div>

        {/* Content */}
        <div className="modal-body">
          <h2 className="modal-title">{card.label}</h2>
          <p className="modal-description">{card.description}</p>
          <div className="modal-tags">
            {card.tags.map(tag => (
              <span key={tag} className="modal-tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const HorizontalSection = forwardRef(function HorizontalSection({ valuesRef, hxPosRef }) {
  const sectionRef  = useRef(null);
  const trackRef    = useRef(null);
  const canvasRef   = useRef(null);
  const maxX        = useRef(0);
  const rafId       = useRef(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const [activeCard, setActiveCard] = useState(null);

  const xPos = hxPosRef;

  useInterconnectLines(canvasRef, xPos);

  const calcMaxX = useCallback(() => {
    if (!trackRef.current || !sectionRef.current) return;
    maxX.current = -(trackRef.current.scrollWidth - sectionRef.current.clientWidth);
  }, []);

  const applyX = useCallback((newX) => {
    const clamped = Math.min(0, Math.max(maxX.current, newX));
    xPos.current = clamped;
    if (trackRef.current) trackRef.current.style.transform = `translateX(${clamped}px)`;
  }, [xPos]);

  const checkLock = useCallback(() => {
    if (!sectionRef.current) return false;
    const rect = sectionRef.current.getBoundingClientRect();
    const H    = window.innerHeight;
    // Standard: section pinned at viewport top (scrolling down through cards)
    if (rect.top <= 1 && rect.bottom > H * 0.5) return true;
    // Approaching from below: section just entering viewport (scrolling up fast)
    // Lock only if horizontal hasn't been fully rewound yet
    if (rect.top > 0 && rect.top < H * 0.08 && xPos.current < -4) return true;
    return false;
  }, [xPos]);

  const pinSection = useCallback(() => {
    if (!sectionRef.current) return;
    const target = sectionRef.current.offsetTop;
    if (Math.abs(window.scrollY - target) > 1) window.scrollTo({ top: target, behavior: "instant" });
  }, []);

  // ── Wheel ─────────────────────────────────────────────────────────────────
  const onWheel = useCallback((e) => {
    if (activeCard) return;
    if (!checkLock()) return;
    const delta = e.deltaY || e.deltaX;
    // Release: at start scrolling up  →  let page scroll up
    if (delta < 0 && xPos.current >= 0)            return;
    // Release: at end scrolling down  →  let page scroll down
    if (delta > 0 && xPos.current <= maxX.current) return;
    e.preventDefault();
    pinSection();
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => applyX(xPos.current - delta * 1.2));
  }, [checkLock, pinSection, applyX, xPos, activeCard]);

  // ── Touch ──────────────────────────────────────────────────────────────────
  const onTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e) => {
    if (activeCard) return;
    if (!checkLock()) return;
    const dy    = touchStartY.current - e.touches[0].clientY;
    const dx    = touchStartX.current - e.touches[0].clientX;
    const delta = Math.abs(dy) > Math.abs(dx) ? dy : dx;
    if (delta < 0 && xPos.current >= 0)            return;
    if (delta > 0 && xPos.current <= maxX.current) return;
    e.preventDefault();
    pinSection();
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => applyX(xPos.current - delta * 1.8));
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  }, [checkLock, pinSection, applyX, xPos, activeCard]);

  // ── Scroll — overshoot guards for both directions ─────────────────────────
  const onScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const sectionTop = sectionRef.current.offsetTop;
    const sy         = window.scrollY;

    // ── Bug 1 guard: fast scroll DOWN overshot past section ──
    // Page jumped below sectionTop but horizontal track isn't done yet
    if (sy > sectionTop + 4 && xPos.current > maxX.current + 4) {
      window.scrollTo({ top: sectionTop, behavior: "instant" });
      return;
    }

    // ── Bug 2 guard: fast scroll UP overshot past section ──
    // Page jumped above sectionTop but horizontal track isn't rewound yet
    if (sy < sectionTop - 4 && xPos.current < -4) {
      window.scrollTo({ top: sectionTop, behavior: "instant" });
      return;
    }

    // Normal soft-pin when hovering right at section top
    const rect = sectionRef.current.getBoundingClientRect();
    if (rect.top <= 1 && rect.top > -10) pinSection();
  }, [xPos, pinSection]);

  useEffect(() => {
    calcMaxX();
    const ro = new ResizeObserver(calcMaxX);
    if (sectionRef.current) ro.observe(sectionRef.current);
    window.addEventListener("wheel",      onWheel,      { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true  });
    window.addEventListener("touchmove",  onTouchMove,  { passive: false });
    window.addEventListener("scroll",     onScroll,     { passive: true  });
    return () => {
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("scroll",     onScroll);
      ro.disconnect();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [onWheel, onTouchStart, onTouchMove, onScroll, calcMaxX]);

  return (
    <>
      <section id="values-expertise" ref={sectionRef} className="horizontal-section">
        <canvas ref={canvasRef} className="hs-lines-canvas" />
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
              <p className="values-hint">SCROLL TO EXPLORE →</p>
            </div>
          </div>

          {/* Panel 2 — Cards */}
          <div className="hs-panel cards-panel">
            {CARDS.map((card) => (
              <div
                key={card.id}
                className="gallery-item"
                style={{
                  "--item-color": card.color,
                  "--item-image": `url(${card.image})`,
                }}
                onClick={() => setActiveCard(card)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setActiveCard(card)}
                aria-label={`Expand ${card.label}`}
              >
                <div className="item-content">
                  <span className="item-number">0{card.id}</span>
                  <h3>{card.label}</h3>
                  <span className="item-expand-hint">Click to explore →</span>
                </div>
                {/* Hover shine effect */}
                <div className="item-shine" />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Expanded card modal — rendered outside section so it overlays everything */}
      {activeCard && (
        <CardModal card={activeCard} onClose={() => setActiveCard(null)} />
      )}
    </>
  );
});

export default HorizontalSection;