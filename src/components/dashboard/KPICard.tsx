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
  const w = 100, h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min)) * h}`).join(' ');
  const fillPoints = `0,${h} ${points} ${w},${h}`;
  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorMap[color] || color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={colorMap[color] || color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill={`url(#spark-${color})`} />
      <polyline points={points} fill="none" stroke={colorMap[color] || color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  );
};

const KPICard: React.FC<{ data: KPIData; index: number; presentationMode?: boolean }> = ({ data, index, presentationMode }) => {
  const borderColor = colorMap[data.color] || '#00E5FF';
  const isPositive = data.trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`nexus-card p-5 flex flex-col gap-3 relative overflow-hidden ${presentationMode ? 'p-8' : ''}`}
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ background: `radial-gradient(circle at top right, ${borderColor}, transparent 70%)` }} />
      <div className="relative">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">{data.label}</div>
        <div className="flex items-end gap-3 mt-2">
          <span className={`font-mono font-bold text-foreground ${presentationMode ? 'text-4xl' : 'text-3xl'}`}>
            {typeof data.value === 'number' && data.value % 1 !== 0 ? data.value.toFixed(1) : data.value}
          </span>
          {data.unit && <span className="text-sm text-muted-foreground mb-1">{data.unit}</span>}
        </div>
        <div className="mt-3">
          <Sparkline data={data.sparkline} color={data.color} />
        </div>
        <div className="flex items-center justify-between text-xs mt-2">
          <span className={isPositive ? (data.id === 'alerts' || data.id === 'latency' ? 'text-nexus-alert' : 'text-nexus-green') : 'text-nexus-green'}>
            {isPositive ? '↑' : '↓'} {Math.abs(data.trend)}%
          </span>
          <span className="text-muted-foreground flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-accent" />
            AI {data.confidence}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default KPICard;
