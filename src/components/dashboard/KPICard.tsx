import React from 'react';
import { motion } from 'framer-motion';
import type { KPIData } from '@/types/nexus';

const colorMap: Record<string, string> = {
  'nexus-cyan': 'hsl(186, 100%, 50%)',
  'nexus-green': 'hsl(155, 100%, 43%)',
  'nexus-yellow': 'hsl(47, 91%, 53%)',
  'nexus-red': 'hsl(357, 85%, 52%)',
};

const colorGlow: Record<string, string> = {
  'nexus-cyan': 'hsla(186, 100%, 50%, 0.15)',
  'nexus-green': 'hsla(155, 100%, 43%, 0.15)',
  'nexus-yellow': 'hsla(47, 91%, 53%, 0.15)',
  'nexus-red': 'hsla(357, 85%, 52%, 0.18)',
};

const AreaSparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const w = 120, h = 36;
  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / (max - min)) * (h - 4) - 2,
  }));
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  // Smooth area path
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;
  const col = colorMap[color] || color;
  const glow = colorGlow[color] || 'hsla(186,100%,50%,0.1)';
  const id = `sg-${color}-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col} stopOpacity="0.25" />
          <stop offset="100%" stopColor={col} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${id})`} />
      <path d={linePath} fill="none" stroke={col} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${glow})` }} />
      {/* Live dot at end */}
      <circle
        cx={pts[pts.length - 1].x}
        cy={pts[pts.length - 1].y}
        r="2.5"
        fill={col}
        style={{ filter: `drop-shadow(0 0 4px ${col})` }}
      >
        <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

// Mini arc confidence gauge
const ConfidenceArc: React.FC<{ value: number; color: string }> = ({ value, color }) => {
  const col = colorMap[color] || color;
  const r = 10;
  const circumference = Math.PI * r; // half circle arc
  const dashLen = (value / 100) * circumference;
  return (
    <svg width="26" height="14" viewBox="0 0 26 14" className="overflow-visible">
      {/* Track */}
      <path d="M3,13 A10,10 0 0,1 23,13" fill="none" stroke="hsla(186,100%,50%,0.08)" strokeWidth="2" strokeLinecap="round" />
      {/* Fill */}
      <path
        d="M3,13 A10,10 0 0,1 23,13"
        fill="none"
        stroke={col}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={`${dashLen} ${circumference}`}
        style={{ filter: `drop-shadow(0 0 3px ${col})` }}
      />
    </svg>
  );
};

const KPICard: React.FC<{ data: KPIData; index: number; presentationMode?: boolean }> = ({ data, index, presentationMode }) => {
  const accentColor = colorMap[data.color] || '#00E5FF';
  const glowColor = colorGlow[data.color] || 'hsla(186,100%,50%,0.1)';
  const isPositive = data.trend >= 0;
  const isBad = isPositive && (data.id === 'alerts' || data.id === 'latency');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.09, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="flex-1 glass-panel card-3d relative overflow-hidden p-4 group"
      style={{
        borderColor: `hsla(186, 100%, 50%, 0.1)`,
        boxShadow: `0 4px 24px ${glowColor}`,
      }}
    >
      {/* Top accent stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, opacity: 0.6 }}
      />
      {/* Accent dot */}
      <div
        className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full"
        style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
      />

      <div className="text-[9px] text-muted-foreground uppercase tracking-[0.18em] font-mono mb-2">{data.label}</div>

      <div className="flex items-baseline gap-1.5 mb-3">
        <motion.span
          key={data.value}
          initial={{ opacity: 0.5, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`font-mono font-bold text-foreground tabular-nums ${presentationMode ? 'text-5xl' : 'text-3xl'}`}
          style={{ textShadow: `0 0 20px ${accentColor}33` }}
        >
          {typeof data.value === 'number' && data.value % 1 !== 0 ? data.value.toFixed(1) : data.value}
        </motion.span>
        {data.unit && <span className="font-mono text-xs text-muted-foreground">{data.unit}</span>}
      </div>

      <AreaSparkline data={data.sparkline} color={data.color} />

      <div className="flex items-center justify-between mt-2">
        <span className={`font-mono text-[10px] ${isBad ? 'text-nexus-alert' : isPositive ? 'text-nexus-green' : 'text-nexus-green'}`}>
          {isPositive ? '↑' : '↓'}{Math.abs(data.trend)}%
        </span>
        <div className="flex flex-col items-center gap-0.5">
          <ConfidenceArc value={data.confidence} color={data.color} />
          <span className="font-mono text-[8px] text-muted-foreground">{data.confidence}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default KPICard;
