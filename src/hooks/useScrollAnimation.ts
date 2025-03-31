import { useEffect } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

export const useScrollAnimation = (startOffset = 0, endOffset = 100) => {
  const { scrollYProgress } = useScroll({
    offset: [startOffset, endOffset],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  return {
    opacity,
    y,
    scale,
    scrollYProgress,
  };
}; 