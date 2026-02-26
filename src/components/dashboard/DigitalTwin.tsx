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
    <div className={`glass-panel p-4 relative scan-line ${presentationMode ? 'p-6' : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-mono">Digital Twin — Campus Topology</span>
      </div>
      <svg viewBox="0 0 600 320" className="w-full">
        {/* Blueprint grid */}
        {Array.from({ length: 20 }, (_, i) => (
          <React.Fragment key={`grid-${i}`}>
            <line x1={i * 30} y1={0} x2={i * 30} y2={320} stroke="hsla(186, 100%, 50%, 0.03)" strokeWidth="0.5" />
            <line x1={0} y1={i * 16} x2={600} y2={i * 16} stroke="hsla(186, 100%, 50%, 0.03)" strokeWidth="0.5" />
          </React.Fragment>
        ))}

        {/* Connection lines between buildings */}
        {buildings.map((b, i) => 
          buildings.slice(i + 1).map(b2 => {
            const dist = Math.sqrt((b.x - b2.x) ** 2 + (b.y - b2.y) ** 2);
            if (dist < 250) return (
              <line key={`${b.id}-${b2.id}`} x1={b.x} y1={b.y} x2={b2.x} y2={b2.y}
                stroke="hsla(186, 100%, 50%, 0.06)" strokeWidth="0.5" strokeDasharray="4 6" />
            );
            return null;
          })
        )}

        {/* Building nodes */}
        {buildings.map((b) => {
          const col = statusColors[b.status];
          const isHovered = hovered === b.id;
          return (
            <g key={b.id} onMouseEnter={() => setHovered(b.id)} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
              {/* Outer pulsing ring */}
              <circle cx={b.x} cy={b.y} r="24" fill="none" stroke={col} strokeWidth="0.5" opacity="0.2">
                <animate attributeName="r" values="20;28;20" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.05;0.2" dur="3s" repeatCount="indefinite" />
              </circle>
              {/* Second ring */}
              <circle cx={b.x} cy={b.y} r="16" fill="none" stroke={col} strokeWidth="0.3" opacity="0.15">
                <animate attributeName="r" values="14;18;14" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Core node */}
              <circle cx={b.x} cy={b.y} r={isHovered ? 6 : 4} fill={col} opacity={isHovered ? 0.9 : 0.7}
                style={{ filter: `drop-shadow(0 0 8px ${col})` }} />
              {/* Label */}
              <text x={b.x} y={b.y - 30} textAnchor="middle" fill="hsla(224, 100%, 97%, 0.5)" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="0.05em">{b.name.toUpperCase()}</text>

              {/* Hover tooltip */}
              {isHovered && (
                <foreignObject x={b.x + 25} y={b.y - 45} width="140" height="80">
                  <div className="glass-panel-strong p-2 text-[9px]">
                    <div className="font-mono text-accent mb-1 uppercase tracking-wider">{b.name}</div>
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

        {/* Coordinate labels */}
        <text x="10" y="310" fill="hsla(186, 100%, 50%, 0.15)" fontSize="8" fontFamily="JetBrains Mono">52.2053°N</text>
        <text x="520" y="310" fill="hsla(186, 100%, 50%, 0.15)" fontSize="8" fontFamily="JetBrains Mono">0.1218°E</text>
      </svg>

      {/* Legend */}
      <div className="flex gap-6 mt-2 text-[9px] text-muted-foreground font-mono uppercase tracking-wider">
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-nexus-cyan" style={{ boxShadow: '0 0 6px hsl(186, 100%, 50%)' }} /> Online</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-nexus-yellow" style={{ boxShadow: '0 0 6px hsl(47, 91%, 53%)' }} /> Warning</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-nexus-alert" style={{ boxShadow: '0 0 6px hsl(0, 100%, 68%)' }} /> Alert</span>
      </div>
    </div>
  );
};

export default DigitalTwin;
