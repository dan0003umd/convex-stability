import { motion } from "framer-motion";

function SliderRow({ label, value, min, max, step, onChange, formatter = (v) => v }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <label className="font-semibold">{label}</label>
        <span className="font-mono text-app-accent">{formatter(value)}</span>
      </div>
      <input
        className="slider w-full"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

function ControlsPanel({
  nSamples,
  setNSamples,
  kGroup,
  setKGroup,
  lambdaValue,
  setLambdaValue,
  rhoRaw,
  rhoStar,
}) {
  const lambdaLog = Math.log10(lambdaValue).toFixed(3);

  return (
    <motion.section
      className="scientific-panel p-6 md:p-8"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55 }}
    >
      <h2 className="section-title">Interactive Controls</h2>

      <div className="mt-6 space-y-6">
        <SliderRow label="n_samples" min={10} max={500} step={10} value={nSamples} onChange={setNSamples} />

        <SliderRow label="k_group" min={2} max={20} step={1} value={kGroup} onChange={setKGroup} />

        <SliderRow
          label="lambda"
          min={0.001}
          max={0.5}
          step={0.001}
          value={lambdaValue}
          onChange={setLambdaValue}
          formatter={(value) => `${value.toFixed(3)}  (log10=${lambdaLog})`}
        />
      </div>

      <div className="mt-8 border border-app-border bg-app-surface p-4 font-mono text-sm leading-relaxed">
        <p>ρ* = max(0, min(1, sqrt(n_samples / k_group) - 1))</p>
        <p className="mt-2 text-base text-app-text">raw ρ* = {rhoRaw.toFixed(2)}</p>
        <p className="text-base text-app-text">clamped ρ* = {rhoStar.toFixed(2)}</p>
      </div>

      <p className="mt-4 text-sm font-medium text-app-accent-2">
        {rhoRaw >= 1
          ? "Group Lasso dominates for all ρ (current config)"
          : "Finite threshold in range: vertical ρ* marker shown in charts."}
      </p>
    </motion.section>
  );
}

export default ControlsPanel;
