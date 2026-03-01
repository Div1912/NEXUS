import React, { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';
import { Download, RefreshCw, TrendingUp, TrendingDown, Activity, Shield, Zap, Users, CheckCircle } from 'lucide-react';

// ── CSV download helper
const downloadCSV = (filename: string, rows: string[][], onDone?: () => void) => {
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
  onDone?.();
};

// ── Per-report CSV generators
const buildCSV = (type: string, weeklyData: any[], monthlyTrend: any[]) => {
  if (type === 'SUMMARY') return [
    ['Day', 'Footfall', 'Energy kWh', 'Incidents'],
    ...weeklyData.map(d => [d.day, d.footfall, d.energy, d.incidents]),
  ];
  if (type === 'ENERGY') return [
    ['Day', 'Efficiency %', 'Savings USD'],
    ...monthlyTrend.slice(0, 7).map(d => [d.day, d.efficiency, d.savings]),
  ];
  if (type === 'GUARD') return [
    ['Camera', 'Zone', 'Status', 'Persons Detected', 'FPS'],
    ...Array.from({ length: 12 }, (_, i) => [`CAM-${String(i + 1).padStart(2, '0')}`, `Zone ${String.fromCharCode(65 + Math.floor(i / 3))}`, 'Online', Math.floor(Math.random() * 4), 30]),
  ];
  if (type === 'MAINTAIN') return [
    ['Equipment', 'Health %', 'Status', 'Next Service'],
    ['HVAC-A', 92, 'Normal', '2026-03-15'],
    ['Pump-B', 87, 'Normal', '2026-03-20'],
    ['UPS-1', 99, 'Optimal', '2026-06-01'],
    ['Chiller-A', 78, 'Warning', '2026-03-05'],
  ];
  if (type === 'FEDERATE') return [
    ['Node', 'Latency ms', 'Bandwidth %', 'Status'],
    ['N1-Main', 1.2, 98, 'Synced'],
    ['N2-Lab', 2.1, 94, 'Synced'],
    ['N3-Sports', 3.4, 87, 'Synced'],
    ['N4-Library', 1.8, 99, 'Synced'],
    ['N5-Science', 2.7, 91, 'Synced'],
    ['N6-Gate', 1.1, 96, 'Synced'],
  ];
  if (type === 'FLOW') return [
    ['Zone', 'Footfall/hr', 'Peak Hour', 'Avg Dwell min'],
    ['Gate A', 342, '09:00', 2.1],
    ['Gate B', 287, '08:45', 1.8],
    ['Main Hall', 891, '10:00', 8.4],
    ['Cafeteria', 503, '12:30', 22.1],
    ['Library', 198, '14:00', 45.7],
  ];
  return [['No data available']];
};

const initialReports = [
  { title: 'Weekly Campus Summary', date: 'Feb 28, 2026', status: 'Generated', size: '2.4 MB', type: 'SUMMARY' },
  { title: 'Energy Optimization Report', date: 'Feb 27, 2026', status: 'Generated', size: '1.8 MB', type: 'ENERGY' },
  { title: 'Security Incident Log', date: 'Feb 26, 2026', status: 'Generated', size: '920 KB', type: 'GUARD' },
  { title: 'Predictive Maintenance Forecast', date: 'Feb 25, 2026', status: 'Pending', size: '—', type: 'MAINTAIN' },
  { title: 'Edge Node Performance Analysis', date: 'Feb 24, 2026', status: 'Generated', size: '3.1 MB', type: 'FEDERATE' },
  { title: 'Footfall & Occupancy Analytics', date: 'Feb 23, 2026', status: 'Generated', size: '1.2 MB', type: 'FLOW' },
];

const typeColor: Record<string, string> = {
  SUMMARY: 'hsl(186,100%,50%)', ENERGY: 'hsl(155,100%,43%)', GUARD: 'hsl(357,85%,52%)',
  MAINTAIN: 'hsl(47,91%,53%)', FEDERATE: 'hsl(270,80%,70%)', FLOW: 'hsl(186,100%,50%)',
};

const tooltipStyle = {
  background: 'var(--tooltip-bg, hsl(236 44% 9%))',
  border: '1px solid var(--tooltip-border, hsla(186,100%,50%,0.15))',
  fontSize: 10,
  fontFamily: 'JetBrains Mono',
  borderRadius: 0,
  color: 'var(--tooltip-fg, hsl(224,100%,97%))',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
};


const KPIStat: React.FC<{ icon: React.ReactNode; label: string; value: string; change: string; up: boolean }> = ({ icon, label, value, change, up }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-panel p-4 flex items-start gap-3 relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 right-0 h-[2px]"
      style={{ background: 'linear-gradient(90deg, transparent, hsl(186,100%,50%), transparent)', opacity: 0.4 }} />
    <div className="p-2 border border-accent/10" style={{ background: 'hsla(186,100%,50%,0.06)' }}>
      <div className="text-accent w-3 h-3">{icon}</div>
    </div>
    <div className="flex-1">
      <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      <div className="font-mono text-xl font-bold text-foreground tabular-nums">{value}</div>
      <div className={`font-mono text-[9px] flex items-center gap-1 mt-0.5 ${up ? 'text-nexus-green' : 'text-nexus-alert'}`}>
        {up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
        {change}
      </div>
    </div>
  </motion.div>
);

const Reports: React.FC = () => {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [lastSaved, setLastSaved] = useState<string | null>(() => {
    // Restore last saved timestamp from localStorage
    return localStorage.getItem('nexus_reports_saved') || null;
  });
  const [reportList, setReportList] = useState(() => {
    // Restore saved report list from localStorage
    const saved = localStorage.getItem('nexus_reports_list');
    return saved ? JSON.parse(saved) : initialReports;
  });
  const [downloadedReport, setDownloadedReport] = useState<string | null>(null);


  // Fresh data each render so charts show current numbers
  const weeklyData = useMemo(() => Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    footfall: Math.round(800 + Math.random() * 600),
    energy: Math.round(300 + Math.random() * 200),
    incidents: Math.round(Math.random() * 3),
  })), []);

  const monthlyTrend = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    efficiency: Math.round(75 + Math.sin(i * 0.3) * 12 + Math.random() * 5),
    savings: Math.round(1200 + Math.sin(i * 0.2) * 400 + Math.random() * 200),
  })), []);

  const modulePerf = useMemo(() => [
    { module: 'FLOW', score: 90 + Math.round(Math.random() * 9) },
    { module: 'ECO', score: 83 + Math.round(Math.random() * 9) },
    { module: 'SPACE', score: 75 + Math.round(Math.random() * 9) },
    { module: 'GUARD', score: 97 + Math.round(Math.random() * 3) },
    { module: 'MAINTAIN', score: 82 + Math.round(Math.random() * 9) },
    { module: 'FEDERATE', score: 92 + Math.round(Math.random() * 7) },
  ], []);

  const handleGenerate = useCallback(() => {
    if (generating) return;
    setGenerating(true);
    setGenerateProgress(0);
    // Simulate report engine progress
    const steps = [10, 25, 45, 65, 80, 95, 100];
    steps.forEach((p, i) => {
      setTimeout(() => {
        setGenerateProgress(p);
        if (p === 100) {
          setTimeout(() => {
            setGenerating(false);
            setGenerateProgress(0);
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const savedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            // Mark pending as generated, refresh dates
            setReportList(prev => {
              const updated = prev.map(r => ({
                ...r,
                status: 'Generated',
                date: dateStr,
                size: r.size === '—' ? `${(0.8 + Math.random() * 2).toFixed(1)} MB` : r.size,
              }));
              // Save to localStorage
              localStorage.setItem('nexus_reports_list', JSON.stringify(updated));
              localStorage.setItem('nexus_reports_saved', savedTime);
              return updated;
            });
            setLastSaved(savedTime);
          }, 200);
        }
      }, 300 + i * 500);
    });
  }, [generating]);

  const handleExport = useCallback((r: typeof initialReports[0]) => {
    if (r.status !== 'Generated') return;
    const csv = buildCSV(r.type, weeklyData, monthlyTrend);
    const filename = `nexus_${r.type.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(filename, csv, () => {
      setDownloadedReport(r.title);
      setTimeout(() => setDownloadedReport(null), 3000);
    });
  }, [weeklyData, monthlyTrend]);

  const energyBySource = useMemo(() => [
    { name: 'Solar', value: Math.round(110 + Math.random() * 30), color: 'hsl(155,100%,43%)' },
    { name: 'Grid', value: Math.round(260 + Math.random() * 50), color: 'hsl(47,91%,53%)' },
    { name: 'Battery', value: Math.round(35 + Math.random() * 20), color: 'hsl(186,100%,50%)' },
  ], []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-xl font-bold text-foreground tracking-wide">Reports &amp; Analytics</h1>
            {lastSaved && (
              <span className="font-mono text-[8px] text-nexus-green border border-nexus-green/20 px-1.5 py-0.5 uppercase tracking-wider">
                ✓ SAVED {lastSaved}
              </span>
            )}
          </div>
          <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em] mt-1">Generated Intelligence — NEXUS OS</p>
        </div>

        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-4 py-2 border border-accent/20 bg-accent/5 font-mono text-[10px] text-accent uppercase tracking-wider hover:bg-accent/10 transition-all"
          style={{ boxShadow: '0 0 16px hsla(186,100%,50%,0.05)' }}
        >
          <RefreshCw className={`w-3 h-3 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'GENERATING...' : 'RUN REPORT ENGINE'}
        </button>
      </motion.div>

      {/* Generate progress bar */}
      {
        generating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel px-5 py-3 flex items-center gap-4">
            <span className="font-mono text-[9px] text-accent uppercase tracking-wider whitespace-nowrap">Report Engine</span>
            <div className="flex-1 h-1 bg-secondary/30 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: 'hsl(186,100%,50%)', boxShadow: '0 0 6px hsl(186,100%,50%)' }}
                animate={{ width: `${generateProgress}%` }} transition={{ duration: 0.4 }} />
            </div>
            <span className="font-mono text-[9px] text-accent tabular-nums whitespace-nowrap">{generateProgress}%</span>
          </motion.div>
        )
      }

      {/* Download toast */}
      <AnimatePresence>
        {downloadedReport && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 border border-nexus-green/30 bg-nexus-green/5 font-mono text-[10px] text-nexus-green">
            <CheckCircle className="w-3.5 h-3.5" />
            Downloaded: {downloadedReport}
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPIStat icon={<Users className="w-3 h-3" />} label="Avg Daily Footfall" value="1,247" change="+12.4% vs last week" up />
        <KPIStat icon={<Zap className="w-3 h-3" />} label="Energy Saved (Week)" value="351 kWh" change="+8.1% efficiency" up />
        <KPIStat icon={<Shield className="w-3 h-3" />} label="Security Incidents" value="0" change="-100% vs last week" up />
        <KPIStat icon={<Activity className="w-3 h-3" />} label="System Uptime" value="99.98%" change="-0.01% vs target" up={false} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-panel p-5 lg:col-span-2">
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">Weekly Footfall &amp; Energy</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData} barGap={4}>
              <CartesianGrid strokeDasharray="2 6" stroke="hsla(186,100%,50%,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsla(229,24%,52%,0.6)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'hsla(229,24%,52%,0.4)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="footfall" fill="hsla(186, 100%, 50%, 0.35)" radius={[2, 2, 0, 0]} name="Footfall" />
              <Bar dataKey="energy" fill="hsla(155, 100%, 43%, 0.35)" radius={[2, 2, 0, 0]} name="Energy (kWh)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Energy by Source Donut */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-panel p-5">
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">Energy Mix</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={energyBySource} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {energyBySource.map((e, i) => (
                  <Cell key={i} fill={e.color} fillOpacity={0.7} stroke={e.color} strokeWidth={0.5} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(val: number, name) => [`${val} kW`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {energyBySource.map(e => (
              <div key={e.name} className="flex items-center justify-between text-[9px] font-mono">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm" style={{ background: e.color, boxShadow: `0 0 4px ${e.color}` }} />
                  <span className="text-muted-foreground">{e.name}</span>
                </div>
                <span className="text-foreground tabular-nums">{e.value} kW</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Efficiency trend + Module Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-panel p-5 lg:col-span-2">
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">30-Day Efficiency Trend</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(47,91%,53%)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="hsl(47,91%,53%)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 6" stroke="hsla(186,100%,50%,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 8, fill: 'hsla(229,24%,52%,0.4)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 8, fill: 'hsla(229,24%,52%,0.4)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, 'Efficiency']} />
              <Area type="monotone" dataKey="efficiency" stroke="hsl(47, 91%, 53%)" strokeWidth={1.5} fill="url(#effGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Module Performance Radar */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-panel p-5">
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">Module Performance</div>
          <ResponsiveContainer width="100%" height={160}>
            <RadarChart data={modulePerf}>
              <PolarGrid stroke="hsla(186,100%,50%,0.1)" />
              <PolarAngleAxis dataKey="module" tick={{ fontSize: 8, fill: 'hsla(229,24%,52%,0.5)', fontFamily: 'JetBrains Mono' }} />
              <Radar name="Score" dataKey="score" stroke="hsl(186,100%,50%)" fill="hsla(186,100%,50%,0.12)" strokeWidth={1.5}
                dot={{ fill: 'hsl(186,100%,50%)', r: 2, fillOpacity: 0.8 }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}/100`, 'Score']} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Report list */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Generated Reports</div>
          <div className="font-mono text-[9px] text-muted-foreground">{reportList.filter(r => r.status === 'Generated').length} of {reportList.length} ready</div>
        </div>
        <div className="space-y-1">
          {reportList.map((r, i) => {
            const isActive = activeReport === r.title;
            const col = typeColor[r.type] || 'hsl(186,100%,50%)';
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.32 + i * 0.05 }}
                onClick={() => setActiveReport(isActive ? null : r.title)}
                className="flex items-center gap-3 p-3 border cursor-pointer transition-all group"
                style={{
                  borderColor: isActive ? `${col}40` : 'hsla(186,100%,50%,0.06)',
                  background: isActive ? `${col}06` : 'transparent',
                }}
              >
                {/* Type badge */}
                <div className="w-14 shrink-0">
                  <span className="font-mono text-[8px] px-1.5 py-0.5 border uppercase" style={{ color: col, borderColor: `${col}44`, background: `${col}10` }}>
                    {r.type}
                  </span>
                </div>
                {/* Left accent */}
                <div className="w-0.5 h-6 shrink-0" style={{ background: col, boxShadow: isActive ? `0 0 8px ${col}` : 'none', opacity: isActive ? 1 : 0.3 }} />
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[11px] text-foreground truncate">{r.title}</div>
                  <div className="font-mono text-[9px] text-muted-foreground mt-0.5">{r.date} · {r.size}</div>
                </div>
                {/* Status */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border ${r.status === 'Generated'
                    ? 'border-nexus-green/15 text-nexus-green'
                    : 'border-nexus-yellow/15 text-nexus-yellow animate-pulse-glow'
                    }`}>
                    {r.status}
                  </span>
                  {r.status === 'Generated' && (
                    <button
                      onClick={e => { e.stopPropagation(); handleExport(r); }}
                      className="flex items-center gap-1 font-mono text-[8px] text-muted-foreground hover:text-accent transition-colors"
                    >
                      <Download className="w-2.5 h-2.5" />EXPORT
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
