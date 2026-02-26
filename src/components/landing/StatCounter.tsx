import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface StatCounterProps {
  value: string;
  label: string;
  delay?: number;
}

const StatCounter: React.FC<StatCounterProps> = ({ value, label, delay = 0 }) => {
  const [displayed, setDisplayed] = useState('0');
  const numericPart = parseFloat(value.replace(/[^0-9.]/g, ''));
  const prefix = value.match(/^[<>]?\s*/)?.[0] || '';
  const suffix = value.replace(/^[<>]?\s*[\d.]+\s*/, '');

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const duration = 1200;
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        start = numericPart * eased;
        setDisplayed(Number.isInteger(numericPart) ? Math.round(start).toString() : start.toFixed(1));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timer);
  }, [numericPart, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000 + 0.3, duration: 0.5 }}
      className="text-center"
    >
      <div className="font-mono text-2xl font-bold text-foreground">
        {prefix}{displayed}{suffix}
      </div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
    </motion.div>
  );
};

export default StatCounter;
