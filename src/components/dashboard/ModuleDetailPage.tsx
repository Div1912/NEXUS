import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNexus } from '@/contexts/NexusContext';
import { getModules } from '@/services/mockData';

// ── Helper: distribute total across N buckets exactly ──
const distributeTotal = (total: number, n: number): number[] => {
  const weights = Array.from({ length: n }, () => 0.5 + Math.random());
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map(w => Math.floor((w / sum) * total));
  let remainder = total - raw.reduce((a, b) => a + b, 0);
  for (let i = 0; remainder > 0; i = (i + 1) % n, remainder--) raw[i]++;
  return raw;
};

// ── Helper: distribute 100% across N buckets exactly ──
const distributePercent = (n: number): number[] => {
  const weights = Array.from({ length: n }, () => 5 + Math.random() * 30);
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map(w => Math.floor((w / sum) * 100));
  let remainder = 100 - raw.reduce((a, b) => a + b, 0);
  for (let i = 0; remainder > 0; i = (i + 1) % n, remainder--) raw[i]++;
  return raw;
};

// ── Unique visualizations per module ──

const FlowSankey: React.FC<{ sim: boolean }> = ({ sim }) => {
  const { live } = useNexus();
  const zones = ['Gate A', 'Gate B', 'Gate C', 'Gate D'];
  const destinations = ['Main Hall', 'Cafeteria', 'Library', 'Science Block', 'Sports'];
  const liveFootfall = live.footfall;
  const gateValues = useMemo(() => distributeTotal(liveFootfall, zones.length), [liveFootfall, live.tick]);
  const destPercents = useMemo(() => distributePercent(destinations.length), [live.tick]);
  const trend = live.footfallTrend === 'up' ? '\u25b2' : live.footfallTrend === 'down' ? '\u25bc' : '\u2014';
  const trendCol = live.footfallTrend === 'up' ? 'hsl(0,100%,68%)' : live.footfallTrend === 'down' ? 'hsl(155,100%,43%)' : 'hsla(186,100%,50%,0.5)';
  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Flow Matrix — Live Traffic</div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] tabular-nums font-bold" style={{ color: trendCol }}>
            {trend} {liveFootfall.toLocaleString()}/hr
          </span>
          <span className="font-mono text-[10px] text-nexus-green tabular-nums">
            ⚡ {live.energySaved} kWh saved
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-nexus-green animate-pulse-glow" style={{ boxShadow: '0 0 6px hsl(155,100%,43%)' }} />
            <span className="font-mono text-[9px] text-nexus-green uppercase">LIVE</span>
          </span>
        </div>
      </div>
      <svg viewBox="0 0 600 280" className="w-full">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={0} y1={i * 24} x2={600} y2={i * 24} stroke="hsla(186,100%,50%,0.03)" strokeWidth="0.5" />
        ))}
        {zones.map((z, i) => {
          const y = 40 + i * 55;
          const flow = gateValues[i];
          const share = flow / Math.max(liveFootfall, 1);
          return (
            <g key={z}>
              <rect x={20} y={y - 12} width={80} height={24} fill="hsla(186,100%,50%,0.05)" stroke="hsla(186,100%,50%,0.15)" strokeWidth="0.5" />
              <text x={60} y={y + 3} textAnchor="middle" fill="hsl(224,100%,97%)" fontSize="8" fontFamily="JetBrains Mono">{z}</text>
              <text x={110} y={y + 3} fill="hsla(186,100%,50%,0.6)" fontSize="8" fontFamily="JetBrains Mono">{flow}</text>
              {destinations.map((_, di) => {
                const ty = 30 + di * 50;
                return (
                  <path key={`${z}-${di}`} d={`M130,${y} C250,${y} 350,${ty} 440,${ty}`}
                    fill="none" stroke="hsla(186,100%,50%,1)"
                    strokeWidth={0.4 + share * 3} opacity={0.05 + share * 0.35}
                    strokeDasharray="4 4" className="animate-dash-flow" />
                );
              })}
            </g>
          );
        })}
        {destinations.map((d, i) => {
          const y = 30 + i * 50;
          return (
            <g key={d}>
              <rect x={440} y={y - 12} width={120} height={24} fill="hsla(186,100%,50%,0.03)" stroke="hsla(186,100%,50%,0.1)" strokeWidth="0.5" />
              <text x={500} y={y + 3} textAnchor="middle" fill="hsl(224,100%,97%)" fontSize="8" fontFamily="JetBrains Mono">{d}</text>
              <text x={570} y={y + 3} fill="hsla(186,100%,50%,0.5)" fontSize="7" fontFamily="JetBrains Mono">{destPercents[i]}%</text>
            </g>
          );
        })}
        <text x={300} y={272} textAnchor="middle" fill="hsla(186,100%,50%,0.3)" fontSize="7" fontFamily="JetBrains Mono">
          TOTAL: {gateValues.reduce((a, b) => a + b, 0)} | ⚡ {live.solarOutput}kW solar · {live.gridLoad}kW grid
        </text>
      </svg>
    </div>
  );
};

const ROOM_ZONES = ['Block A', 'Block B', 'Block C'];
const ROOM_TYPES = ['Lecture', 'Lab', 'Office', 'Study Hall', 'Seminar'];

