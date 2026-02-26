import React from 'react';
import { motion } from 'framer-motion';
import type { KPIData } from '@/types/nexus';

const colorMap: Record<string, string> = {
  'nexus-cyan': 'hsl(186, 100%, 50%)',
  'nexus-green': 'hsl(155, 100%, 43%)',
  'nexus-yellow': 'hsl(47, 91%, 53%)',
  'nexus-red': 'hsl(357, 85%, 52%)',
};

const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const w = 80, h = 24;
  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min)) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="overflow-visible opacity-60">
      <polyline points={points} fill="none" stroke={colorMap[color] || color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/** Telemetry-style KPI — no card box, floats on background */
const KPICard: React.FC<{ data: KPIData; index: number; presentationMode?: boolean }> = ({ data, index, presentationMode }) => {
  const accentColor = colorMap[data.color] || '#00E5FF';
  const isPositive = data.trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="flex flex-col gap-1 relative"
    >
      <div className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-mono">{data.label}</div>
      <div className="flex items-baseline gap-2">
        <span className={`font-mono font-bold text-foreground tabular-nums ${presentationMode ? 'text-5xl' : 'text-3xl'}`}>
          {typeof data.value === 'number' && data.value % 1 !== 0 ? data.value.toFixed(1) : data.value}
        </span>
        {data.unit && <span className="font-mono text-xs text-muted-foreground">{data.unit}</span>}
      </div>
      <div className="flex items-center gap-3 mt-1">
        <Sparkline data={data.sparkline} color={data.color} />
        <span className={`font-mono text-[10px] ${isPositive ? (data.id === 'alerts' || data.id === 'latency' ? 'text-nexus-alert' : 'text-nexus-green') : 'text-nexus-green'}`}>
          {isPositive ? '↑' : '↓'}{Math.abs(data.trend)}%
        </span>
        <span className="font-mono text-[9px] text-muted-foreground">
          AI:{data.confidence}%
        </span>
      </div>
      {/* Accent dot */}
      <div className="absolute top-0 -left-3 w-1 h-1 rounded-full" style={{ background: accentColor, boxShadow: `0 0 6px ${accentColor}` }} />
    </motion.div>
  );
};

export default KPICard;
