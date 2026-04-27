import { motion } from "framer-motion";

function Footer() {
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
        <a href="#" className="footer-link">
          GitHub
        </a>
        <a href="#" className="footer-link">
          Paper PDF
        </a>
        <a href="#" className="footer-link">
          Hugging Face Demo
        </a>
      </div>
    </motion.footer>
  );
}

export default Footer;
