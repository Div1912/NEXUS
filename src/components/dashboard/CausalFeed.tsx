import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CausalEvent } from '@/types/nexus';

const severityAccent: Record<string, string> = {
  info: 'hsla(186, 100%, 50%, 0.4)',
  warning: 'hsla(47, 91%, 53%, 0.4)',
  critical: 'hsla(0, 100%, 68%, 0.5)',
};

const CausalFeed: React.FC<{ events: CausalEvent[] }> = ({ events }) => (
  <div className="glass-panel p-4 flex flex-col h-full">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
      <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-mono">Causal Event Feed</span>
    </div>
    <div className="flex-1 overflow-y-auto space-y-1 max-h-[320px]">
      <AnimatePresence initial={false}>
        {events.map((ev) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-3 bg-secondary/20 border-l-2 hover:bg-secondary/30 transition-colors"
            style={{ borderLeftColor: severityAccent[ev.severity] }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-foreground">{ev.title}</span>
              <span className="font-mono text-[9px] text-muted-foreground tabular-nums">
                {ev.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              <span className="text-accent/70">CAUSE:</span> {ev.cause}
              <span className="mx-1 text-accent/30">→</span>
              <span className="text-nexus-yellow/70">EFFECT:</span> {ev.effect}
            </div>
            <div className="mt-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 bg-accent/5 text-accent/60 border border-accent/10">
                {ev.action}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </div>
);

export default CausalFeed;