const SpaceOccupancy: React.FC = () => {
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null);
  const rooms = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    id: i,
    occ: Math.random(),
    cap: [20, 30, 40, 60, 80, 120][Math.floor(Math.random() * 6)],
    zone: ROOM_ZONES[Math.floor(i / 10)],
    floor: Math.floor(i / 5) + 1,
    type: ROOM_TYPES[Math.floor(Math.random() * ROOM_TYPES.length)],
    temp: 19 + Math.random() * 6,
    co2: Math.round(400 + Math.random() * 600),
  })), []);

  const occupied = rooms.filter(r => r.occ > 0.1).length;
  const avgOcc = Math.round(rooms.reduce((s, r) => s + r.occ, 0) / rooms.length * 100);

  return (
    <div className="glass-panel p-5">
      {/* Header strip */}
      <div className="flex items-center justify-between mb-4">
        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Occupancy Matrix — 30 Rooms</div>
        <div className="flex gap-4 text-[9px] font-mono">
          <span className="text-muted-foreground">Occupied: <span className="text-foreground">{occupied}/30</span></span>
          <span className="text-muted-foreground">Avg: <span className="text-accent">{avgOcc}%</span></span>
        </div>
      </div>

      {/* Zone labels */}
      <div className="grid grid-cols-3 gap-px mb-1">
        {ROOM_ZONES.map(z => (
          <div key={z} className="font-mono text-[8px] text-accent/40 uppercase tracking-wider text-center">{z}</div>
        ))}
      </div>

      <div className="relative">
        <div className="grid grid-cols-10 gap-1.5">
          {rooms.map(r => {
            const isFull = r.occ >= 0.7;
            const isMedium = r.occ >= 0.4 && r.occ < 0.7;
            const col = isFull ? '0,100%,68%' : isMedium ? '47,91%,53%' : '186,100%,50%';
            const isHov = hoveredRoom === r.id;
            return (
              <div key={r.id}
                className="aspect-square relative cursor-pointer transition-all"
                onMouseEnter={() => setHoveredRoom(r.id)}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                <div className="w-full h-full rounded-sm transition-all" style={{
                  background: `hsla(${col},${0.08 + r.occ * 0.28})`,
                  border: `1px solid hsla(${col},${isHov ? 0.6 : 0.2 + r.occ * 0.3})`,
                  boxShadow: isHov
                    ? `0 0 12px hsla(${col},0.5), inset 0 0 8px hsla(${col},0.2)`
                    : `inset 0 0 ${6 + r.occ * 10}px hsla(${col},${0.08 + r.occ * 0.12})`,
                  transform: isHov ? 'scale(1.3)' : 'scale(1)',
                  zIndex: isHov ? 20 : 1,
                }} />
                {/* Tooltip */}
                {isHov && (
                  <div className="absolute z-30 pointer-events-none"
                    style={{ bottom: '120%', left: '50%', transform: 'translateX(-50%)', minWidth: 140 }}>
                    <div className="glass-panel-strong p-2 text-[9px] font-mono">
                      <div className="text-accent font-bold mb-1 uppercase tracking-wider">Room {r.id + 1}</div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-muted-foreground">
                        <span>Zone</span><span className="text-foreground">{r.zone}</span>
                        <span>Floor</span><span className="text-foreground">{r.floor}</span>
                        <span>Type</span><span className="text-foreground">{r.type}</span>
                        <span>Capacity</span><span className="text-foreground">{r.cap} seats</span>
                        <span>Occupancy</span><span style={{ color: isFull ? 'hsl(0,100%,68%)' : isMedium ? 'hsl(47,91%,53%)' : 'hsl(186,100%,50%)' }}>{Math.round(r.occ * 100)}%</span>
                        <span>Temp</span><span className="text-foreground">{r.temp.toFixed(1)}°C</span>
                        <span>CO₂</span><span className={r.co2 > 800 ? 'text-nexus-yellow' : 'text-nexus-green'}>{r.co2} ppm</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 mt-4 text-[9px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'hsla(186,100%,50%,0.15)', border: '1px solid hsla(186,100%,50%,0.3)' }} />Empty (&lt;10%)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'hsla(47,91%,53%,0.25)', border: '1px solid hsla(47,91%,53%,0.4)' }} />Medium (40–70%)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'hsla(0,100%,68%,0.3)', border: '1px solid hsla(0,100%,68%,0.5)' }} />Full (&gt;70%)</span>
      </div>
    </div>
  );
};

