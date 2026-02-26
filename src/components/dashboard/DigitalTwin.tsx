import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getBuildingNodes } from '@/services/mockData';

const statusColors: Record<string, string> = {
  healthy: '#00E5FF',
  warning: '#F5C518',
  alert: '#FF5C5C',
};

const DigitalTwin: React.FC<{ presentationMode?: boolean }> = ({ presentationMode }) => {
  const buildings = getBuildingNodes();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className={`nexus-card p-4 relative overflow-hidden ${presentationMode ? 'p-6' : ''}`}>
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Digital Twin — Campus Map</div>
      <svg viewBox="0 0 550 280" className="w-full">
        {/* Grid */}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`g${i}`} x1={0} y1={i * 30} x2={550} y2={i * 30} stroke="rgba(0,229,255,0.03)" strokeWidth="0.5" />
        ))}

        {/* Buildings */}
        {buildings.map((b) => {
          const col = statusColors[b.status];
          const isHovered = hovered === b.id;
          return (
            <g key={b.id} onMouseEnter={() => setHovered(b.id)} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
              <rect x={b.x - 30} y={b.y - 20} width={60} height={40} rx="6" fill={`${col}08`} stroke={col} strokeWidth={isHovered ? 1.5 : 0.8} opacity={isHovered ? 1 : 0.6} />
              <circle cx={b.x} cy={b.y} r={isHovered ? 5 : 3} fill={col} opacity={isHovered ? 1 : 0.7}>
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x={b.x} y={b.y - 26} textAnchor="middle" fill="rgba(240,244,255,0.7)" fontSize="9" fontFamily="Inter">{b.name}</text>

              {isHovered && (
                <foreignObject x={b.x + 35} y={b.y - 40} width="130" height="70">
                  <div className="bg-card border border-border rounded-lg p-2 text-[10px] text-foreground shadow-lg">
                    <div className="font-semibold mb-1">{b.name}</div>
                    {b.metrics.map(m => (
                      <div key={m.label} className="flex justify-between text-muted-foreground">
                        <span>{m.label}</span>
                        <span className="font-mono text-foreground">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-nexus-cyan" /> Healthy</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-nexus-yellow" /> Warning</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-nexus-alert" /> Alert</span>
      </div>
    </div>
  );
};

export default DigitalTwin;
