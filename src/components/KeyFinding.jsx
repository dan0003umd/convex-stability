import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";

function NumericCard({ value, prefix = "", suffix = "", label, decimals = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (latest) => `${prefix}${latest.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    if (!isInView) {
      return;
    }
    const controls = animate(motionValue, value, { duration: 1.2, ease: "easeOut" });
    return () => controls.stop();
  }, [isInView, motionValue, value]);

  return (
    <motion.article
      ref={ref}
      className="scientific-card p-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55 }}
    >
      <motion.div className="font-display text-4xl font-semibold text-app-accent">{display}</motion.div>
      <p className="mt-2 text-sm text-app-muted">{label}</p>
    </motion.article>
  );
}

function TextCard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reveal = useMotionValue(0);

  useEffect(() => {
    if (!isInView) {
      return;
    }
    const controls = animate(reveal, 1, { duration: 1, ease: "easeOut" });
    return () => controls.stop();
  }, [isInView, reveal]);

  return (
    <motion.article
      ref={ref}
      className="scientific-card p-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55 }}
    >
      <div className="font-display text-4xl font-semibold text-app-accent">ΔSSS &gt; 0</div>
      <motion.div className="mt-3 h-1 w-full origin-left bg-app-accent" style={{ scaleX: reveal }} />
      <p className="mt-2 text-sm text-app-muted">across entire ρ spectrum (n=200, k=5)</p>
    </motion.article>
  );
}

function KeyFinding({ rhoRaw }) {
  return (
    <section className="space-y-6">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.55 }}
      >
        The Key Finding
      </motion.h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <NumericCard value={0.69} suffix="×" label="Group Lasso stability advantage at ρ=0.5" />
        <TextCard />
        <NumericCard value={rhoRaw} prefix="ρ* = " decimals={2} label="Theoretical threshold - exceeds [0,1] range" />
      </div>
    </section>
  );
}

export default KeyFinding;
