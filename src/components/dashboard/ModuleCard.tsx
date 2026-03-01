import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ModuleData } from '@/types/nexus';

const statusDot: Record<string, string> = {
  online: 'bg-nexus-green',
  warning: 'bg-nexus-yellow',
  alert: 'bg-nexus-alert',
};

const moduleAccent: Record<string, string> = {
  flow: 'hsl(186, 100%, 50%)',
  eco: 'hsl(155, 100%, 43%)',
  space: 'hsl(47, 91%, 53%)',
  maintain: 'hsl(186, 100%, 70%)',
  guard: 'hsl(357, 85%, 52%)',
  federate: 'hsl(270, 80%, 70%)',
};

const AreaSparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const w = 100, h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / (max - min)) * (h - 4) - 2,
  }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L${w},${h} L0,${h} Z`;
  const uid = `ms-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${uid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${color}88)` }} />
    </svg>
  );
};

const ModuleCard: React.FC<{ module: ModuleData; index: number }> = ({ module, index }) => {
  const navigate = useNavigate();
  const accent = moduleAccent[module.id] || 'hsl(186, 100%, 50%)';
  const isAlert = module.alertCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      onClick={() => navigate(`/dashboard/${module.id}`)}
      className="glass-panel card-3d p-5 cursor-pointer group relative overflow-hidden"
      style={{
        borderColor: isAlert ? 'hsla(357,85%,52%,0.3)' : 'hsla(186,100%,50%,0.08)',
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${accent}00, ${accent}, ${accent}00)`,
          boxShadow: `0 2px 8px ${accent}66`,
        }}
      />
      {/* Subtle gradient glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, ${accent}08, transparent 70%)` }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 z-10 relative">
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
          NEXUS {module.name}
        </span>
        <div className="flex items-center gap-2">
          {isAlert && (
            <span className="font-mono text-[8px] text-nexus-alert uppercase tracking-wider animate-pulse-glow">
              {module.alertCount} ALERT
            </span>
          )}
          <span
            className={`w-2 h-2 rounded-full ${statusDot[module.status]} ${module.status !== 'online' ? 'animate-pulse-glow' : ''}`}
            style={{ boxShadow: module.status === 'online' ? `0 0 6px ${accent}` : undefined }}
          />
        </div>
      </div>

      {/* Primary metric */}
      <div className="flex items-baseline gap-2 mb-3 z-10 relative">
        <span
          className="font-mono text-2xl font-bold text-foreground tabular-nums"
          style={{ textShadow: `0 0 16px ${accent}44` }}
        >
          {module.primaryMetric.value}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">{module.primaryMetric.unit}</span>
      </div>

      {/* Sparkline */}
      <div className="z-10 relative mb-3">
        <AreaSparkline data={module.sparkline} color={accent} />
      </div>

      {/* Sub metrics */}
      <div className="space-y-1 z-10 relative">
        {module.subMetrics.map(m => (
          <div key={m.label} className="flex justify-between text-[10px]">
            <span className="text-muted-foreground">{m.label}</span>
            <span className="font-mono text-foreground tabular-nums">{m.value}</span>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div
        className="mt-4 font-mono text-[9px] text-muted-foreground group-hover:text-accent transition-colors uppercase tracking-widest z-10 relative flex items-center gap-1"
        style={{ textShadow: undefined }}
      >
        <span>View Details</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </motion.div>
  );
};

export default ModuleCard;
