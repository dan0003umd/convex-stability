import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: "easeOut" } },
};

function HeroHeader() {
  return (
    <motion.section
      className="flex min-h-[70vh] flex-col items-center justify-center border-b border-app-border pb-14 text-center"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={item} className="font-display text-4xl font-semibold leading-tight md:text-6xl">
        Sparse Feature Selection via Convex Optimization
      </motion.h1>

      <motion.p variants={item} className="mt-4 max-w-3xl text-base text-app-muted md:text-xl">
        An Empirical Study of Sparsity Stability under Feature Correlation
      </motion.p>

      <motion.p variants={item} className="mt-5 text-sm font-medium text-app-muted md:text-base">
        Dhanraj Nandurkar & Soumitra Chavan — UMD MSML604, 2026
      </motion.p>

      <motion.div
        variants={item}
        animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="mt-10 font-mono text-xs uppercase tracking-[0.25em] text-app-muted"
      >
        scroll to explore â†“
      </motion.div>
    </motion.section>
  );
}

export default HeroHeader;
