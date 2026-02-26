import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNexus } from '@/contexts/NexusContext';
import { getModules } from '@/services/mockData';

// ── Unique visualizations per module ──

const FlowSankey: React.FC<{ sim: boolean }> = ({ sim }) => {
  const zones = ['Gate A', 'Gate B', 'Gate C', 'Gate D'];
  const destinations = ['Main Hall', 'Cafeteria', 'Library', 'Science Block', 'Sports'];
  return (
    <div className="glass-panel p-5">
      <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">Flow Matrix — Live Traffic</div>
      <svg viewBox="0 0 600 280" className="w-full">
        {/* Grid */}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={0} y1={i * 24} x2={600} y2={i * 24} stroke="hsla(186,100%,50%,0.03)" strokeWidth="0.5" />
        ))}
        {/* Sources */}
        {zones.map((z, i) => {
          const y = 40 + i * 55;
          const flow = sim ? Math.round(200 + Math.random() * 300) : Math.round(50 + Math.random() * 100);
          return (
            <g key={z}>
              <rect x={20} y={y - 12} width={80} height={24} fill="hsla(186,100%,50%,0.05)" stroke="hsla(186,100%,50%,0.15)" strokeWidth="0.5" />
              <text x={60} y={y + 3} textAnchor="middle" fill="hsl(224,100%,97%)" fontSize="8" fontFamily="JetBrains Mono">{z}</text>
              <text x={110} y={y + 3} fill="hsla(186,100%,50%,0.6)" fontSize="8" fontFamily="JetBrains Mono">{flow}</text>
              {/* Flow lines to destinations */}
              {destinations.map((_, di) => {
                const ty = 30 + di * 50;
                const opacity = Math.random() * 0.3 + 0.05;
                const width = sim ? Math.random() * 3 + 0.5 : Math.random() * 1.5 + 0.3;
                return (
                  <path key={`${z}-${di}`} d={`M130,${y} C250,${y} 350,${ty} 440,${ty}`}
                    fill="none" stroke="hsla(186,100%,50%,1)" strokeWidth={width} opacity={opacity}
                    strokeDasharray="4 4" className="animate-dash-flow" />
                );
              })}
            </g>
          );
        })}
        {/* Destinations */}
        {destinations.map((d, i) => {
          const y = 30 + i * 50;
          const occ = Math.round(Math.random() * 100);
          return (
            <g key={d}>
              <rect x={440} y={y - 12} width={120} height={24} fill="hsla(186,100%,50%,0.03)" stroke="hsla(186,100%,50%,0.1)" strokeWidth="0.5" />
              <text x={500} y={y + 3} textAnchor="middle" fill="hsl(224,100%,97%)" fontSize="8" fontFamily="JetBrains Mono">{d}</text>
              <text x={570} y={y + 3} fill="hsla(186,100%,50%,0.5)" fontSize="7" fontFamily="JetBrains Mono">{occ}%</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const SpaceOccupancy: React.FC = () => {
  const rooms = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    occ: Math.random(),
  }));
  return (
    <div className="glass-panel p-5">
      <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">Occupancy Matrix — 30 Rooms</div>
      <div className="grid grid-cols-10 gap-1">
        {rooms.map(r => {
          const color = r.occ < 0.4 ? 'hsla(186,100%,50%,' : r.occ < 0.7 ? 'hsla(47,91%,53%,' : 'hsla(0,100%,68%,';
          return (
            <div key={r.id} className="aspect-square relative group cursor-pointer">
              <div className="w-full h-full" style={{
                background: `${color}${0.15 + r.occ * 0.4})`,
                border: `1px solid ${color}0.3)`,
                boxShadow: r.occ > 0.7 ? `0 0 8px ${color}0.3)` : 'none',
              }} />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block font-mono text-[8px] text-foreground bg-background/90 border border-accent/10 px-1.5 py-0.5 whitespace-nowrap z-10">
                R{r.id + 1}: {Math.round(r.occ * 100)}%
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 mt-3 text-[9px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2" style={{ background: 'hsla(186,100%,50%,0.3)' }} /> Empty</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2" style={{ background: 'hsla(47,91%,53%,0.4)' }} /> Medium</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2" style={{ background: 'hsla(0,100%,68%,0.5)' }} /> Full</span>
      </div>
    </div>
  );
};

const MaintainRack: React.FC = () => {
  const equipment = [
    { name: 'AMD Ryzen AI Node #1', status: 'online', temp: 42, mtbf: 720 },
    { name: 'AMD Ryzen AI Node #2', status: 'online', temp: 38, mtbf: 680 },
    { name: 'HVAC Controller A', status: 'warning', temp: 67, mtbf: 340 },
    { name: 'HVAC Controller B', status: 'online', temp: 52, mtbf: 510 },
    { name: 'Power Distribution Unit', status: 'online', temp: 35, mtbf: 890 },
    { name: 'Edge Gateway #1', status: 'online', temp: 44, mtbf: 760 },
    { name: 'Sensor Array Hub', status: 'warning', temp: 58, mtbf: 420 },
  ];
  return (
    <div className="glass-panel p-5 scan-line">
      <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">Equipment Health Rack</div>
      <div className="space-y-1">
        {equipment.map((eq) => {
          const tempPct = Math.min(eq.temp / 80 * 100, 100);
          const tempColor = eq.temp > 60 ? 'hsla(0,100%,68%' : eq.temp > 50 ? 'hsla(47,91%,53%' : 'hsla(186,100%,50%';
          return (
            <div key={eq.name} className="flex items-center gap-3 p-2 bg-secondary/10 border border-accent/5 hover:border-accent/15 transition-colors">
              <div className={`w-1.5 h-1.5 rounded-full ${eq.status === 'online' ? 'bg-nexus-green' : 'bg-nexus-yellow animate-pulse-glow'}`}
                style={{ boxShadow: eq.status === 'online' ? '0 0 4px hsl(155,100%,43%)' : '0 0 4px hsl(47,91%,53%)' }} />
              <span className="font-mono text-[10px] text-foreground flex-1 truncate">{eq.name}</span>
              <div className="flex items-center gap-1.5 w-20">
                <div className="flex-1 h-1 bg-secondary overflow-hidden">
                  <div className="h-full transition-all" style={{ width: `${tempPct}%`, background: `${tempColor},0.6)` }} />
                </div>
                <span className="font-mono text-[9px] text-muted-foreground tabular-nums w-8 text-right">{eq.temp}°C</span>
              </div>
              <span className="font-mono text-[9px] text-accent/50 tabular-nums w-16 text-right">MTBF:{eq.mtbf}h</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const GuardRadar: React.FC = () => {
  const feeds = [
    { label: 'CAM-01 Main Entrance', status: 'clear' },
    { label: 'CAM-02 Parking Lot B', status: 'clear' },
    { label: 'CAM-03 Perimeter East', status: 'motion' },
    { label: 'CAM-04 Science Block', status: 'clear' },
  ];
  return (
    <div className="glass-panel p-5">
      <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">Surveillance Grid</div>
      <div className="grid grid-cols-2 gap-2">
        {feeds.map((f) => (
          <div key={f.label} className="relative aspect-video bg-background border border-accent/8 overflow-hidden group">
            {/* Scan effect */}
            <div className="absolute inset-0" style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, hsla(186,100%,50%,0.02) 3px, hsla(186,100%,50%,0.02) 4px)',
            }} />
            {/* Corner brackets */}
            <div className="absolute top-1 left-1 w-4 h-4 border-t border-l border-accent/30" />
            <div className="absolute top-1 right-1 w-4 h-4 border-t border-r border-accent/30" />
            <div className="absolute bottom-1 left-1 w-4 h-4 border-b border-l border-accent/30" />
            <div className="absolute bottom-1 right-1 w-4 h-4 border-b border-r border-accent/30" />
            {/* Bounding box on motion */}
            {f.status === 'motion' && (
              <div className="absolute top-1/4 left-1/3 w-1/4 h-1/3 border border-nexus-yellow animate-pulse-glow">
                <span className="absolute -top-3 left-0 font-mono text-[7px] text-nexus-yellow">MOTION DETECTED</span>
              </div>
            )}
            {/* Label */}
            <div className="absolute bottom-1.5 left-2 font-mono text-[8px] text-accent/50">{f.label}</div>
            <div className={`absolute top-1.5 right-2 font-mono text-[7px] uppercase ${f.status === 'clear' ? 'text-nexus-green' : 'text-nexus-yellow animate-pulse-glow'}`}>
              {f.status === 'clear' ? '● CLEAR' : '● ALERT'}
            </div>
            {/* Timestamp */}
            <div className="absolute bottom-1.5 right-2 font-mono text-[7px] text-muted-foreground tabular-nums">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Module metrics with unique content ──
const moduleConfig: Record<string, {
  cards: { label: string; value: string; sub: string }[];
  visualization: React.FC<{ sim: boolean }>;
  suggestions: string[];
}> = {
  flow: {
    cards: [
      { label: 'Live Footfall', value: '1,247', sub: '/hr' },
      { label: 'Gate Status', value: '4/4', sub: 'Active' },
      { label: 'Shuttle ETA', value: '3', sub: 'min' },
    ],
    visualization: FlowSankey,
    suggestions: ['Reroute Gate B → Gate C', 'Deploy additional shuttle', 'Open overflow path'],
  },
  eco: {
    cards: [
      { label: 'Consumption', value: '456', sub: 'kW' },
      { label: 'Solar Output', value: '124', sub: 'kW' },
      { label: 'Grid Load', value: '67', sub: '%' },
    ],
    visualization: ({ sim }) => (
      <div className="glass-panel p-5">
        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">Energy Flow — Real-time</div>
        <svg viewBox="0 0 600 200" className="w-full">
          {Array.from({ length: 60 }, (_, i) => {
            const val = sim ? 40 + Math.random() * 50 : 20 + Math.random() * 30;
            const h = val * 1.5;
            return (
              <rect key={i} x={i * 10} y={200 - h} width={8} height={h}
                fill={val > 60 ? 'hsla(0,100%,68%,0.4)' : val > 40 ? 'hsla(47,91%,53%,0.3)' : 'hsla(155,100%,43%,0.3)'}
                stroke={val > 60 ? 'hsla(0,100%,68%,0.6)' : val > 40 ? 'hsla(47,91%,53%,0.4)' : 'hsla(155,100%,43%,0.4)'}
                strokeWidth="0.5" />
            );
          })}
          <line x1={0} y1={200} x2={600} y2={200} stroke="hsla(186,100%,50%,0.1)" strokeWidth="0.5" />
        </svg>
      </div>
    ),
    suggestions: ['Shed non-essential loads', 'Boost solar inverter', 'Switch to battery backup'],
  },
  space: {
    cards: [
      { label: 'Occupancy', value: '62', sub: '%' },
      { label: 'Rooms Available', value: '12/30', sub: '' },
      { label: 'Avg Density', value: 'Normal', sub: '' },
    ],
    visualization: () => <SpaceOccupancy />,
    suggestions: ['Redirect to Block C rooms', 'Open emergency overflow', 'Lock low-density zones'],
  },
  maintain: {
    cards: [
      { label: 'Health Score', value: '94', sub: '%' },
      { label: 'Tasks Pending', value: '3', sub: '' },
      { label: 'MTBF', value: '720', sub: 'hrs' },
    ],
    visualization: () => <MaintainRack />,
    suggestions: ['Schedule HVAC-A service', 'Order replacement filters', 'Run diagnostics on Node #3'],
  },
  guard: {
    cards: [
      { label: 'Threat Level', value: '0', sub: '' },
      { label: 'Cameras Online', value: '48/48', sub: '' },
      { label: 'Perimeter', value: 'Secure', sub: '' },
    ],
    visualization: () => <GuardRadar />,
    suggestions: ['Elevate perimeter to Level 1', 'Dispatch patrol to Zone D', 'Review CAM-03 footage'],
  },
  federate: {
    cards: [
      { label: 'Nodes Synced', value: '6/6', sub: '' },
      { label: 'Latency', value: '2.1', sub: 'ms' },
      { label: 'Bandwidth', value: '94', sub: '%' },
    ],
    visualization: ({ sim }) => (
      <div className="glass-panel p-5">
        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">Node Federation Map</div>
        <svg viewBox="0 0 600 250" className="w-full">
          {/* Central hub */}
          <circle cx={300} cy={125} r="20" fill="hsla(186,100%,50%,0.05)" stroke="hsla(186,100%,50%,0.3)" strokeWidth="1">
            <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x={300} y={128} textAnchor="middle" fill="hsl(186,100%,50%)" fontSize="8" fontFamily="JetBrains Mono">HUB</text>
          {/* Satellite nodes */}
          {[0, 1, 2, 3, 4, 5].map(i => {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const x = 300 + Math.cos(angle) * 100;
            const y = 125 + Math.sin(angle) * 80;
            return (
              <g key={i}>
                <line x1={300} y1={125} x2={x} y2={y} stroke="hsla(186,100%,50%,0.1)" strokeWidth="0.5" strokeDasharray="3 5" className="animate-dash-flow" />
                <circle cx={x} cy={y} r="8" fill="hsla(186,100%,50%,0.08)" stroke="hsla(186,100%,50%,0.3)" strokeWidth="0.5" />
                <circle cx={x} cy={y} r="2" fill="hsl(155,100%,43%)" style={{ filter: 'drop-shadow(0 0 4px hsl(155,100%,43%))' }} />
                <text x={x} y={y + 18} textAnchor="middle" fill="hsla(224,100%,97%,0.4)" fontSize="7" fontFamily="JetBrains Mono">N{i + 1}</text>
                {/* Data packet animation */}
                <circle r="1.5" fill="hsl(186,100%,50%)" opacity="0.6">
                  <animateMotion dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" path={`M${300},${125} L${x},${y}`} />
                </circle>
              </g>
            );
          })}
        </svg>
      </div>
    ),
    suggestions: ['Force sync all nodes', 'Isolate Node #3 for update', 'Run consensus check'],
  },
};

const ModuleDetailPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { simulationActive } = useNexus();
  const modules = getModules(simulationActive);
  const mod = modules.find(m => m.id === moduleId);
  const config = moduleConfig[moduleId || 'flow'] || moduleConfig.flow;
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  if (!mod) return <div className="text-foreground p-8 font-mono">Module not found.</div>;

  const Viz = config.visualization;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-xl font-bold text-foreground tracking-wide">{mod.fullName}</h1>
        <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em] mt-1">
          Status: <span className={mod.status === 'online' ? 'text-nexus-green' : 'text-nexus-yellow'}>{mod.status.toUpperCase()}</span>
        </div>
      </motion.div>

      {/* Metric strip */}
      <div className="flex items-start gap-0">
        {config.cards.map((c, i) => (
          <React.Fragment key={c.label}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex-1"
            >
              <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.15em] mb-1">{c.label}</div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-2xl font-bold text-foreground tabular-nums">{c.value}</span>
                {c.sub && <span className="font-mono text-[10px] text-muted-foreground">{c.sub}</span>}
              </div>
            </motion.div>
            {i < config.cards.length - 1 && <div className="w-px self-stretch bg-accent/10 mx-4 mt-1" />}
          </React.Fragment>
        ))}
      </div>

      {/* Custom visualization */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Viz sim={simulationActive} />
      </motion.div>

      {/* Suggested Actions */}
      <div className="glass-panel p-5">
        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3">Suggested Actions</div>
        <div className="flex flex-wrap gap-2">
          {config.suggestions.map(s => (
            <button
              key={s}
              onClick={() => setSelectedAction(s)}
              className={`font-mono text-[10px] px-4 py-2 border transition-all uppercase tracking-wider ${
                selectedAction === s
                  ? 'bg-accent/10 border-accent/40 text-accent'
                  : 'border-accent/8 text-muted-foreground hover:border-accent/25 hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {selectedAction && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 font-mono text-[10px] text-nexus-green">
            ✓ Action logged: "{selectedAction}" — dispatched to causal engine.
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetailPage;
