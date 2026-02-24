import { useState } from "react";
import SplashScreen from "./components/style/SplashScreen";
import LandingPage from "./components/pages/LandingPage";

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) return <SplashScreen onFinish={() => setLoading(false)} />;

  return <LandingPage />;
}

export default App;
