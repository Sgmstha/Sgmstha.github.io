import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["Design", "Create", "Inspire"];

  useEffect(() => {
    let startTime: number;
    const duration = 2700; // 2.7s

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(Math.floor((progress / duration) * 100), 100);
      setCount(percentage);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(onComplete, 400);
      }
    };

    requestAnimationFrame(animate);

    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 900);

    return () => clearInterval(wordInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0C0C0C] flex flex-col justify-between p-6 md:p-10">
      {/* Top Left */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-xs text-[#89AACC] uppercase tracking-[0.3em]"
      >
        Portfolio
      </motion.div>

      {/* Center Words */}
      <div className="flex-grow flex items-center justify-center">
        <div className="relative h-20 overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={wordIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-4xl md:text-6xl lg:text-7xl italic text-[#D7E2EA]/80 font-serif"
            >
              {words[wordIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-4">
        <div className="text-right text-6xl md:text-8xl lg:text-9xl text-[#D7E2EA] tabular-nums font-serif">
          {String(count).padStart(3, "0")}
        </div>
        <div className="w-full h-[3px] bg-white/10 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#89AACC] to-[#4E85BF] shadow-[0_0_8px_rgba(137,170,204,0.35)] origin-left"
            style={{ transform: `scaleX(${count / 100})` }}
          />
        </div>
      </div>
    </div>
  );
};
