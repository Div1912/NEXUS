import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import type { CausalEvent } from '@/types/nexus';

const severityColors: Record<string, string> = {
  info: 'bg-nexus-cyan/20 text-nexus-cyan border-nexus-cyan/30',
  warning: 'bg-nexus-yellow/20 text-nexus-yellow border-nexus-yellow/30',
  critical: 'bg-nexus-alert/20 text-nexus-alert border-nexus-alert/30',
};

const CausalFeed: React.FC<{ events: CausalEvent[] }> = ({ events }) => (
  <div className="nexus-card p-4 flex flex-col h-full">
    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Causal Event Feed</div>
    <div className="flex-1 overflow-y-auto space-y-2 max-h-[320px]">
      <AnimatePresence initial={false}>
        {events.map((ev, i) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-3 rounded-lg bg-secondary/50 border border-border"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-foreground">{ev.title}</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {ev.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground mb-2">
              <span className="text-nexus-cyan">Cause:</span> {ev.cause}
              <span className="mx-1">→</span>
              <span className="text-nexus-yellow">Effect:</span> {ev.effect}
            </div>
            <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${severityColors[ev.severity]}`}>
              {ev.action}
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </div>
);

export default CausalFeed;
