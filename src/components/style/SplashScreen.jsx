import { useState } from "react";
import Orb from "../Orb/Orb";
import TrueFocus from "../TrueFocus/TrueFocus";
import "./splash.css";

export default function SplashScreen({ onFinish }) {
  const [leaving, setLeaving] = useState(false);

  const handleDiveIn = () => {
    setLeaving(true);
    setTimeout(onFinish, 600); // wait for fade-out transition
  };

  return (
    <div className={`splash ${leaving ? "splash--leaving" : ""}`}>

      {/* ── Orb — fills the entire splash background ── */}
      <div className="splash-orb">
        <Orb
          hoverIntensity={2}
          rotateOnHover
          hue={0}
          forceHoverState={false}
          backgroundColor="#000000"
        />
      </div>

      {/* ── Centred content ── */}
      <div className="splash-content">

        {/* TrueFocus animated brand name */}
        <div className="splash-focus-wrap">
          <TrueFocus
            sentence="BUILD MINDZ"
            manualMode={false}
            blurAmount={6}
            borderColor="#ffffff"
            glowColor="rgba(255,255,255,0.45)"
            animationDuration={0.6}
            pauseBetweenAnimations={1.2}
          />
        </div>

        {/* Dive In button */}
        <button className="splash-button" onClick={handleDiveIn}>
          Dive In
        </button>
      </div>
    </div>
  );
}