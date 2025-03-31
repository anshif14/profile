import { useScroll, useTransform } from 'framer-motion';

export const useScrollAnimation = (startOffset: number, endOffset: number) => {
  const { scrollY } = useScroll();
  
  const opacity = useTransform(scrollY, [startOffset, endOffset], [1, 0]);
  const yPos = useTransform(scrollY, [startOffset, endOffset], [0, 50]);
  
  return { opacity, y: yPos };
}; 