const MaintainRack: React.FC = () => {
  const [hoveredEq, setHoveredEq] = useState<string | null>(null);
  const equipment = [
    { name: 'AMD Ryzen AI Node #1', status: 'online', temp: 42, mtbf: 720, health: 96, load: 34, lastService: '14 days ago' },
    { name: 'AMD Ryzen AI Node #2', status: 'online', temp: 38, mtbf: 680, health: 98, load: 28, lastService: '14 days ago' },
    { name: 'HVAC Controller A', status: 'warning', temp: 67, mtbf: 340, health: 61, load: 88, lastService: '45 days ago' },
    { name: 'HVAC Controller B', status: 'online', temp: 52, mtbf: 510, health: 79, load: 62, lastService: '30 days ago' },
    { name: 'Power Distribution Unit', status: 'online', temp: 35, mtbf: 890, health: 99, load: 44, lastService: '7 days ago' },
    { name: 'Edge Gateway #1', status: 'online', temp: 44, mtbf: 760, health: 95, load: 51, lastService: '21 days ago' },
    { name: 'Sensor Array Hub', status: 'warning', temp: 58, mtbf: 420, health: 72, load: 74, lastService: '38 days ago' },
    { name: 'Ultrasonic Sensor Array (Gate B)', status: 'online', temp: 28, mtbf: 1200, health: 100, load: 12, lastService: '3 days ago' },
    { name: 'DHT22 Climate Nodes (Lab 3)', status: 'online', temp: 31, mtbf: 980, health: 97, load: 18, lastService: '3 days ago' },
  ];
  const avgHealth = Math.round(equipment.reduce((s, e) => s + e.health, 0) / equipment.length);
  return (
    <div className="glass-panel p-5 scan-line">
      <div className="flex items-center justify-between mb-4">
        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Equipment Health Rack</div>
        <div className="flex items-center gap-2">
          <div className="font-mono text-[9px] text-muted-foreground">Fleet Health:</div>
          <span className="font-mono text-[11px] font-bold" style={{ color: avgHealth > 85 ? 'hsl(155,100%,43%)' : 'hsl(47,91%,53%)' }}>{avgHealth}%</span>
        </div>
      </div>
      <div className="space-y-1">
        {equipment.map((eq) => {
          const tempPct = Math.min(eq.temp / 80 * 100, 100);
          const tempCol = eq.temp > 60 ? 'hsl(0,100%,68%)' : eq.temp > 50 ? 'hsl(47,91%,53%)' : 'hsl(186,100%,50%)';
          const healthCol = eq.health < 70 ? 'hsl(0,100%,68%)' : eq.health < 85 ? 'hsl(47,91%,53%)' : 'hsl(155,100%,43%)';
          const isHov = hoveredEq === eq.name;
          return (
            <div key={eq.name}
              className="relative group p-2.5 border transition-all cursor-pointer"
              style={{
                background: isHov ? 'hsla(186,100%,50%,0.04)' : 'hsla(234,34%,10%,0.4)',
                borderColor: isHov ? 'hsla(186,100%,50%,0.25)' : eq.status === 'warning' ? 'hsla(47,91%,53%,0.2)' : 'hsla(186,100%,50%,0.07)',
              }}
              onMouseEnter={() => setHoveredEq(eq.name)}
              onMouseLeave={() => setHoveredEq(null)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${eq.status === 'online' ? 'bg-nexus-green' : 'bg-nexus-yellow animate-pulse-glow'}`}
                  style={{ boxShadow: eq.status === 'online' ? '0 0 6px hsl(155,100%,43%)' : '0 0 6px hsl(47,91%,53%)' }} />
                <span className="font-mono text-[10px] text-foreground flex-1 truncate">{eq.name}</span>
                {/* Health bar */}
                <div className="flex items-center gap-1.5 w-28">
                  <div className="flex-1 h-1.5 bg-secondary/50 overflow-hidden rounded-full">
                    <div className="h-full rounded-full transition-all" style={{ width: `${eq.health}%`, background: healthCol, boxShadow: `0 0 4px ${healthCol}` }} />
                  </div>
                  <span className="font-mono text-[9px] tabular-nums w-7 text-right" style={{ color: healthCol }}>{eq.health}%</span>
                </div>
                {/* Temp */}
                <div className="flex items-center gap-1 w-16">
                  <div className="w-8 h-1 bg-secondary/50 overflow-hidden rounded-full">
                    <div className="h-full rounded-full" style={{ width: `${tempPct}%`, background: tempCol }} />
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground tabular-nums">{eq.temp}°C</span>
                </div>
                <span className="font-mono text-[9px] text-accent/40 tabular-nums w-14 text-right hidden xl:block">{eq.mtbf}h</span>
              </div>
              {/* Expanded detail on hover */}
              {isHov && (
                <div className="mt-2 pt-2 border-t border-accent/10 grid grid-cols-4 gap-2 text-[9px] font-mono">
                  <div><div className="text-muted-foreground">Load</div><div className="text-foreground font-bold">{eq.load}%</div></div>
                  <div><div className="text-muted-foreground">MTBF</div><div className="text-foreground font-bold">{eq.mtbf}h</div></div>
                  <div><div className="text-muted-foreground">Last Service</div><div className="text-foreground font-bold">{eq.lastService}</div></div>
                  <div><div className="text-muted-foreground">Status</div>
                    <div className="font-bold" style={{ color: eq.status === 'online' ? 'hsl(155,100%,43%)' : 'hsl(47,91%,53%)' }}>
                      {eq.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const GuardRadar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const feeds = [
    { label: 'CAM-01 Main Entrance', status: 'clear', zone: 'Entry', risk: 'LOW', fps: 30, persons: 3 },
    { label: 'CAM-02 Parking Lot B', status: 'clear', zone: 'Perimeter', risk: 'LOW', fps: 25, persons: 0 },
    { label: 'CAM-03 Perimeter East', status: 'motion', zone: 'Perimeter', risk: 'MED', fps: 30, persons: 1 },
    { label: 'CAM-04 Science Block', status: 'clear', zone: 'Indoor', risk: 'LOW', fps: 30, persons: 12 },
    { label: 'CAM-05 Library Exit', status: 'clear', zone: 'Indoor', risk: 'LOW', fps: 25, persons: 7 },
    { label: 'CAM-06 Sports Ground', status: 'clear', zone: 'Outdoor', risk: 'LOW', fps: 15, persons: 22 },
  ];
  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Surveillance Grid — 6 Feeds</div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-nexus-green animate-pulse-glow" style={{ boxShadow: '0 0 6px hsl(155,100%,43%)' }} />
          <span className="font-mono text-[9px] text-nexus-green uppercase">6/6 ONLINE</span>
        </div>
      </div>

      {/* Radar sweep + threat map */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Radar */}
        <div className="aspect-square relative">
          <svg viewBox="0 0 200 200" className="w-full">
            {[40, 70, 100].map(r => (
              <circle key={r} cx={100} cy={100} r={r} fill="none" stroke="hsla(186,100%,50%,0.1)" strokeWidth="0.5" />
            ))}
            <line x1={100} y1={0} x2={100} y2={200} stroke="hsla(186,100%,50%,0.06)" strokeWidth="0.5" />
            <line x1={0} y1={100} x2={200} y2={100} stroke="hsla(186,100%,50%,0.06)" strokeWidth="0.5" />
            {/* Radar sweep */}
            <path d="M100,100 L100,0 A100,100 0 0,1 200,100 Z" fill="hsla(186,100%,50%,0.06)">
              <animateTransform attributeName="transform" type="rotate" values="0 100 100;360 100 100" dur="4s" repeatCount="indefinite" />
            </path>
            {/* Blips */}
            <circle cx={130} cy={70} r="3" fill="hsl(155,100%,43%)" style={{ filter: 'drop-shadow(0 0 4px hsl(155,100%,43%))' }}>
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={80} cy={140} r="3" fill="hsl(155,100%,43%)" style={{ filter: 'drop-shadow(0 0 4px hsl(155,100%,43%))' }}>
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx={150} cy={120} r="4" fill="hsl(47,91%,53%)" style={{ filter: 'drop-shadow(0 0 6px hsl(47,91%,53%))' }}>
              <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite" />
            </circle>
            <text x={100} y={104} textAnchor="middle" fill="hsla(186,100%,50%,0.4)" fontSize="8" fontFamily="JetBrains Mono">RADAR</text>
          </svg>
        </div>

        {/* Stats panel */}
        <div className="space-y-2 flex flex-col justify-center">
          {[
            { label: 'Cameras Online', val: '6/6', col: 'hsl(155,100%,43%)' },
            { label: 'Perimeter Status', val: 'SECURE', col: 'hsl(155,100%,43%)' },
            { label: 'Active Alerts', val: '1 MOTION', col: 'hsl(47,91%,53%)' },
            { label: 'Persons Detected', val: '45', col: 'hsl(186,100%,50%)' },
            { label: 'Threat Level', val: 'LOW', col: 'hsl(155,100%,43%)' },
          ].map(s => (
            <div key={s.label} className="flex justify-between items-center px-2 py-1 border border-accent/8 bg-secondary/10">
              <span className="font-mono text-[9px] text-muted-foreground uppercase">{s.label}</span>
              <span className="font-mono text-[10px] font-bold" style={{ color: s.col }}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Camera grid */}
      <div className="grid grid-cols-3 gap-2">
        {feeds.map((f) => (
          <div key={f.label} className="relative aspect-video border overflow-hidden group cursor-pointer transition-all hover:border-accent/30"
            style={{ background: 'hsla(236,44%,5%,0.8)', borderColor: f.status === 'motion' ? 'hsla(47,91%,53%,0.4)' : 'hsla(186,100%,50%,0.08)' }}>
            {/* CRT scanlines */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsla(186,100%,50%,0.015) 2px, hsla(186,100%,50%,0.015) 3px)',
            }} />
            {/* Corner brackets */}
            <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-accent/30" />
            <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-accent/30" />
            <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-accent/30" />
            <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-accent/30" />
            {/* Motion box */}
            {f.status === 'motion' && (
              <div className="absolute top-1/4 left-1/3 w-1/4 h-1/3 border border-nexus-yellow animate-pulse-glow">
                <span className="absolute -top-3 left-0 font-mono text-[6px] text-nexus-yellow">MOTION</span>
              </div>
            )}
            {/* Overlay info — visible on hover */}
            <div className="absolute inset-0 flex flex-col justify-end p-1 opacity-100 group-hover:bg-black/30 transition-all">
              <div className="hidden group-hover:flex flex-col gap-0.5 px-1 pb-1">
                <div className="font-mono text-[7px] text-muted-foreground">{f.zone} · {f.fps}fps · {f.persons} persons</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[7px] text-accent/50 truncate">{f.label}</span>
                <span className={`font-mono text-[7px] uppercase ${f.status === 'clear' ? 'text-nexus-green' : 'text-nexus-yellow animate-pulse-glow'}`}>
                  {f.status === 'clear' ? '● CLR' : '● ALT'}
                </span>
              </div>
              <div className="font-mono text-[6px] text-muted-foreground/40 tabular-nums">{time.toLocaleTimeString()}</div>
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
  eventContext?: string;
}> = {
  flow: {
    cards: [
      { label: 'Live Footfall', value: '1,247', sub: '/hr' },
      { label: 'Gate Status', value: '4/4', sub: 'Active' },
      { label: 'Shuttle ETA', value: '3', sub: 'min' },
    ],
    visualization: FlowSankey,
    suggestions: ['Reroute Gate B → Gate C', 'Deploy additional shuttle', 'Open overflow path', 'BROADCAST SAFE-MOBILITY NUDGE: Reroute pedestrian flow to Gate C'],
    eventContext: 'ACTIVE EVENT CONTEXT: Science Symposium (High Traffic)',
  },
  eco: {
    cards: [
      { label: 'Consumption', value: '456', sub: 'kW' },
      { label: 'Solar Output', value: '124', sub: 'kW' },
      { label: 'Grid Load', value: '67', sub: '%' },
      { label: 'Water Flow', value: '2.4', sub: 'kL/hr' },
    ],
    visualization: ({ sim }) => {
      const N = 60;
      // Generate three correlated energy bands
      const solarData = useMemo(() => Array.from({ length: N }, (_, i) => {
        const peak = sim ? 140 + Math.sin(i * 0.12) * 40 : 80 + Math.sin(i * 0.1) * 25;
        return Math.max(0, peak + (Math.random() - 0.5) * 20);
      }), [sim]);
      const gridData = useMemo(() => Array.from({ length: N }, (_, i) => {
        const base = sim ? 200 + Math.sin(i * 0.09) * 60 : 110 + Math.sin(i * 0.08) * 30;
        return Math.max(0, base + (Math.random() - 0.5) * 25);
      }), [sim]);
      const consumptionData = useMemo(() => solarData.map((s, i) => s + gridData[i] * 0.7 + (Math.random() - 0.3) * 15), [solarData, gridData]);

      const allMax = Math.max(...consumptionData, ...solarData, ...gridData);
      const H = 200, W = 590;
      const toY = (v: number) => H - (v / allMax) * (H - 10) - 5;
      const toX = (i: number) => (i / (N - 1)) * W;

      // Smooth cubic bezier path
      const smoothPath = (data: number[]) => {
        return data.map((v, i) => {
          const x = toX(i), y = toY(v);
          if (i === 0) return `M${x.toFixed(1)},${y.toFixed(1)}`;
          const px = toX(i - 1), py = toY(data[i - 1]);
          const cpx = (px + x) / 2;
          return `C${cpx.toFixed(1)},${py.toFixed(1)} ${cpx.toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');
      };
      const areaPath = (data: number[]) =>
        `${smoothPath(data)} L${W},${H} L0,${H} Z`;

      const lastSolar = { x: toX(N - 1), y: toY(solarData[N - 1]) };
      const lastGrid = { x: toX(N - 1), y: toY(gridData[N - 1]) };
      const lastCons = { x: toX(N - 1), y: toY(consumptionData[N - 1]) };

      // Interactive crosshair state
      const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);
      const svgRef = React.useRef<SVGSVGElement>(null);
      const handleMouseMove = React.useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width;
        const svgX = relX * 620;
        const idx = Math.max(0, Math.min(N - 1, Math.round(svgX / W * (N - 1))));
        setHoverIdx(idx);
      }, [N, W]);

      // Format minute index as HH:MM (relative to now)
      const now = new Date();
      const indexToTime = (i: number) => {
        const d = new Date(now.getTime() - (N - 1 - i) * 60 * 1000);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };

      return (
        <div className="space-y-4">
          <div className="glass-panel p-5 scan-line">
            <div className="flex items-center justify-between mb-4">
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Energy Flow — Multi-Band Live</div>
              <div className="flex items-center gap-3">
                {hoverIdx !== null && (
                  <span className="font-mono text-[9px] text-accent tabular-nums">
                    {indexToTime(hoverIdx)} · {N - 1 - hoverIdx}m ago
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-nexus-green animate-pulse-glow" style={{ boxShadow: '0 0 6px hsl(155,100%,43%)' }} />
                  <span className="font-mono text-[9px] text-nexus-green uppercase tracking-wider">LIVE</span>
                </div>
              </div>
            </div>
            <svg
              viewBox={`0 0 620 220`}
              className="w-full overflow-visible cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverIdx(null)}
            >
              <defs>
                <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(155,100%,43%)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="hsl(155,100%,43%)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={sim ? 'hsl(357,85%,52%)' : 'hsl(47,91%,53%)'} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={sim ? 'hsl(357,85%,52%)' : 'hsl(47,91%,53%)'} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="consGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(186,100%,50%)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="hsl(186,100%,50%)" stopOpacity="0" />
                </linearGradient>
                <filter id="glow-line">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Grid lines */}
              {[0.25, 0.5, 0.75, 1].map(f => (
                <g key={f}>
                  <line x1={0} y1={H - f * (H - 10) - 5} x2={W} y2={H - f * (H - 10) - 5}
                    stroke="hsla(186,100%,50%,0.04)" strokeWidth="0.5" />
                  <text x={W + 4} y={H - f * (H - 10) - 3}
                    fill="hsla(186,100%,50%,0.2)" fontSize="6" fontFamily="JetBrains Mono">
                    {Math.round(f * allMax)}kW
                  </text>
                </g>
              ))}
              {/* X axis */}
              <line x1={0} y1={H} x2={W} y2={H} stroke="hsla(186,100%,50%,0.08)" strokeWidth="0.5" />

              {/* Consumption band (bottom, widest) */}
              <path d={areaPath(consumptionData)} fill="url(#consGrad)" />
              <path d={smoothPath(consumptionData)} fill="none"
                stroke="hsl(186,100%,50%)" strokeWidth="1"
                strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />

              {/* Grid band */}
              <path d={areaPath(gridData)} fill="url(#gridGrad)" />
              <path d={smoothPath(gridData)} fill="none"
                stroke={sim ? 'hsl(357,85%,52%)' : 'hsl(47,91%,53%)'} strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" opacity="0.7"
                style={{ filter: `drop-shadow(0 0 4px ${sim ? 'hsl(357,85%,52%)' : 'hsl(47,91%,53%)'})` }} />

              {/* Solar band (top, glowing) */}
              <path d={areaPath(solarData)} fill="url(#solarGrad)" />
              <path d={smoothPath(solarData)} fill="none"
                stroke="hsl(155,100%,43%)" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 0 6px hsl(155,100%,43%))' }} />

              {/* Live data points at rightmost edge */}
              {[
                { x: lastSolar.x, y: lastSolar.y, col: 'hsl(155,100%,43%)' },
                { x: lastGrid.x, y: lastGrid.y, col: sim ? 'hsl(357,85%,52%)' : 'hsl(47,91%,53%)' },
                { x: lastCons.x, y: lastCons.y, col: 'hsl(186,100%,50%)' },
              ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill={pt.col} opacity="0.1">
                    <animate attributeName="r" values="4;8;4" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.1;0;0.1" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx={pt.x} cy={pt.y} r="2.5" fill={pt.col}
                    style={{ filter: `drop-shadow(0 0 6px ${pt.col})` }}>
                    <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
                  </circle>
                </g>
              ))}

              {/* Interactive crosshair */}
              {hoverIdx !== null && (() => {
                const cx = toX(hoverIdx);
                const sv = solarData[hoverIdx];
                const gv = gridData[hoverIdx];
                const cv = consumptionData[hoverIdx];
                const ttW = 100, ttH = 52;
                const ttX = cx + 8 > W - ttW ? cx - ttW - 8 : cx + 8;
                return (
                  <g>
                    {/* Vertical crosshair line */}
                    <line x1={cx} y1={0} x2={cx} y2={H} stroke="hsla(186,100%,50%,0.35)" strokeWidth="1" strokeDasharray="3 4" />
                    {/* Dot on each band */}
                    <circle cx={cx} cy={toY(sv)} r="3" fill="hsl(155,100%,43%)" style={{ filter: 'drop-shadow(0 0 5px hsl(155,100%,43%))' }} />
                    <circle cx={cx} cy={toY(gv)} r="3" fill={sim ? 'hsl(357,85%,52%)' : 'hsl(47,91%,53%)'} style={{ filter: `drop-shadow(0 0 5px ${sim ? 'hsl(357,85%,52%)' : 'hsl(47,91%,53%)'})` }} />
                    <circle cx={cx} cy={toY(cv)} r="2.5" fill="hsl(186,100%,50%)" style={{ filter: 'drop-shadow(0 0 4px hsl(186,100%,50%))' }} />
                    {/* Tooltip box */}
                    <rect x={ttX} y={10} width={ttW} height={ttH} rx="1"
                      fill="hsla(236,44%,6%,0.96)" stroke="hsla(186,100%,50%,0.3)" strokeWidth="0.5" />
                    {/* Timestamp */}
                    <text x={ttX + 6} y={22} fill="hsl(186,100%,50%)" fontSize="7" fontFamily="JetBrains Mono">
                      {indexToTime(hoverIdx)}
                    </text>
                    {/* Values */}
                    <text x={ttX + 6} y={33} fill="hsl(155,100%,43%)" fontSize="7" fontFamily="JetBrains Mono">
                      Solar: {Math.round(sv)}kW
                    </text>
                    <text x={ttX + 6} y={43} fill={sim ? 'hsl(357,85%,52%)' : 'hsl(47,91%,53%)'} fontSize="7" fontFamily="JetBrains Mono">
                      Grid: {Math.round(gv)}kW
                    </text>
                    <text x={ttX + 6} y={53} fill="hsl(186,100%,50%)" fontSize="7" fontFamily="JetBrains Mono">
                      Net: {Math.round(cv)}kW
                    </text>
                  </g>
                );
              })()}

              {/* Time labels */}
              {[0, 15, 30, 45, 59].map(i => (
                <text key={i} x={toX(i)} y={H + 14} textAnchor="middle"
                  fill="hsla(186,100%,50%,0.2)" fontSize="6" fontFamily="JetBrains Mono">{indexToTime(i)}</text>
              ))}
            </svg>

            {/* Legend */}
            <div className="flex gap-5 mt-3 text-[9px] font-mono">
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-0.5 rounded-full" style={{ background: 'hsl(155,100%,43%)', boxShadow: '0 0 4px hsl(155,100%,43%)' }} />
                <span className="text-muted-foreground">Solar</span>
                <span className="text-nexus-green tabular-nums ml-1">{Math.round(solarData[N - 1])}kW</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-0.5 rounded-full" style={{ background: sim ? 'hsl(357,85%,52%)' : 'hsl(47,91%,53%)', boxShadow: sim ? '0 0 4px hsl(357,85%,52%)' : '0 0 4px hsl(47,91%,53%)' }} />
                <span className="text-muted-foreground">Grid</span>
                <span className="tabular-nums ml-1" style={{ color: sim ? 'hsl(357,85%,52%)' : 'hsl(47,91%,53%)' }}>{Math.round(gridData[N - 1])}kW</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-0.5 rounded-full" style={{ background: 'hsl(186,100%,50%)', boxShadow: '0 0 4px hsl(186,100%,50%)' }} />
                <span className="text-muted-foreground">Net</span>
                <span className="text-accent tabular-nums ml-1">{Math.round(consumptionData[N - 1])}kW</span>
              </div>
            </div>
          </div>
          {/* Smart Bin + Water grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Smart Bin Topology — Interactive */}
            <div className="glass-panel p-5">
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">Smart Bin Topology — Ultrasonic</div>
              <div className="flex items-end justify-between gap-3 h-36">
                {[
                  { zone: 'Cafeteria', fill: 78, capacity: 240, lastCollect: '2h ago', nextCollect: '4h', bins: 12 },
                  { zone: 'Science', fill: 45, capacity: 160, lastCollect: '5h ago', nextCollect: '7h', bins: 8 },
                  { zone: 'Library', fill: 32, capacity: 120, lastCollect: '3h ago', nextCollect: '9h', bins: 6 },
                  { zone: 'Sports', fill: 61, capacity: 200, lastCollect: '4h ago', nextCollect: '6h', bins: 10 },
                ].map((bin, bi) => {
                  const col = bin.fill > 70 ? { bg: 'hsla(0,100%,68%,0.4)', border: 'hsla(0,100%,68%,0.7)', shadow: 'hsl(0,100%,68%)' }
                    : bin.fill > 50 ? { bg: 'hsla(47,91%,53%,0.35)', border: 'hsla(47,91%,53%,0.6)', shadow: 'hsl(47,91%,53%)' }
                      : { bg: 'hsla(155,100%,43%,0.3)', border: 'hsla(155,100%,43%,0.5)', shadow: 'hsl(155,100%,43%)' };
                  const [hov, setHov] = React.useState(false);
                  return (
                    <div key={bin.zone} className="flex-1 flex flex-col items-center gap-2 relative"
                      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
                      <div className="w-full flex-1 bg-secondary/20 border border-accent/10 relative overflow-visible cursor-pointer transition-all"
                        style={{ borderColor: hov ? col.border : 'hsla(186,100%,50%,0.1)', boxShadow: hov ? `0 0 16px ${col.shadow}33` : 'none' }}>
                        {/* Fill level */}
                        <div className="absolute bottom-0 w-full transition-all duration-700" style={{
                          height: `${bin.fill}%`,
                          background: col.bg,
                          borderTop: `1px solid ${col.border}`,
                          boxShadow: hov ? `0 -4px 16px ${col.shadow}44` : 'none',
                        }} />
                        {/* Wave ripple at surface when hovered */}
                        {hov && (
                          <div className="absolute w-full" style={{ bottom: `${bin.fill}%` }}>
                            <div style={{ height: 2, background: col.border, boxShadow: `0 0 6px ${col.shadow}`, opacity: 0.8, animation: 'shimmer 1.5s linear infinite' }} />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] text-foreground tabular-nums font-bold"
                          style={{ color: col.shadow, textShadow: `0 0 8px ${col.shadow}` }}>{bin.fill}%</div>
                      </div>
                      <span className="font-mono text-[8px] text-muted-foreground text-center truncate w-full text-center">{bin.zone}</span>

                      {/* Hover tooltip */}
                      {hov && (
                        <div className="absolute bottom-full mb-2 left-1/2 z-30 pointer-events-none" style={{ transform: 'translateX(-50%)', minWidth: 150 }}>
                          <div className="glass-panel-strong p-2.5">
                            <div className="font-mono text-[9px] font-bold uppercase mb-1.5" style={{ color: col.shadow }}>{bin.zone} Bins</div>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 font-mono text-[8px] text-muted-foreground">
                              <span>Fill Level</span><span className="text-foreground font-bold">{bin.fill}%</span>
                              <span>Capacity</span><span className="text-foreground">{bin.capacity}L</span>
                              <span>Bin Count</span><span className="text-foreground">{bin.bins} units</span>
                              <span>Collected</span><span className="text-foreground">{bin.lastCollect}</span>
                              <span>Next Due</span><span style={{ color: bin.fill > 70 ? 'hsl(0,100%,68%)' : 'hsl(155,100%,43%)' }}>in {bin.nextCollect}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Water Consumption — Interactive sparkline */}
            <div className="glass-panel p-5">
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3">Water Consumption</div>
              {/* Big metric */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-mono text-3xl font-bold text-foreground tabular-nums" style={{ textShadow: '0 0 16px hsla(186,100%,50%,0.3)' }}>14.2</span>
                <span className="font-mono text-[10px] text-muted-foreground">kL today</span>
                <span className="ml-auto font-mono text-[9px] text-nexus-green">↓4.1% vs yesterday</span>
              </div>
              {/* 24h sparkline interactive */}
              {(() => {
                const [hIdx, setHIdx] = React.useState<number | null>(null);
                const wData = useMemo(() => Array.from({ length: 24 }, (_, h) => ({
                  hour: h,
                  val: parseFloat((0.3 + Math.sin(h * 0.4) * 0.3 + Math.random() * 0.3).toFixed(2)),
                })), []);
                const maxW = Math.max(...wData.map(d => d.val));
                const W2 = 220, H2 = 50;
                const uid2 = 'wg2';
                return (
                  <div className="relative">
                    <svg width="100%" viewBox={`0 0 ${W2} ${H2 + 20}`}
                      onMouseLeave={() => setHIdx(null)}
                      className="cursor-crosshair overflow-visible">
                      <defs>
                        <linearGradient id={uid2} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(186,100%,50%)" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="hsl(186,100%,50%)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Area */}
                      <path
                        d={`M0,${H2 - (wData[0].val / maxW) * (H2 - 4) - 2} ${wData.map((d, i) => `L${(i / 23) * W2},${H2 - (d.val / maxW) * (H2 - 4) - 2}`).join(' ')} L${W2},${H2} L0,${H2} Z`}
                        fill={`url(#${uid2})`} />
                      {/* Line */}
                      <path
                        d={wData.map((d, i) => `${i === 0 ? 'M' : 'L'}${((i / 23) * W2).toFixed(1)},${(H2 - (d.val / maxW) * (H2 - 4) - 2).toFixed(1)}`).join(' ')}
                        fill="none" stroke="hsl(186,100%,50%)" strokeWidth="1.5" strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0 0 4px hsla(186,100%,50%,0.4))' }} />
                      {/* Invisible hover bars */}
                      {wData.map((d, i) => {
                        const x = (i / 23) * W2;
                        const y = H2 - (d.val / maxW) * (H2 - 4) - 2;
                        return (
                          <g key={i} onMouseEnter={() => setHIdx(i)}>
                            <rect x={x - W2 / 48} y={0} width={W2 / 24} height={H2} fill="transparent" />
                            {hIdx === i && (
                              <>
                                <line x1={x} y1={0} x2={x} y2={H2} stroke="hsla(186,100%,50%,0.3)" strokeWidth="1" strokeDasharray="2 3" />
                                <circle cx={x} cy={y} r="3" fill="hsl(186,100%,50%)" style={{ filter: 'drop-shadow(0 0 6px hsl(186,100%,50%))' }} />
                                <rect x={Math.min(x + 4, W2 - 60)} y={y - 22} width={55} height={18} rx="1"
                                  fill="hsla(236,44%,7%,0.95)" stroke="hsla(186,100%,50%,0.3)" strokeWidth="0.5" />
                                <text x={Math.min(x + 8, W2 - 56)} y={y - 9} fill="hsl(186,100%,50%)" fontSize="7" fontFamily="JetBrains Mono">
                                  {String(d.hour).padStart(2, '0')}:00 — {d.val}kL/h
                                </text>
                              </>
                            )}
                          </g>
                        );
                      })}
                      {/* X axis labels */}
                      {[0, 6, 12, 18, 23].map(h => (
                        <text key={h} x={(h / 23) * W2} y={H2 + 14} textAnchor="middle"
                          fill="hsla(186,100%,50%,0.2)" fontSize="6" fontFamily="JetBrains Mono">{h}h</text>
                      ))}
                    </svg>
                  </div>
                );
              })()}
              {/* Leak status + zones */}
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between border border-nexus-green/10 px-2 py-1 bg-nexus-green/[0.04]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-nexus-green" style={{ boxShadow: '0 0 4px hsl(155,100%,43%)' }} />
                    <span className="font-mono text-[9px] text-nexus-green uppercase">No Leaks Detected</span>
                  </div>
                  <span className="font-mono text-[8px] text-muted-foreground">4 Zones Monitored</span>
                </div>
                {[
                  { zone: 'Main Block', flow: 2.4, ok: true },
                  { zone: 'Science', flow: 0.8, ok: true },
                  { zone: 'Sports', flow: 1.1, ok: true },
                  { zone: 'Cafeteria', flow: 1.9, ok: true },
                ].map(z => (
                  <div key={z.zone} className="flex items-center justify-between text-[9px] font-mono px-1">
                    <span className="text-muted-foreground">{z.zone}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1 bg-secondary/50 overflow-hidden rounded-full">
                        <div className="h-full rounded-full" style={{ width: `${(z.flow / 5) * 100}%`, background: 'hsl(186,100%,50%)', boxShadow: '0 0 4px hsla(186,100%,50%,0.4)' }} />
                      </div>
                      <span className="text-foreground tabular-nums w-12 text-right">{z.flow} kL/h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    },
    suggestions: ['Shed non-essential loads', 'Boost solar inverter', 'Switch to battery backup', 'Schedule bin collection'],
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
          <circle cx={300} cy={125} r="20" fill="hsla(186,100%,50%,0.05)" stroke="hsla(186,100%,50%,0.3)" strokeWidth="1">
            <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x={300} y={128} textAnchor="middle" fill="hsl(186,100%,50%)" fontSize="8" fontFamily="JetBrains Mono">HUB</text>
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

// Action consequence messages per action keyword
const getActionEffect = (action: string): { outcome: string; metric?: string; change?: string } => {
  if (action.includes('shuttle') || action.includes('Shuttle')) return { outcome: 'Shuttle #3 rerouted — ETA updated to 2 min', metric: 'Shuttle ETA', change: '2 min' };
  if (action.includes('Gate') || action.includes('gate')) return { outcome: 'Gate C capacity expanded — overflow path open', metric: 'Gate Status', change: '5/4 Active' };
  if (action.includes('BROADCAST')) return { outcome: 'Nudge broadcast to 847 devices via campus app', metric: 'Devices Notified', change: '847' };
  if (action.includes('Solar') || action.includes('solar')) return { outcome: 'Solar inverter boosted to 98% — output +18kW', metric: 'Solar Output', change: '+18 kW' };
  if (action.includes('battery') || action.includes('Battery')) return { outcome: 'Battery backup activated — 2.4 hrs reserve engaged', metric: 'Reserve', change: '2.4 hrs' };
  if (action.includes('Shed') || action.includes('load')) return { outcome: 'Non-essential loads shed — HVAC reduced 15%', metric: 'Grid Load', change: '-8%' };
  if (action.includes('bin') || action.includes('Bin')) return { outcome: 'Waste vehicle dispatched — ETA 22 min (Zone: Cafeteria)', metric: 'Collection ETA', change: '22 min' };
  if (action.includes('Block C') || action.includes('overflow')) return { outcome: 'Block C rooms opened — 8 additional seats available', metric: 'Rooms Available', change: '20/30' };
  if (action.includes('HVAC') || action.includes('hvac')) return { outcome: 'HVAC-A maintenance work order #WO-2847 created', metric: 'Work Orders', change: '+1 opened' };
  if (action.includes('filter')) return { outcome: 'Filter replacement order placed — delivery in 2 days', metric: 'Parts Order', change: 'Placed' };
  if (action.includes('diagnostics')) return { outcome: 'Remote diagnostics initiated on Node #3 — scan 0%→', metric: 'Diagnostics', change: 'Running' };
  if (action.includes('perimeter') || action.includes('Perimeter')) return { outcome: 'Perimeter elevated to Level 1 — 3 guards notified', metric: 'Threat Level', change: 'Level 1' };
  if (action.includes('patrol') || action.includes('Patrol')) return { outcome: 'Patrol unit dispatched to Zone D — ETA 4 min', metric: 'Patrol ETA', change: '4 min' };
  if (action.includes('footage') || action.includes('CAM')) return { outcome: 'CAM-03 footage exported to security archive', metric: 'Archive', change: 'Updated' };
  if (action.includes('sync') || action.includes('Sync')) return { outcome: 'All 6 nodes queued for force sync — 0/6 complete', metric: 'Sync Progress', change: '0/6' };
  if (action.includes('Isolate') || action.includes('isolate')) return { outcome: 'Node #3 isolated — 5 nodes remain in federation', metric: 'Active Nodes', change: '5/6' };
  if (action.includes('consensus')) return { outcome: 'Consensus protocol started — awaiting quorum (4/6)', metric: 'Quorum', change: '4/6' };
  return { outcome: `Action queued and dispatched to Causal Engine`, metric: 'Status', change: 'Pending' };
};

const ModuleDetailPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { simulationActive, live } = useNexus();
  const modules = getModules(simulationActive);
  const mod = modules.find(m => m.id === moduleId);
  const rawConfig = moduleConfig[moduleId || 'flow'] || moduleConfig.flow;

  // Override static card values with live context data so numbers stay in sync
  const liveCardOverrides: Record<string, Record<string, string>> = {
    flow: {
      'Live Footfall': live.footfall.toLocaleString(),
    },
    eco: {
      Consumption: String(live.netConsumption),
      'Solar Output': String(live.solarOutput),
      'Grid Load': String(Math.round((live.gridLoad / (live.solarOutput + live.gridLoad)) * 100)),
    },
  };
  const overrides = liveCardOverrides[moduleId || 'flow'] || {};
  const config = {
    ...rawConfig,
    cards: rawConfig.cards.map(c => ({
      ...c,
      value: overrides[c.label] ?? c.value,
    })),
  };
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [actionLog, setActionLog] = useState<Array<{ action: string; time: string; outcome: string; metric?: string; change?: string }>>([]);
  const [dispatching, setDispatching] = useState(false);

  if (!mod) return <div className="text-foreground p-8 font-mono">Module not found.</div>;

  const Viz = config.visualization;

  const handleAction = (s: string) => {
    if (selectedAction === s) return;
    setSelectedAction(s);
    setDispatching(true);
    const effect = getActionEffect(s);
    setTimeout(() => {
      setDispatching(false);
      setActionLog(prev => [{
        action: s,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        ...effect,
      }, ...prev.slice(0, 4)]);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Event Context Banner */}
      {config.eventContext && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-2.5 border border-accent/20 bg-accent/5"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ boxShadow: '0 0 8px hsl(186,100%,50%)' }} />
          <span className="font-mono text-[10px] text-accent uppercase tracking-[0.15em] font-bold">{config.eventContext}</span>
        </motion.div>
      )}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-xl font-bold text-foreground tracking-wide">{mod.fullName}</h1>
        <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em] mt-1">
          Status: <span className={mod.status === 'online' ? 'text-nexus-green' : 'text-nexus-yellow'}>{mod.status.toUpperCase()}</span>
        </div>
      </motion.div>

      {/* Metric strip — some values update based on dispatched actions */}
      <div className="flex items-start gap-0">
        {config.cards.map((c, i) => {
          // Check if an action changed this metric
          const matched = actionLog.find(a => a.metric === c.label);
          const displayValue = matched ? matched.change! : c.value;
          return (
            <React.Fragment key={c.label}>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex-1"
              >
                <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.15em] mb-1">{c.label}</div>
                <div className="flex items-baseline gap-1.5">
                  <motion.span
                    key={displayValue}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-2xl font-bold tabular-nums"
                    style={{ color: matched ? 'hsl(155,100%,43%)' : 'hsl(224,100%,97%)' }}
                  >{displayValue}</motion.span>
                  {c.sub && <span className="font-mono text-[10px] text-muted-foreground">{c.sub}</span>}
                </div>
                {matched && (
                  <div className="font-mono text-[8px] text-nexus-green mt-0.5">↑ updated by action</div>
                )}
              </motion.div>
              {i < config.cards.length - 1 && <div className="w-px self-stretch bg-accent/10 mx-4 mt-1" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Custom visualization */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Viz sim={simulationActive} />
      </motion.div>

      {/* Suggested Actions — with real effects */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Causal Action Suggestions</div>
          <div className="flex items-center gap-3">
            {dispatching && (
              <span className="font-mono text-[9px] text-accent flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                DISPATCHING...
              </span>
            )}
            <div className="font-mono text-[8px] text-muted-foreground">AI Confidence: <span className="text-accent">94%</span></div>
          </div>
        </div>
        <div className="space-y-2">
          {config.suggestions.map((s, si) => {
            const isNudge = s.startsWith('BROADCAST');
            const isSelected = selectedAction === s;
            const urgency = si === 0 ? { tag: 'HIGH', col: 'hsl(0,100%,68%)' } : si === 1 ? { tag: 'MED', col: 'hsl(47,91%,53%)' } : { tag: 'LOW', col: 'hsl(155,100%,43%)' };
            const logEntry = actionLog.find(a => a.action === s);
            return (
              <motion.button
                key={s}
                onClick={() => handleAction(s)}
                whileHover={{ x: 2 }}
                className={`w-full text-left flex items-start gap-3 px-3 py-2.5 border transition-all ${isSelected
                  ? 'border-nexus-green/30 bg-nexus-green/5'
                  : isNudge
                    ? 'border-accent/30 bg-accent/5'
                    : 'border-accent/8 bg-secondary/10 hover:border-accent/20'
                  }`}
              >
                <span className="font-mono text-[8px] font-bold px-1.5 py-0.5 shrink-0 border mt-0.5"
                  style={{ color: urgency.col, borderColor: `${urgency.col}44`, background: `${urgency.col}10` }}>
                  {urgency.tag}
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`font-mono text-[10px] uppercase tracking-wide ${isSelected ? 'text-nexus-green' : isNudge ? 'text-accent' : 'text-muted-foreground'
                    }`}>{s}</span>
                  {/* Show real outcome inline after dispatch */}
                  {logEntry && (
                    <motion.div
                      initial={{ opacity: 0, y: 2 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-mono text-[9px] text-nexus-green mt-1"
                    >
                      ↳ {logEntry.outcome}
                    </motion.div>
                  )}
                </div>
                {isSelected ? (
                  <span className="font-mono text-[9px] text-nexus-green flex items-center gap-1 shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-nexus-green" style={{ boxShadow: '0 0 4px hsl(155,100%,43%)' }} />
                    DONE
                  </span>
                ) : (
                  <span className="font-mono text-[9px] text-muted-foreground/40 shrink-0 mt-0.5">→ EXECUTE</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Live action log */}
        {actionLog.length > 0 && (
          <div className="mt-4 border-t border-accent/8 pt-3">
            <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-2">Action Log</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {actionLog.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2 font-mono text-[9px]"
                >
                  <span className="text-muted-foreground/50 tabular-nums shrink-0">{entry.time}</span>
                  <span className="text-accent/60 shrink-0">›</span>
                  <span className="text-nexus-green">{entry.outcome}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetailPage;
