import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getCausalGraphData } from '@/services/mockData';
import { useNexus } from '@/contexts/NexusContext';

// Hexagon path (pointy-top) centered at cx,cy with radius r
const hexPath = (cx: number, cy: number, r: number) => {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  });
  return `M${pts[0]} ${pts.slice(1).map(p => `L${p}`).join(' ')} Z`;
};

const CausalGraph: React.FC<{ presentationMode?: boolean }> = ({ presentationMode }) => {
  const { simulationActive } = useNexus();
  const { nodes, edges } = getCausalGraphData();
  const [activeChain, setActiveChain] = useState<string[]>([]);
  const [explanation, setExplanation] = useState('System nominal. No active causal chains detected.');
  const [displayedText, setDisplayedText] = useState('');
  const textRef = useRef('');

  useEffect(() => {
    if (simulationActive) {
      const chain = ['footfall', 'binfill', 'hvac', 'power', 'maintenance', 'safety'];
      let i = 0;
      const fullText = '⚡ Tracing causal chain from mass ingress event...';
      textRef.current = fullText;
      setExplanation(fullText);
      const interval = setInterval(() => {
        if (i < chain.length) {
          setActiveChain(prev => [...prev, chain[i]]);
          i++;
        } else {
          const rootText = '> ROOT CAUSE: 500-person ingress @ Gate B\n> → Bin fill acceleration (cafeteria)\n> → HVAC thermal spike Zones 2-4\n> → Power grid +34%\n> → Maintenance auto-dispatch\n> → Perimeter security → Level 2\n> STATUS: All modules responding autonomously.';
          textRef.current = rootText;
          setExplanation(rootText);
          clearInterval(interval);
        }
      }, 500);
      return () => { clearInterval(interval); setActiveChain([]); };
    } else {
      setActiveChain([]);
      const nomText = '> System nominal.\n> No active causal chains.\n> All modules: ONLINE';
      textRef.current = nomText;
      setExplanation(nomText);
    }
  }, [simulationActive]);

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < explanation.length) {
        setDisplayedText(explanation.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [explanation]);

  return (
    <div className="glass-panel p-5 scan-line">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-neon-pulse" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-mono">Causal Graph Visualization</span>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <svg viewBox="0 0 600 300" className="w-full">
            <defs>
              {/* Gradient for active edges */}
              <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(186, 100%, 50%)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="hsl(155, 100%, 43%)" stopOpacity="0.8" />
              </linearGradient>
              {/* Glow filter */}
              <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Background grid */}
            {Array.from({ length: 12 }, (_, i) => (
              <React.Fragment key={`cg-${i}`}>
                <line x1={i * 50} y1={0} x2={i * 50} y2={300} stroke="hsla(186, 100%, 50%, 0.025)" strokeWidth="0.5" />
                <line x1={0} y1={i * 25} x2={600} y2={i * 25} stroke="hsla(186, 100%, 50%, 0.025)" strokeWidth="0.5" />
              </React.Fragment>
            ))}

            {/* Edges */}
            {edges.map((e) => {
              const src = nodes.find(n => n.id === e.source)!;
              const tgt = nodes.find(n => n.id === e.target)!;
              const isActive = activeChain.includes(e.source) && activeChain.includes(e.target);
              return (
                <g key={`${e.source}-${e.target}`}>
                  {/* Base edge */}
                  <line
                    x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                    stroke={isActive ? 'url(#edgeGrad)' : 'hsla(186, 100%, 50%, 0.07)'}
                    strokeWidth={isActive ? 2.5 : 0.5}
                    strokeDasharray={isActive ? '8 4' : '2 6'}
                    className={isActive ? 'animate-dash-flow' : ''}
                    style={isActive ? { filter: 'drop-shadow(0 0 6px hsl(186,100%,50%))' } : {}}
                  />
                  {/* Data-flow particle */}
                  {isActive && (
                    <>
                      <circle r="3" fill="hsl(186, 100%, 50%)" style={{ filter: 'drop-shadow(0 0 6px hsl(186,100%,50%))' }}>
                        <animateMotion dur="1.5s" repeatCount="indefinite"
                          path={`M${src.x},${src.y} L${tgt.x},${tgt.y}`} />
                        <animate attributeName="opacity" values="0;1;1;0" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                      <circle r="1.5" fill="hsl(155, 100%, 43%)" style={{ filter: 'drop-shadow(0 0 4px hsl(155,100%,43%))' }}>
                        <animateMotion dur="1.5s" begin="0.75s" repeatCount="indefinite"
                          path={`M${src.x},${src.y} L${tgt.x},${tgt.y}`} />
                        <animate attributeName="opacity" values="0;1;1;0" dur="1.5s" begin="0.75s" repeatCount="indefinite" />
                      </circle>
                    </>
                  )}
                </g>
              );
            })}

            {/* Nodes — hexagonal */}
            {nodes.map((n) => {
              const isActive = activeChain.includes(n.id);
              const col = isActive ? 'hsl(186, 100%, 50%)' : 'hsla(186, 100%, 50%, 0.2)';

              return (
                <g key={n.id}>
                  {/* Outer halo rings */}
                  {isActive && (
                    <>
                      <circle cx={n.x} cy={n.y} r="28" fill="none" stroke="hsla(186, 100%, 50%, 0.15)" strokeWidth="0.5">
                        <animate attributeName="r" values="24;34;24" dur="2.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.2;0;0.2" dur="2.5s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={n.x} cy={n.y} r="18" fill="none" stroke="hsla(186, 100%, 50%, 0.25)" strokeWidth="0.5">
                        <animate attributeName="r" values="16;22;16" dur="1.8s" repeatCount="indefinite" />
                      </circle>
                    </>
                  )}

                  {/* Hex body */}
                  <path
                    d={hexPath(n.x, n.y, isActive ? 14 : 11)}
                    fill={isActive ? 'hsla(186, 100%, 50%, 0.12)' : 'hsla(236, 44%, 7%, 0.9)'}
                    stroke={col}
                    strokeWidth={isActive ? 1.5 : 0.5}
                    style={{
                      filter: isActive ? 'drop-shadow(0 0 10px hsl(186,100%,50%))' : undefined,
                      transition: 'all 0.3s',
                    }}
                  />

                  {/* Center dot */}
                  {isActive && (
                    <circle cx={n.x} cy={n.y} r="3.5" fill="hsl(186, 100%, 50%)"
                      style={{ filter: 'drop-shadow(0 0 8px hsl(186,100%,50%))' }}>
                      <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Label */}
                  <text x={n.x} y={n.y + 4} textAnchor="middle"
                    fill={isActive ? 'hsl(224, 100%, 97%)' : 'hsla(229, 24%, 52%, 0.6)'}
                    fontSize="7.5" fontFamily="JetBrains Mono" letterSpacing="0.06em">
                    {n.label.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* AI Terminal */}
        <div className="lg:w-72 flex flex-col">
          {/* OS-style window frame */}
          <div className="flex items-center gap-1.5 mb-2 px-2 py-1.5 bg-secondary/30 border border-accent/8">
            <div className="w-2 h-2 rounded-full bg-nexus-alert/60" />
            <div className="w-2 h-2 rounded-full bg-nexus-yellow/60" />
            <div className="w-2 h-2 rounded-full bg-nexus-green/60" />
            <span className="ml-2 text-[9px] text-muted-foreground uppercase tracking-[0.15em] font-mono">Root Cause Analysis</span>
          </div>
          <div className="flex-1 bg-background/90 border border-accent/10 p-3 font-mono text-[11px] leading-relaxed text-accent/85 whitespace-pre-wrap min-h-[120px]"
            style={{ boxShadow: 'inset 0 0 24px hsla(186,100%,50%,0.03)' }}>
            {displayedText}
            <span className="inline-block w-1.5 h-3 bg-accent/70 ml-0.5 animate-typewriter-blink"
              style={{ boxShadow: '0 0 4px hsl(186,100%,50%)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CausalGraph;
