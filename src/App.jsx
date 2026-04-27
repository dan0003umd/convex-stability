import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import HeroHeader from "./components/HeroHeader";
import KeyFinding from "./components/KeyFinding";
import ControlsPanel from "./components/ControlsPanel";
import SSSCurvesChart from "./components/SSSCurvesChart";
import DeltaSSSChart from "./components/DeltaSSSChart";
import MethodCards from "./components/MethodCards";
import TheoryReference from "./components/TheoryReference";
import Footer from "./components/Footer";
import DarkModeToggle from "./components/DarkModeToggle";
import { INTERP_DATA, RHO_DATA } from "./data";

function App() {
  const [theme, setTheme] = useState("light");
  const [nSamples, setNSamples] = useState(200);
  const [kGroup, setKGroup] = useState(5);
  const [lambdaValue, setLambdaValue] = useState(0.05);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const rhoRaw = useMemo(() => Math.sqrt(nSamples / kGroup) - 1, [nSamples, kGroup]);
  const rhoStar = useMemo(() => Math.max(0, Math.min(1, rhoRaw)), [rhoRaw]);
  const showReferenceLine = rhoRaw < 1;

  return (
    <div className="min-h-screen bg-app-bg text-app-text transition-colors duration-200 ease-in-out">
      <DarkModeToggle theme={theme} setTheme={setTheme} />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pb-16 pt-10 md:px-8">
        <HeroHeader />
        <KeyFinding rhoRaw={rhoRaw} />
        <ControlsPanel
          nSamples={nSamples}
          setNSamples={setNSamples}
          kGroup={kGroup}
          setKGroup={setKGroup}
          lambdaValue={lambdaValue}
          setLambdaValue={setLambdaValue}
          rhoRaw={rhoRaw}
          rhoStar={rhoStar}
        />
        <SSSCurvesChart data={INTERP_DATA} rhoStar={rhoStar} showReferenceLine={showReferenceLine} />
        <DeltaSSSChart data={INTERP_DATA} rhoStar={rhoStar} showReferenceLine={showReferenceLine} />
        <MethodCards data={RHO_DATA} />
        <TheoryReference />
      </main>

      <AnimatePresence>
        <Footer />
      </AnimatePresence>
    </div>
  );
}

export default App;
