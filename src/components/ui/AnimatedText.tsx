import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

const AnimatedCharacter = ({ char, index, total, progress }: { char: string; index: number; total: number; progress: MotionValue<number> }) => {
  const opacity = useTransform(progress, [index / total, (index + 1) / total], [0.2, 1]);
  return <span className="relative"><span className="invisible">{char === ' ' ? '\u00A0' : char}</span><motion.span className="absolute left-0 top-0" style={{ opacity }}>{char === ' ' ? '\u00A0' : char}</motion.span></span>;
};

export const AnimatedText = ({ text, className = "" }: AnimatedTextProps) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  });

  const characters = text.split('');

  return (
    <p ref={containerRef} className={`relative flex flex-wrap justify-center ${className}`}>
      {characters.map((char, index) => <AnimatedCharacter key={index} char={char} index={index} total={characters.length} progress={scrollYProgress} />)}
    </p>
  );
};
