import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getCausalGraphData } from '@/services/mockData';
import { useNexus } from '@/contexts/NexusContext';

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
    <div className="glass-panel p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-mono">Causal Graph Visualization</span>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <svg viewBox="0 0 600 300" className="w-full">
            {/* Background grid */}
            {Array.from({ length: 12 }, (_, i) => (
              <React.Fragment key={`cg-${i}`}>
                <line x1={i * 50} y1={0} x2={i * 50} y2={300} stroke="hsla(186, 100%, 50%, 0.03)" strokeWidth="0.5" />
                <line x1={0} y1={i * 25} x2={600} y2={i * 25} stroke="hsla(186, 100%, 50%, 0.03)" strokeWidth="0.5" />
              </React.Fragment>
            ))}

            {/* Edges */}
            {edges.map((e) => {
              const src = nodes.find(n => n.id === e.source)!;
              const tgt = nodes.find(n => n.id === e.target)!;
              const isActive = activeChain.includes(e.source) && activeChain.includes(e.target);
              return (
                <g key={`${e.source}-${e.target}`}>
                  <line
                    x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                    stroke={isActive ? 'hsl(186, 100%, 50%)' : 'hsla(186, 100%, 50%, 0.08)'}
                    strokeWidth={isActive ? 2 : 0.5}
                    strokeDasharray={isActive ? '6 4' : '2 6'}
                    className={isActive ? 'animate-dash-flow' : ''}
                  />
                  {/* Data flow particles */}
                  {isActive && (
                    <circle r="2" fill="hsl(186, 100%, 50%)" style={{ filter: 'drop-shadow(0 0 4px hsl(186, 100%, 50%))' }}>
                      <animateMotion dur="1.5s" repeatCount="indefinite" path={`M${src.x},${src.y} L${tgt.x},${tgt.y}`} />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((n) => {
              const isActive = activeChain.includes(n.id);
              return (
                <g key={n.id}>
                  {isActive && (
                    <>
                      <circle cx={n.x} cy={n.y} r="24" fill="none" stroke="hsla(186, 100%, 50%, 0.2)" strokeWidth="0.5">
                        <animate attributeName="r" values="24;32;24" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={n.x} cy={n.y} r="16" fill="none" stroke="hsla(186, 100%, 50%, 0.3)" strokeWidth="0.5">
                        <animate attributeName="r" values="16;20;16" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    </>
                  )}
                  <circle
                    cx={n.x} cy={n.y} r="12"
                    fill={isActive ? 'hsla(186, 100%, 50%, 0.1)' : 'hsla(236, 44%, 7%, 0.9)'}
                    stroke={isActive ? 'hsl(186, 100%, 50%)' : 'hsla(186, 100%, 50%, 0.12)'}
                    strokeWidth={isActive ? 1.5 : 0.5}
                  />
                  {isActive && (
                    <circle cx={n.x} cy={n.y} r="3" fill="hsl(186, 100%, 50%)" style={{ filter: 'drop-shadow(0 0 6px hsl(186, 100%, 50%))' }}>
                      <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <text x={n.x} y={n.y + 4} textAnchor="middle" fill={isActive ? 'hsl(224, 100%, 97%)' : 'hsla(229, 24%, 52%, 0.7)'} fontSize="8" fontFamily="JetBrains Mono" letterSpacing="0.05em">
                    {n.label.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* AI Terminal */}
        <div className="lg:w-72 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-nexus-green" />
            <span className="text-[9px] text-muted-foreground uppercase tracking-[0.15em] font-mono">Root Cause Analysis</span>
          </div>
          <div className="flex-1 bg-background/80 border border-accent/8 p-3 font-mono text-[11px] leading-relaxed text-accent/80 whitespace-pre-wrap min-h-[120px]">
            {displayedText}
            <span className="inline-block w-1.5 h-3 bg-accent/60 ml-0.5 animate-typewriter-blink" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CausalGraph;
