import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Footer() {
  const [showPaperMessage, setShowPaperMessage] = useState(false);

  useEffect(() => {
    if (!showPaperMessage) {
      return undefined;
    }

    const timerId = setTimeout(() => {
      setShowPaperMessage(false);
    }, 3000);

    return () => clearTimeout(timerId);
  }, [showPaperMessage]);

  const handlePaperClick = (event) => {
    event.preventDefault();
    setShowPaperMessage(true);
  };

  return (
    <motion.footer
      className="border-t border-app-border py-8 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-sm text-app-muted">Nandurkar & Chavan — UMD MSML604 Research Project 2026</p>
      <div className="mt-3 flex items-center justify-center gap-5 text-sm">
        <a
          href="https://github.com/dan0003umd/convex-stability"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          GitHub
        </a>
        <a href="#" className="footer-link" onClick={handlePaperClick}>
          Paper PDF
        </a>
        <a href="#" className="footer-link">
          Hugging Face Demo
        </a>
      </div>
      <p
        style={{
          marginTop: "10px",
          opacity: showPaperMessage ? 1 : 0,
          transition: "opacity 300ms ease",
          fontSize: "13px",
          color: "var(--text-muted, var(--color-muted))",
          fontFamily: "Lora",
          fontStyle: "italic",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        📄 Paper in progress — we appreciate your patience!
      </p>
    </motion.footer>
  );
}

export default Footer;

