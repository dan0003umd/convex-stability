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

      <p
        style={{
          letterSpacing: "0.15em",
          fontSize: "12px",
          color: "var(--text-muted)",
          fontFamily: "Inter",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
        }}
      >
        SCROLL TO EXPLORE
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
      </p>
    </motion.section>
  );
}

export default HeroHeader;
