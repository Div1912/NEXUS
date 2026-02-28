import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const bootLines = [
  'NEXUS OS v2.1 INITIALIZING...',
  'EDGE NODES: 6/6 ONLINE',
  'CAUSAL ENGINE: LOADED',
  'SENSOR ARRAY: CALIBRATED',
  'ACCESS GRANTED',
];

const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= bootLines.length) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return prev;
        }
        return prev + 1;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-background flex items-center justify-center"
      >
        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsla(186,100%,50%,0.015) 2px, hsla(186,100%,50%,0.015) 4px)',
        }} />

        <div className="font-mono text-sm space-y-1.5 max-w-md">
          {bootLines.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={`flex items-center gap-3 ${
                i === bootLines.length - 1
                  ? 'text-nexus-green text-base font-bold'
                  : 'text-accent/70'
              }`}
            >
              <span className="text-accent/30 text-[10px] tabular-nums w-8">[{String(i).padStart(2, '0')}]</span>
              {line}
              {i === bootLines.length - 1 && (
                <span className="w-1.5 h-1.5 rounded-full bg-nexus-green ml-2" style={{ boxShadow: '0 0 8px hsl(155,100%,43%)' }} />
              )}
            </motion.div>
          ))}
          {visibleLines < bootLines.length && (
            <span className="inline-block w-2 h-4 bg-accent/60 animate-pulse" />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BootSequence;
