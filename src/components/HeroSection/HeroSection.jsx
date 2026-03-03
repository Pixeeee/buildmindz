import { forwardRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Particles from "../Particles/Particles";
import "./HeroSection.css";

// ─── Inject visualViewport dimensions as CSS variables ───────────────────────
// --vvw / --vvh always equal the REAL rendered viewport, even at 200% zoom.
// CSS vh/vw units are based on the layout viewport and are WRONG at zoom.
function useVisualViewportVars(ref) {
  useEffect(() => {
    const el = ref?.current ?? document.documentElement;

    const update = () => {
      const vv = window.visualViewport;
      const w  = vv ? vv.width  : window.innerWidth;
      const h  = vv ? vv.height : window.innerHeight;
      el.style.setProperty("--vvw", `${w}px`);
      el.style.setProperty("--vvh", `${h}px`);
    };

    update();

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", update);
      window.visualViewport.addEventListener("scroll", update);
    }
    window.addEventListener("resize", update);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", update);
        window.visualViewport.removeEventListener("scroll", update);
      }
      window.removeEventListener("resize", update);
    };
  }, [ref]);
}

const HeroSection = forwardRef(function HeroSection({ logoAreaRef }, sectionRef) {
  // Set --vvw / --vvh on the section element so CSS can use them
  useVisualViewportVars(sectionRef);

  return (
    <section id="home" className="hero-section" ref={sectionRef}>

      {/* Particles background */}
      <div className="hero-particles" aria-hidden="true">
        <Particles
          particleCount={180}
          particleSpread={12}
          speed={0.3}
          particleColors={["#000000"]}
          moveParticlesOnHover
          particleHoverFactor={1.4}
          alphaParticles={false}
          particleBaseSize={80}
          sizeRandomness={1}
          cameraDistance={18}
          disableRotation={false}
        />
      </div>

      {/* Centered text */}
      <div className="hero-content">
        <p className="hero-eyebrow animate-fade-in">
          WEB3 FORWARD &nbsp;·&nbsp; BUILDMINDZ
        </p>
        <h1 className="hero-headline animate-fade-in-delay-1">
          Building Up The Filipino<br />
          Builders For Global<br />
          Composability.
        </h1>
        <a href="#contact" className="hero-cta animate-fade-in-delay-2">
          Get Started <ArrowRight size={18} />
        </a>
      </div>

      {/* Logo placeholder — ScrollingLogo pins to its exact centre */}
      <div
        className="hero-logo-area animate-fade-in-delay-3"
        ref={logoAreaRef}
        aria-hidden="true"
      >
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
        <span className="tick tick-top"    />
        <span className="tick tick-right"  />
        <span className="tick tick-bottom" />
        <span className="tick tick-left"   />
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator animate-bounce" aria-hidden="true">
        <div className="mouse"><div className="wheel" /></div>
      </div>

    </section>
  );
});

export default HeroSection;