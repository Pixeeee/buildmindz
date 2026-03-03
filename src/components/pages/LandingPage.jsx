import { useRef, useState } from "react";
import DotsBackground    from "../DotsBackground/DotsBackground";
import Navbar            from "../Navbar/Navbar";
import HeroSection       from "../HeroSection/HeroSection";
import ScrollingLogo     from "../ScrollingLogo/ScrollingLogo";
import HorizontalSection from "../HorizontalSection/HorizontalSection";
import ScrollTextSection from "../ScrollText/ScrollTextSection";
import TeamSection       from "../TeamSection/TeamSection";
import ContactSection    from "../ContactSection/ContactSection";
import Footer            from "../Footer/Footer";
import "./LandingPage.css";

const LandingPage = () => {
  const heroRef     = useRef(null); // HeroSection <section>
  const logoAreaRef = useRef(null); // .hero-logo-area placeholder
  const valuesRef   = useRef(null); // values panel inside HorizontalSection
  const hxPosRef    = useRef(0);    // SHARED horizontal x position (px, ≤0)
  
  // State to trigger a "refresh" by remounting LandingPage content
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to refresh the LandingPage
  const refreshLandingPage = () => {
    setRefreshKey(prev => prev + 1); // Increment key → forces remount
    window.scrollTo({ top: 0, left: 0, behavior: "auto" }); // Ensure spawn at top
  };

  return (
    <div className="landing-page" key={refreshKey}>
      <DotsBackground />

      {/* Fixed logo — travels hero→values, then syncs with horizontal scroll */}
      <ScrollingLogo
        heroRef={heroRef}
        valuesRef={valuesRef}
        logoAreaRef={logoAreaRef}
        hxPosRef={hxPosRef}
      />

      <Navbar refreshLandingPage={refreshLandingPage} />

      <HeroSection ref={heroRef} logoAreaRef={logoAreaRef} />

      {/* hxPosRef is written by HorizontalSection on every frame */}
      <HorizontalSection
        valuesRef={valuesRef}
        hxPosRef={hxPosRef}
      />

      <ScrollTextSection />

      <TeamSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default LandingPage;