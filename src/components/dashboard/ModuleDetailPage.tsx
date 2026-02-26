import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { useNexus } from '@/contexts/NexusContext';
import { getModules, getFlowChartData } from '@/services/mockData';

const moduleMetrics: Record<string, { cards: { label: string; value: string; sub: string }[]; }> = {
  flow: {
    cards: [
      { label: 'Live Footfall', value: '1,247', sub: '/hr' },
      { label: 'Gate Status', value: '4/4', sub: 'Active' },
      { label: 'Shuttle ETA', value: '3', sub: 'min' },
    ],
  },
  eco: {
    cards: [
      { label: 'Consumption', value: '456', sub: 'kW' },
      { label: 'Solar Output', value: '124', sub: 'kW' },
      { label: 'Grid Load', value: '67', sub: '%' },
    ],
  },
  space: {
    cards: [
      { label: 'Occupancy', value: '62', sub: '%' },
      { label: 'Rooms Available', value: '12/30', sub: '' },
      { label: 'Avg Density', value: 'Normal', sub: '' },
    ],
  },
  maintain: {
    cards: [
      { label: 'Health Score', value: '94', sub: '%' },
      { label: 'Tasks Pending', value: '3', sub: '' },
      { label: 'MTBF', value: '720', sub: 'hrs' },
    ],
  },
  guard: {
    cards: [
      { label: 'Threat Level', value: '0', sub: '' },
      { label: 'Cameras Online', value: '48/48', sub: '' },
      { label: 'Perimeter', value: 'Secure', sub: '' },
    ],
  },
  federate: {
    cards: [
      { label: 'Nodes Synced', value: '6/6', sub: '' },
      { label: 'Latency', value: '2.1', sub: 'ms' },
      { label: 'Bandwidth', value: '94', sub: '%' },
    ],
  },
};

const suggestions = [
  'Reroute Gate B traffic to Gate C',
  'Pre-cool HVAC Zone 3',
  'Deploy additional shuttle',
  'Notify security team',
  'Escalate to maintenance',
];

const ModuleDetailPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { simulationActive } = useNexus();
  const modules = getModules(simulationActive);
  const mod = modules.find(m => m.id === moduleId);
  const metrics = moduleMetrics[moduleId || 'flow'] || moduleMetrics.flow;
  const chartData = useMemo(() => getFlowChartData(simulationActive), [simulationActive]);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  if (!mod) return <div className="text-foreground p-8">Module not found.</div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-foreground">{mod.fullName}</h1>
      </motion.div>

      {/* Top metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="nexus-card p-5"
          >
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{c.label}</div>
            <div className="flex items-end gap-2">
              <span className="font-mono text-3xl font-bold text-foreground">{c.value}</span>
              {c.sub && <span className="text-sm text-muted-foreground mb-1">{c.sub}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="nexus-card p-5"
      >
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">60-Minute Rolling Window</div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.06)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#8890B5' }} interval={9} />
            <YAxis tick={{ fontSize: 10, fill: '#8890B5' }} />
            <Tooltip
              contentStyle={{ background: '#0D0F26', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#8890B5' }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="entry" stroke="#00E5FF" strokeWidth={2} dot={false} name="Entry" />
            <Line type="monotone" dataKey="exit" stroke="#ED1C24" strokeWidth={2} dot={false} name="Exit" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Suggested Actions */}
      <div className="nexus-card p-5">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Suggested Actions</div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => setSelectedAction(s)}
              className={`text-xs px-4 py-2 rounded-full border transition-colors ${
                selectedAction === s
                  ? 'bg-accent/20 border-accent text-accent'
                  : 'border-border text-muted-foreground hover:border-accent/50 hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {selectedAction && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-xs text-nexus-green">
            ✓ Action logged: "{selectedAction}" — Added to causal event feed.
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetailPage;
