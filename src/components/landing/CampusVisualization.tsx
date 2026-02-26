import React from 'react';
import { motion } from 'framer-motion';

const buildings = [
  { id: 'main', label: 'Main Hall', x: 80, y: 55, w: 70, h: 45, status: 'cyan', data: 'Occ 72%' },
  { id: 'sci', label: 'Science', x: 200, y: 35, w: 60, h: 55, status: 'cyan', data: 'Lab 3/5' },
  { id: 'cafe', label: 'Cafeteria', x: 140, y: 130, w: 65, h: 40, status: 'yellow', data: 'Queue 12m' },
  { id: 'lib', label: 'Library', x: 40, y: 140, w: 55, h: 50, status: 'cyan', data: 'Seats 156' },
  { id: 'sport', label: 'Sports', x: 240, y: 120, w: 55, h: 45, status: 'cyan', data: 'Courts 2/4' },
  { id: 'admin', label: 'Admin', x: 160, y: 200, w: 50, h: 35, status: 'cyan', data: 'Secure' },
  { id: 'gate', label: 'Gate B', x: 30, y: 220, w: 40, h: 30, status: 'red', data: '+40%' },
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
    className="relative w-full max-w-[400px] aspect-square"
  >
    <svg viewBox="0 0 320 270" className="w-full h-full">
      {/* Grid lines */}
      {Array.from({ length: 10 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 28 + 10} x2="320" y2={i * 28 + 10} stroke="rgba(0,229,255,0.06)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <line key={`v${i}`} x1={i * 28 + 10} y1="0" x2={i * 28 + 10} y2="270" stroke="rgba(0,229,255,0.06)" strokeWidth="0.5" />
      ))}

      {/* Connection lines */}
      {buildings.map((b, i) =>
        buildings.slice(i + 1).map(b2 => (
          <motion.line
            key={`${b.id}-${b2.id}`}
            x1={b.x + b.w / 2} y1={b.y + b.h / 2}
            x2={b2.x + b2.w / 2} y2={b2.y + b2.h / 2}
            stroke="rgba(0,229,255,0.12)"
            strokeWidth="0.6"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.8 + i * 0.1 }}
          />
        ))
      )}

      {/* Buildings */}
      {buildings.map((b, i) => (
        <g key={b.id}>
          {/* Outer glow */}
          <motion.rect
            x={b.x - 4} y={b.y - 4} width={b.w + 8} height={b.h + 8}
            rx="8"
            fill="transparent"
            stroke={statusColors[b.status]}
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
          />
          <motion.rect
            x={b.x} y={b.y} width={b.w} height={b.h}
            rx="6"
            fill={`${statusColors[b.status]}15`}
            stroke={statusColors[b.status]}
            strokeWidth="1.2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
          />
          {/* Glow dot */}
          <motion.circle
            cx={b.x + b.w / 2} cy={b.y + b.h / 2} r="4"
            fill={statusColors[b.status]}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5], r: [3, 5, 3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
          {/* Label */}
          <text
            x={b.x + b.w / 2} y={b.y - 8}
            textAnchor="middle"
            fill="rgba(240,244,255,0.75)"
            fontSize="8"
            fontFamily="Space Grotesk"
            fontWeight="600"
          >
            {b.label}
          </text>
          {/* Data label inside */}
          <text
            x={b.x + b.w / 2} y={b.y + b.h / 2 + 14}
            textAnchor="middle"
            fill={statusColors[b.status]}
            fontSize="7"
            fontFamily="JetBrains Mono"
            opacity="0.8"
          >
            {b.data}
          </text>
        </g>
      ))}

      {/* Animated data pulse traveling along an edge */}
      <motion.circle
        r="2"
        fill="#00E5FF"
        initial={{ opacity: 0 }}
        animate={{
          cx: [buildings[0].x + buildings[0].w/2, buildings[2].x + buildings[2].w/2],
          cy: [buildings[0].y + buildings[0].h/2, buildings[2].y + buildings[2].h/2],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <motion.circle
        r="2"
        fill="#F5C518"
        initial={{ opacity: 0 }}
        animate={{
          cx: [buildings[1].x + buildings[1].w/2, buildings[4].x + buildings[4].w/2],
          cy: [buildings[1].y + buildings[1].h/2, buildings[4].y + buildings[4].h/2],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }}
      />
    </svg>
  </motion.div>
);

export default CampusVisualization;
