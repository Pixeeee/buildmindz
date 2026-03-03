import { useState } from "react";
import Orb from "../Orb/Orb";
import Shuffle from "../Shuffle/Shuffle";
import "./splash.css";

export default function SplashScreen({ onFinish }) {
  const [leaving, setLeaving] = useState(false);

  const handleDiveIn = () => {
    setLeaving(true);
    setTimeout(onFinish, 600);
  };

  return (
    <div className={`splash ${leaving ? "splash--leaving" : ""}`}>

      {/* Orb fills the entire splash background */}
      <div className="splash-orb">
        <Orb
          hoverIntensity={2}
          rotateOnHover
          hue={0}
          forceHoverState={false}
          backgroundColor="#000000"
        />
      </div>

      {/* Centred content */}
      <div className="splash-content">

        {/* Shuffle animated brand name */}
        <div className="splash-focus-wrap">
          <Shuffle
            text="BUILD"
            shuffleDirection="up"
            duration={1.5}
            animationMode="evenodd"
            shuffleTimes={2}
            ease="power3.out"
            stagger={0.5}
            triggerOnce={true}
            triggerOnHover={true}
          />
          <Shuffle
            text="MINDZ"
            shuffleDirection="up"
            duration={1.5}
            animationMode="evenodd"
            shuffleTimes={2}
            ease="power3.out"
            stagger={0.5}
            triggerOnce={true}
            triggerOnHover={true}
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