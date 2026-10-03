import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShow(window.scrollY > 480);
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          className="back-to-top-pill"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 25, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.85 }}
          whileHover={{ y: -3, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          aria-label="Scroll back to top of page"
        >
          <span className="arrow-icon">↑</span>
          <span className="label">TOP</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
