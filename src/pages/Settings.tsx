import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { useNexus } from '@/contexts/NexusContext';

const settingSections = [
  {
    title: 'System',
    items: [
      { key: 'highContrast', label: 'High Contrast UI', desc: 'Increase brightness of cyan/red borders and telemetry text', default: false, contextual: true },
      { key: 'animations', label: 'Animations', desc: 'Enable UI animations and transitions', default: true },
      { key: 'sounds', label: 'Alert Sounds', desc: 'Play sounds on critical alerts', default: false },
    ],
  },
  {
    title: 'AI & Automation',
    items: [
      { key: 'autoActions', label: 'Autonomous Actions', desc: 'Allow AI to execute low-risk actions automatically', default: true },
      { key: 'causalAlerts', label: 'Causal Chain Alerts', desc: 'Notify when new causal chains are detected', default: true },
      { key: 'predictive', label: 'Predictive Mode', desc: 'Enable predictive maintenance scheduling', default: true },
    ],
  },
  {
    title: 'Edge Network',
    items: [
      { key: 'edgeSync', label: 'Auto Sync', desc: 'Automatically synchronize across edge nodes', default: true },
      { key: 'lowPower', label: 'Low Power Mode', desc: 'Reduce processing to conserve energy', default: false },
    ],
  },
];

const Settings: React.FC = () => {
  const { simulationActive, toggleSimulation, highContrast, toggleHighContrast } = useNexus();
  const [values, setValues] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    settingSections.forEach(s => s.items.forEach(i => { init[i.key] = i.default; }));
    return init;
  });
  const [saved, setSaved] = useState(false);

  const handleToggle = (key: string, val: boolean) => {
    if (key === 'highContrast') {
      toggleHighContrast();
      return;
    }
    setValues(prev => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-xl font-bold text-foreground tracking-wide">Settings</h1>
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em] mt-1">System Configuration</p>
      </motion.div>

      {/* Runtime Controls */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-panel p-5">
        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">Runtime Controls</div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-foreground">Simulation Mode</div>
              <div className="text-[10px] text-muted-foreground font-mono">Trigger 500-person mass ingress event across all modules</div>
            </div>
            <div className="flex items-center gap-2">
              {simulationActive && <span className="font-mono text-[9px] text-nexus-alert animate-pulse-glow">ACTIVE</span>}
              <Switch checked={simulationActive} onCheckedChange={toggleSimulation} />
            </div>
          </div>
        </div>
      </motion.div>

      {settingSections.map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + si * 0.05 }}
          className="glass-panel p-5"
        >
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">{section.title}</div>
          <div className="space-y-4">
            {section.items.map(item => {
              const isContextual = (item as any).contextual;
              const checked = isContextual && item.key === 'highContrast' ? highContrast : values[item.key];
              return (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">{item.label}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{item.desc}</div>
                  </div>
                  <Switch
                    checked={checked}
                    onCheckedChange={(v) => handleToggle(item.key, v)}
                  />
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-panel p-5">
        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">Campus Configuration</div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Campus Name', value: 'Campus Alpha' },
            { label: 'Edge Nodes', value: '6 Active' },
            { label: 'AI Model Version', value: 'v2.4.1-edge' },
            { label: 'Last Calibration', value: '2 hrs ago' },
          ].map(c => (
            <div key={c.label}>
              <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-1">{c.label}</div>
              <div className="font-mono text-sm text-foreground">{c.value}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex gap-3">
        <button onClick={handleSave} className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-[10px] uppercase tracking-widest transition-all">
          Save Configuration
        </button>
        {saved && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[10px] text-nexus-green self-center">
            ✓ Configuration saved
          </motion.span>
        )}
      </div>
    </div>
  );
};

export default Settings;
