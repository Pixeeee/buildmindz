import { useRef } from "react";
import DotsBackground     from "../DotsBackground/DotsBackground";
import Navbar             from "../Navbar/Navbar";
import HeroSection        from "../HeroSection/HeroSection";
import ScrollingLogo      from "../ScrollingLogo/ScrollingLogo";
import HorizontalSection  from "../HorizontalSection/HorizontalSection";
import TeamSection        from "../TeamSection/TeamSection";
import ContactSection     from "../ContactSection/ContactSection";
import Footer             from "../Footer/Footer";
import "./LandingPage.css";

const LandingPage = () => {
  const heroRef       = useRef(null); // HeroSection <section>
  const logoAreaRef   = useRef(null); // .hero-logo-area placeholder
  const valuesRef     = useRef(null); // values panel inside HorizontalSection
  const hxPosRef      = useRef(0);    // SHARED horizontal x position (px, ≤0)
  //                                     HorizontalSection writes → ScrollingLogo reads

  return (
    <div className="landing-page">
      <DotsBackground />

      {/* Fixed logo — travels hero→values, then syncs with horizontal scroll */}
      <ScrollingLogo
        heroRef={heroRef}
        valuesRef={valuesRef}
        logoAreaRef={logoAreaRef}
        hxPosRef={hxPosRef}
      />

      <Navbar />

      <HeroSection ref={heroRef} logoAreaRef={logoAreaRef} />

      {/* hxPosRef is written by HorizontalSection on every frame */}
      <HorizontalSection
        valuesRef={valuesRef}
        hxPosRef={hxPosRef}
      />

      <TeamSection      />
      <ContactSection   />
      <Footer           />
    </div>
  );
};

export default LandingPage;