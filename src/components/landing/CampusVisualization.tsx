import React from 'react';
import { motion } from 'framer-motion';

const buildings = [
  { id: 'main', label: 'Main Hall', x: 80, y: 60, w: 60, h: 40, status: 'cyan' },
  { id: 'sci', label: 'Science', x: 180, y: 40, w: 50, h: 50, status: 'cyan' },
  { id: 'cafe', label: 'Cafeteria', x: 130, y: 130, w: 55, h: 35, status: 'yellow' },
  { id: 'lib', label: 'Library', x: 50, y: 140, w: 45, h: 45, status: 'cyan' },
  { id: 'sport', label: 'Sports', x: 220, y: 120, w: 50, h: 40, status: 'cyan' },
];

const statusColors: Record<string, string> = {
  cyan: '#00E5FF',
  yellow: '#F5C518',
  red: '#FF5C5C',
};

const CampusVisualization: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.5 }}
    className="relative w-full max-w-[340px] aspect-square"
  >
    <svg viewBox="0 0 300 220" className="w-full h-full">
      {/* Grid lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 30 + 10} x2="300" y2={i * 30 + 10} stroke="rgba(0,229,255,0.04)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <line key={`v${i}`} x1={i * 35 + 10} y1="0" x2={i * 35 + 10} y2="220" stroke="rgba(0,229,255,0.04)" strokeWidth="0.5" />
      ))}

      {/* Connection lines */}
      {buildings.map((b, i) =>
        buildings.slice(i + 1).map(b2 => (
          <line
            key={`${b.id}-${b2.id}`}
            x1={b.x + b.w / 2} y1={b.y + b.h / 2}
            x2={b2.x + b2.w / 2} y2={b2.y + b2.h / 2}
            stroke="rgba(0,229,255,0.08)"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        ))
      )}

      {/* Buildings */}
      {buildings.map((b, i) => (
        <g key={b.id}>
          <motion.rect
            x={b.x} y={b.y} width={b.w} height={b.h}
            rx="4"
            fill={`${statusColors[b.status]}10`}
            stroke={statusColors[b.status]}
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
          />
          {/* Glow dot */}
          <motion.circle
            cx={b.x + b.w / 2} cy={b.y + b.h / 2} r="3"
            fill={statusColors[b.status]}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
          <text
            x={b.x + b.w / 2} y={b.y - 6}
            textAnchor="middle"
            fill="rgba(240,244,255,0.6)"
            fontSize="7"
            fontFamily="Inter"
          >
            {b.label}
          </text>
        </g>
      ))}
    </svg>
  </motion.div>
);

export default CampusVisualization;
