import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const settingSections = [
  {
    title: 'System',
    items: [
      { key: 'darkMode', label: 'Dark Mode', desc: 'Use dark theme across the interface', default: true },
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
  const [values, setValues] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    settingSections.forEach(s => s.items.forEach(i => { init[i.key] = i.default; }));
    return init;
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl font-bold text-foreground">
        Settings
      </motion.h1>

      {settingSections.map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.1 }}
          className="nexus-card p-5"
        >
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">{section.title}</div>
          <div className="space-y-4">
            {section.items.map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
                <Switch
                  checked={values[item.key]}
                  onCheckedChange={(v) => setValues(prev => ({ ...prev, [item.key]: v }))}
                />
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="nexus-card p-5">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Campus Configuration</div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground text-xs mb-1">Campus Name</div>
            <div className="font-mono text-foreground">Campus Alpha</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs mb-1">Edge Nodes</div>
            <div className="font-mono text-foreground">6 Active</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs mb-1">AI Model Version</div>
            <div className="font-mono text-foreground">v2.4.1-edge</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs mb-1">Last Calibration</div>
            <div className="font-mono text-foreground">2 hrs ago</div>
          </div>
        </div>
        <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
          Recalibrate System
        </Button>
      </motion.div>
    </div>
  );
};

export default Settings;
