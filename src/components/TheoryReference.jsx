import { motion } from "framer-motion";

function TheoryReference() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55 }}
      className="space-y-6"
    >
      <h2 className="section-title">Theory Reference</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="formula-block">
          <p className="formula-title">SSS Formula</p>
          <p className="font-mono text-lg leading-relaxed">
            SSS(M,λ,D) = 1 - (1/B)·Σ_b |Ŝ_b Δ S*| / max(|Ŝ_b|,|S*|,1)
          </p>
        </div>

        <div className="formula-block">
          <p className="formula-title">ρ* Threshold</p>
          <p className="font-mono text-lg leading-relaxed">ρ*(n,k) = √(n/k) - 1</p>
        </div>
      </div>
    </motion.section>
  );
}

export default TheoryReference;
