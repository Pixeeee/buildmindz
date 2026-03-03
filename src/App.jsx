import { useState } from "react";
import SplashScreen from "./components/style/SplashScreen";
import LandingPage from "./components/pages/LandingPage";

function App() {
  const [loading, setLoading] = useState(true);
  const [landingKey, setLandingKey] = useState(0);

  if (loading) return <SplashScreen onFinish={() => setLoading(false)} />;

  // Call this to "refresh" the LandingPage
  const refreshLandingPage = () => {
    setLandingKey(prev => prev + 1); // Changing key remounts LandingPage
    window.scrollTo(0, 0);           // Ensure page starts at top
  };

  return (
    <LandingPage
      key={landingKey}
      refreshLandingPage={refreshLandingPage}
    />
  );
}

export default App;