import React, { useMemo } from 'react';
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
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={points} fill="none" stroke={colorMap[color] || color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
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
      className={`nexus-card p-5 flex flex-col gap-3 ${presentationMode ? 'p-8' : ''}`}
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{data.label}</div>
      <div className="flex items-end gap-3">
        <span className={`font-mono font-bold text-foreground ${presentationMode ? 'text-4xl' : 'text-3xl'}`}>
          {typeof data.value === 'number' && data.value % 1 !== 0 ? data.value.toFixed(1) : data.value}
        </span>
        {data.unit && <span className="text-sm text-muted-foreground mb-1">{data.unit}</span>}
      </div>
      <Sparkline data={data.sparkline} color={data.color} />
      <div className="flex items-center justify-between text-xs">
        <span className={isPositive ? (data.id === 'alerts' || data.id === 'latency' ? 'text-nexus-alert' : 'text-nexus-green') : 'text-nexus-green'}>
          {isPositive ? '↑' : '↓'} {Math.abs(data.trend)}%
        </span>
        <span className="text-muted-foreground">AI {data.confidence}%</span>
      </div>
    </motion.div>
  );
};

export default KPICard;
