import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getBuildingNodes } from '@/services/mockData';

const statusColors: Record<string, string> = {
  healthy: 'hsl(186, 100%, 50%)',
  warning: 'hsl(47, 91%, 53%)',
  alert: 'hsl(357, 85%, 52%)',
};

// Build a hexagon SVG path centered at (cx, cy) with radius r
const hexPath = (cx: number, cy: number, r: number) => {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  });
  return `M${pts[0]} ${pts.slice(1).map(p => `L${p}`).join(' ')} Z`;
};

const DigitalTwin: React.FC<{ presentationMode?: boolean }> = ({ presentationMode }) => {
  const buildings = getBuildingNodes();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className={`glass-panel p-4 relative scan-line ${presentationMode ? 'p-6' : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" style={{ boxShadow: '0 0 8px hsl(186,100%,50%)' }} />
        <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-mono">Digital Twin — Campus Topology</span>
      </div>

      {/* Subtle perspective tilt wrapper */}
      <div style={{ perspective: '900px' }}>
        <div style={{ transform: 'rotateX(4deg)', transformOrigin: 'center bottom' }}>
          <svg viewBox="0 0 600 320" className="w-full" style={{ filter: 'drop-shadow(0 8px 24px hsla(186,100%,50%,0.04))' }}>

            {/* Isometric-style background grid */}
            {Array.from({ length: 20 }, (_, i) => (
              <React.Fragment key={`grid-${i}`}>
                <line x1={i * 30} y1={0} x2={i * 30} y2={320} stroke="hsla(186, 100%, 50%, 0.025)" strokeWidth="0.5" />
                <line x1={0} y1={i * 16} x2={600} y2={i * 16} stroke="hsla(186, 100%, 50%, 0.025)" strokeWidth="0.5" />
              </React.Fragment>
            ))}
            {/* Diagonal accent lines for depth */}
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`diag-${i}`} x1={i * 80} y1={0} x2={i * 80 + 160} y2={320}
                stroke="hsla(186, 100%, 50%, 0.015)" strokeWidth="0.5" />
            ))}

            {/* Connection lines between nearby buildings */}
            {buildings.map((b, i) =>
              buildings.slice(i + 1).map(b2 => {
                const dist = Math.sqrt((b.x - b2.x) ** 2 + (b.y - b2.y) ** 2);
                if (dist < 250) return (
                  <g key={`${b.id}-${b2.id}`}>
                    <line x1={b.x} y1={b.y} x2={b2.x} y2={b2.y}
                      stroke="hsla(186, 100%, 50%, 0.08)" strokeWidth="0.5" strokeDasharray="4 6" />
                    {/* Animated data particle on the line */}
                    <circle r="1.5" fill="hsl(186, 100%, 50%)" opacity="0.6"
                      style={{ filter: 'drop-shadow(0 0 3px hsl(186,100%,50%))' }}>
                      <animateMotion dur={`${2 + i * 0.5}s`} repeatCount="indefinite"
                        path={`M${b.x},${b.y} L${b2.x},${b2.y}`} />
                      <animate attributeName="opacity" values="0;0.8;0" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
                    </circle>
                  </g>
                );
                return null;
              })
            )}

            {/* Building nodes — hexagonal */}
            {buildings.map((b) => {
              const col = statusColors[b.status];
              const isHovered = hovered === b.id;
              const r = isHovered ? 14 : 11;

              return (
                <g key={b.id}
                  onMouseEnter={() => setHovered(b.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                  style={{ transition: 'all 0.2s' }}>

                  {/* Outer pulsing ring — also hex-ish (large circle) */}
                  <circle cx={b.x} cy={b.y} r="28" fill="none" stroke={col} strokeWidth="0.5" opacity="0.12">
                    <animate attributeName="r" values="22;32;22" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.12;0.03;0.12" dur="3s" repeatCount="indefinite" />
                  </circle>

                  {/* Inner ring */}
                  <circle cx={b.x} cy={b.y} r="17" fill="none" stroke={col} strokeWidth="0.3" opacity="0.2">
                    <animate attributeName="r" values="15;19;15" dur="2s" repeatCount="indefinite" />
                  </circle>

                  {/* Hexagon fill */}
                  <path
                    d={hexPath(b.x, b.y, r)}
                    fill={isHovered ? `${col}18` : `${col}08`}
                    stroke={col}
                    strokeWidth={isHovered ? 1.5 : 0.8}
                    style={{
                      filter: isHovered ? `drop-shadow(0 0 12px ${col})` : `drop-shadow(0 0 4px ${col}44)`,
                      transition: 'all 0.2s',
                    }}
                  />

                  {/* Center dot */}
                  <circle cx={b.x} cy={b.y} r={isHovered ? 4 : 2.5} fill={col}
                    style={{ filter: `drop-shadow(0 0 6px ${col})` }}>
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                  </circle>

                  {/* Label */}
                  <text x={b.x} y={b.y - 26} textAnchor="middle"
                    fill={isHovered ? 'hsla(224, 100%, 97%, 0.9)' : 'hsla(224, 100%, 97%, 0.45)'}
                    fontSize="8" fontFamily="JetBrains Mono" letterSpacing="0.05em">
                    {b.name.toUpperCase()}
                  </text>

                  {/* Hover tooltip */}
                  {isHovered && (
                    <foreignObject x={b.x + 20} y={b.y - 50} width="150" height="80">
                      <div className="glass-panel-strong p-2 text-[9px]">
                        <div className="font-mono uppercase tracking-wider mb-1" style={{ color: col }}>{b.name}</div>
                        {b.metrics.map(m => (
                          <div key={m.label} className="flex justify-between text-muted-foreground">
                            <span>{m.label}</span>
                            <span className="font-mono text-foreground ml-2">{m.value}</span>
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
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-3 text-[9px] text-muted-foreground font-mono uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-nexus-cyan" style={{ boxShadow: '0 0 6px hsl(186,100%,50%)' }} />Online
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-nexus-yellow" style={{ boxShadow: '0 0 6px hsl(47,91%,53%)' }} />Warning
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-nexus-alert" style={{ boxShadow: '0 0 6px hsl(357,85%,52%)' }} />Alert
        </span>
      </div>
    </div>
  );
};

export default DigitalTwin;
