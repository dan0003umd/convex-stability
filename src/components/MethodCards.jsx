import { motion } from "framer-motion";
import { METHOD_COLORS, METHODS } from "../data";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

function MethodCards({ data }) {
  const atZero = data.find((row) => row.rho === 0);
  const atNine = data.find((row) => row.rho === 0.9);

  return (
    <section>
      <motion.h2
        className="section-title mb-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.55 }}
      >
        Method Personality Cards
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {METHODS.map((method) => (
          <motion.article key={method.key} variants={item} className="method-card">
            <div className="h-[3px] w-full" style={{ backgroundColor: METHOD_COLORS[method.key] }} />
            <div className="p-5">
              <h3 className="font-display text-2xl">{method.name}</h3>
              <span className="mt-2 inline-flex border border-app-border bg-app-surface-2 px-2 py-1 text-xs font-medium text-app-muted">
                {method.sparsity}
              </span>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-app-muted">SSS at ρ=0.0</p>
                  <p className="font-mono text-base">{atZero[method.key].toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-app-muted">SSS at ρ=0.9</p>
                  <p className="font-mono text-base">{atNine[method.key].toFixed(3)}</p>
                </div>
              </div>

              <p className="mt-4 text-sm text-app-muted">{method.insight}</p>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

export default MethodCards;
