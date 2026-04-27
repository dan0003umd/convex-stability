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

      <motion.div variants={item} className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <a
          href="https://huggingface.co/spaces/Dhanraj003/sss-explorer"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#01696f] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#0c4e54] hover:shadow-lg"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Try Live Demo
        </a>
        <span className="text-xs text-app-muted">Hosted on Hugging Face Spaces · Free</span>
      </motion.div>

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
          marginTop: "3rem",
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