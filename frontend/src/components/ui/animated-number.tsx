import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export function AnimatedNumber({ value }: { value: string | number }) {
  const strValue = String(value);
  const match = strValue.match(/^([^0-9]*?)(\d+(?:\.\d+)?)(.*)$/);
  
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  
  const display = useTransform(spring, (current) => {
    if (!match) return strValue;
    const prefix = match[1];
    
    const numStr = match[2];
    const decimalIndex = numStr.indexOf('.');
    const precision = decimalIndex !== -1 ? numStr.length - decimalIndex - 1 : 0;
    
    const suffix = match[3];
    return prefix + current.toFixed(precision) + suffix;
  });

  useEffect(() => {
    if (match) {
      spring.set(parseFloat(match[2]));
    }
  }, [value, match, spring]);

  if (!match) return <span>{value}</span>;

  return <motion.span>{display}</motion.span>;
}
