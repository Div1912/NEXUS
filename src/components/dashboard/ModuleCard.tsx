import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ModuleData } from '@/types/nexus';

const statusDot: Record<string, string> = {
  online: 'bg-nexus-green',
  warning: 'bg-nexus-yellow',
  alert: 'bg-nexus-alert',
};

const Sparkline: React.FC<{ data: number[] }> = ({ data }) => {
  const w = 64, h = 20;
  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min)) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="opacity-40"><polyline points={pts} fill="none" stroke="hsl(186,100%,50%)" strokeWidth="1" /></svg>
  );
};

const ModuleCard: React.FC<{ module: ModuleData; index: number }> = ({ module, index }) => {
  const navigate = useNavigate();
  const isAlert = module.alertCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      onClick={() => navigate(`/dashboard/${module.id}`)}
      className={`bg-background p-5 cursor-pointer group hover:bg-secondary/20 transition-all border-l-2 ${isAlert ? 'border-l-nexus-alert' : 'border-l-accent/10'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.15em]">NEXUS {module.name}</span>
        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[module.status]} ${module.status !== 'online' ? 'animate-pulse-glow' : ''}`} />
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-mono text-2xl font-bold text-foreground tabular-nums">{module.primaryMetric.value}</span>
        <span className="font-mono text-[10px] text-muted-foreground">{module.primaryMetric.unit}</span>
      </div>
      <Sparkline data={module.sparkline} />
      <div className="mt-3 space-y-1">
        {module.subMetrics.map(m => (
          <div key={m.label} className="flex justify-between text-[10px]">
            <span className="text-muted-foreground">{m.label}</span>
            <span className="font-mono text-foreground tabular-nums">{m.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 font-mono text-[9px] text-accent/40 group-hover:text-accent transition-colors uppercase tracking-wider">
        View Details →
      </div>
    </motion.div>
  );
};

export default ModuleCard;
