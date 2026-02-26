import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCausalGraphData } from '@/services/mockData';
import { useNexus } from '@/contexts/NexusContext';

const CausalGraph: React.FC<{ presentationMode?: boolean }> = ({ presentationMode }) => {
  const { simulationActive } = useNexus();
  const { nodes, edges } = getCausalGraphData();
  const [activeChain, setActiveChain] = useState<string[]>([]);
  const [explanation, setExplanation] = useState('System nominal. No active causal chains detected.');

  useEffect(() => {
    if (simulationActive) {
      const chain = ['footfall', 'binfill', 'hvac', 'power', 'maintenance', 'safety'];
      let i = 0;
      setExplanation('⚡ Simulation active: Tracing causal chain from mass ingress event...');
      const interval = setInterval(() => {
        if (i < chain.length) {
          setActiveChain(prev => [...prev, chain[i]]);
          i++;
        } else {
          setExplanation(
            'Root Cause: 500-person ingress event at Gate B → Triggered bin fill acceleration in cafeteria zone → HVAC thermal load spike across Zones 2-4 → Power grid draw increased 34% → Maintenance crew auto-dispatched → Perimeter security elevated to Level 2.'
          );
          clearInterval(interval);
        }
      }, 500);
      return () => { clearInterval(interval); setActiveChain([]); };
    } else {
      setActiveChain([]);
      setExplanation('System nominal. No active causal chains detected.');
    }
  }, [simulationActive]);

  const scaleX = presentationMode ? 1.4 : 1;
  const scaleY = presentationMode ? 1.4 : 1;

  return (
    <div className="nexus-card p-5">
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Causal Graph Visualization</div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <svg viewBox="0 0 600 300" className="w-full">
            {/* Edges */}
            {edges.map((e) => {
              const src = nodes.find(n => n.id === e.source)!;
              const tgt = nodes.find(n => n.id === e.target)!;
              const isActive = activeChain.includes(e.source) && activeChain.includes(e.target);
              return (
                <line
                  key={`${e.source}-${e.target}`}
                  x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                  stroke={isActive ? '#00E5FF' : 'rgba(0,229,255,0.15)'}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray="6 4"
                  className={isActive ? 'animate-dash-flow' : ''}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((n) => {
              const isActive = activeChain.includes(n.id);
              return (
                <g key={n.id}>
                  {isActive && (
                    <circle cx={n.x} cy={n.y} r="22" fill="rgba(0,229,255,0.08)" stroke="rgba(0,229,255,0.3)" strokeWidth="1">
                      <animate attributeName="r" values="22;28;22" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={n.x} cy={n.y} r="14"
                    fill={isActive ? 'rgba(0,229,255,0.2)' : 'rgba(13,15,38,0.9)'}
                    stroke={isActive ? '#00E5FF' : 'rgba(0,229,255,0.2)'}
                    strokeWidth="1.5"
                  />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" fill={isActive ? '#F0F4FF' : '#8890B5'} fontSize="9" fontFamily="Inter" fontWeight="500">
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="lg:w-64 flex flex-col">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Root Cause Analysis</div>
          <div className="text-sm text-foreground leading-relaxed flex-1">{explanation}</div>
        </div>
      </div>
    </div>
  );
};

export default CausalGraph;
