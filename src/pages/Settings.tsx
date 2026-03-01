import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { useNexus } from '@/contexts/NexusContext';
import { Activity, Shield, Zap, Globe, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';

// ── Notification toast
const Toast: React.FC<{ msg: string; type: 'success' | 'info' | 'warn'; onDone: () => void }> = ({ msg, type, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  const colors = { success: 'border-nexus-green/30 bg-nexus-green/5 text-nexus-green', info: 'border-accent/30 bg-accent/5 text-accent', warn: 'border-nexus-yellow/30 bg-nexus-yellow/5 text-nexus-yellow' };
  const icons = { success: <CheckCircle className="w-3.5 h-3.5" />, info: <Info className="w-3.5 h-3.5" />, warn: <AlertTriangle className="w-3.5 h-3.5" /> };
  return (
    <motion.div initial={{ opacity: 0, y: -8, x: 10 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, y: -8 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 border font-mono text-[10px] shadow-lg ${colors[type]}`}
      style={{ minWidth: 260 }}>
      {icons[type]}
      {msg}
    </motion.div>
  );
};

// Effects map: what actually happens on toggle
const TOGGLE_EFFECTS: Record<string, { on: string; off: string; type: 'success' | 'info' | 'warn' }> = {
  highContrast: { on: 'High Contrast mode enabled — borders boosted', off: 'High Contrast mode disabled', type: 'info' },
  animations: { on: 'Animations enabled — smooth transitions active', off: 'Animations disabled — static mode', type: 'info' },
  sounds: { on: 'Alert sounds enabled — testing beep...', off: 'Alert sounds disabled', type: 'info' },
  autoActions: { on: 'Autonomous AI actions enabled — causal engine armed', off: 'Autonomous actions paused — manual mode only', type: 'warn' },
  causalAlerts: { on: 'Causal chain alerts active — events will push notifications', off: 'Causal alerts suppressed', type: 'info' },
  predictive: { on: 'Predictive maintenance enabled — AI monitoring assets', off: 'Predictive mode disabled', type: 'warn' },
  edgeSync: { on: 'Auto-sync enabled — nodes will sync every 30s', off: 'Auto-sync disabled — manual sync required', type: 'info' },
  lowPower: { on: 'Low power mode ON — CPU throttled, dims inactive panels', off: 'Low power mode OFF — full performance restored', type: 'warn' },
};

const settingSections = [
  {
    title: 'System', icon: <Activity className="w-3 h-3" />,
    items: [
      { key: 'lightMode', label: 'Light Mode', desc: 'Switch to light theme — works alongside dark/neon modes', default: false },
      { key: 'highContrast', label: 'High Contrast UI', desc: 'Boosts border brightness and telemetry text', default: false },
      { key: 'animations', label: 'UI Animations', desc: 'Framer motion transitions and micro-animations', default: true },
      { key: 'sounds', label: 'Alert Sounds', desc: 'Audio cues on critical system alerts', default: false },
    ],

  },
  {
    title: 'AI & Automation', icon: <Zap className="w-3 h-3" />,
    items: [
      { key: 'autoActions', label: 'Autonomous Actions', desc: 'AI executes low-risk causal actions automatically', default: true },
      { key: 'causalAlerts', label: 'Causal Chain Alerts', desc: 'Push notifications for new causal event chains', default: true },
      { key: 'predictive', label: 'Predictive Mode', desc: 'ML-based maintenance scheduling and forecasting', default: true },
    ],
  },
  {
    title: 'Edge Network', icon: <Globe className="w-3 h-3" />,
    items: [
      { key: 'edgeSync', label: 'Auto Node Sync', desc: 'Sync all edge nodes every 30 seconds', default: true },
      { key: 'lowPower', label: 'Low Power Mode', desc: 'Throttle CPU, dim inactive panels, reduce polling', default: false },
    ],
  },
];

const Settings: React.FC = () => {
  const { simulationActive, toggleSimulation, highContrast, toggleHighContrast, lightMode, toggleLightMode } = useNexus();
  const [values, setValues] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    settingSections.forEach(s => s.items.forEach(i => { init[i.key] = i.default; }));
    return { ...init, highContrast };
  });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'warn' } | null>(null);
  const [saved, setSaved] = useState(false);
  const [calibrating, setCalibrating] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [nodesPinging, setNodesPinging] = useState(false);
  const [pingResults, setPingResults] = useState<Array<{ node: string; ms: number; ok: boolean }>>([]);
  const [campusName, setCampusName] = useState('Campus Alpha');
  const [editingName, setEditingName] = useState(false);

  const showToast = (msg: string, type: 'success' | 'info' | 'warn' = 'info') => {
    setToast({ msg, type });
  };

  const handleToggle = (key: string, val: boolean) => {
    if (key === 'highContrast') {
      toggleHighContrast();
    } else if (key === 'lightMode') {
      toggleLightMode();
      showToast(val ? 'Light Mode activated' : 'Dark Mode activated', 'info');
    } else if (key === 'lowPower' && val) {
      document.documentElement.style.filter = 'brightness(0.85)';

    } else if (key === 'lowPower' && !val) {
      document.documentElement.style.filter = '';
    } else if (key === 'sounds' && val) {
      // Actually play a brief beep
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 880; gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(); osc.stop(ctx.currentTime + 0.3);
      } catch { /* no audio context */ }
    }
    setValues(prev => ({ ...prev, [key]: val }));
    setSaved(false);
    const effect = TOGGLE_EFFECTS[key];
    if (effect) showToast(val ? effect.on : effect.off, effect.type);
  };

  const handleSave = () => {
    setSaved(true);
    showToast('Configuration saved to edge node registry', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCalibrate = () => {
    setCalibrating(true);
    showToast('AI model calibration started — ETA 8s', 'info');
    setTimeout(() => {
      setCalibrating(false);
      showToast('Calibration complete — drift corrected ±0.3%', 'success');
    }, 8000);
  };

  const handlePingNodes = () => {
    setNodesPinging(true);
    setPingResults([]);
    const nodes = ['N1-Main', 'N2-Lab', 'N3-Sports', 'N4-Library', 'N5-Science', 'N6-Gate'];
    nodes.forEach((node, i) => {
      setTimeout(() => {
        const ms = Math.round(0.8 + Math.random() * 3.5);
        const ok = Math.random() > 0.05;
        setPingResults(prev => [...prev, { node, ms, ok }]);
        if (i === nodes.length - 1) setNodesPinging(false);
      }, 400 + i * 350);
    });
  };

  const handleReset = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      showToast('Click CONFIRM RESET again to factory reset all settings', 'warn');
      setTimeout(() => setResetConfirm(false), 5000);
      return;
    }
    const defaults: Record<string, boolean> = {};
    settingSections.forEach(s => s.items.forEach(i => { defaults[i.key] = i.default; }));
    setValues(defaults);
    document.documentElement.style.filter = '';
    setResetConfirm(false);
    showToast('All settings reset to factory defaults', 'success');
  };

  const checkedVal = (key: string) => key === 'highContrast' ? highContrast : values[key];

  return (
    <div className="space-y-6 max-w-3xl">
      <AnimatePresence>
        {toast && <Toast key={toast.msg} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-xl font-bold text-foreground tracking-wide">Settings</h1>
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em] mt-1">System Configuration — NEXUS OS v2.4.1</p>
      </motion.div>

      {/* Runtime Controls */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-panel p-5">
        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Shield className="w-3 h-3 text-accent" />Runtime Controls
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground">Simulation Mode</div>
            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
              Triggers 500-person mass ingress event — affects all module KPIs live
            </div>
          </div>
          <div className="flex items-center gap-3">
            {simulationActive && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[9px] text-nexus-alert animate-pulse-glow">● ACTIVE</motion.span>
            )}
            <Switch checked={simulationActive} onCheckedChange={() => {
              toggleSimulation();
              showToast(simulationActive ? 'Simulation deactivated — returning to normal mode' : 'Simulation ACTIVE — mass ingress event triggered!', simulationActive ? 'info' : 'warn');
            }} />
          </div>
        </div>
      </motion.div>

      {/* Setting sections */}
      {settingSections.map((section, si) => (
        <motion.div key={section.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + si * 0.05 }} className="glass-panel p-5">
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <span className="text-accent">{section.icon}</span>{section.title}
          </div>
          <div className="space-y-4">
            {section.items.map(item => (
              <div key={item.key} className="flex items-center justify-between group">
                <div className="flex-1 pr-4">
                  <div className="text-sm font-medium text-foreground">{item.label}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{item.desc}</div>
                  {/* Show live state indicator */}
                  {checkedVal(item.key) && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="w-1 h-1 rounded-full bg-nexus-green" style={{ boxShadow: '0 0 3px hsl(155,100%,43%)' }} />
                      <span className="font-mono text-[8px] text-nexus-green uppercase">active</span>
                    </div>
                  )}
                </div>
                <Switch checked={checkedVal(item.key)} onCheckedChange={v => handleToggle(item.key, v)} />
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Campus Configuration */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-panel p-5">
        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">Campus Configuration</div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Campus Name</div>
            {editingName ? (
              <input
                className="font-mono text-sm text-foreground bg-transparent border-b border-accent/30 outline-none w-full"
                value={campusName}
                onChange={e => setCampusName(e.target.value)}
                onBlur={() => { setEditingName(false); showToast(`Campus renamed to "${campusName}"`, 'success'); }}
                onKeyDown={e => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                autoFocus
              />
            ) : (
              <button className="font-mono text-sm text-foreground hover:text-accent transition-colors text-left" onClick={() => setEditingName(true)}>
                {campusName} <span className="text-[9px] text-muted-foreground ml-1">[edit]</span>
              </button>
            )}
          </div>
          {[
            { label: 'Edge Nodes', value: '6 Active' },
            { label: 'AI Model Version', value: 'v2.4.1-edge' },
            { label: 'Last Calibration', value: calibrating ? 'Running...' : '2 hrs ago' },
          ].map(c => (
            <div key={c.label}>
              <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-1">{c.label}</div>
              <div className="font-mono text-sm text-foreground">{c.value}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Node Ping panel */}
      {pingResults.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-5">
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3">Node Ping Results</div>
          <div className="grid grid-cols-3 gap-2">
            {pingResults.map(r => (
              <div key={r.node} className="flex items-center justify-between p-2 border text-[9px] font-mono"
                style={{ borderColor: r.ok ? 'hsla(155,100%,43%,0.2)' : 'hsla(0,100%,68%,0.3)', background: r.ok ? 'hsla(155,100%,43%,0.04)' : 'hsla(0,100%,68%,0.04)' }}>
                <span style={{ color: r.ok ? 'hsl(155,100%,43%)' : 'hsl(0,100%,68%)' }}>{r.ok ? '●' : '✗'} {r.node}</span>
                <span className="text-muted-foreground tabular-nums">{r.ok ? `${r.ms}ms` : 'TIMEOUT'}</span>
              </div>
            ))}
            {nodesPinging && (
              <div className="flex items-center gap-1 p-2 text-[9px] font-mono text-accent col-span-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                Pinging remaining nodes...
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button onClick={handleSave} className="px-5 py-2 border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent font-mono text-[10px] uppercase tracking-widest transition-all">
          {saved ? '✓ Saved' : 'Save Configuration'}
        </button>
        <button onClick={handleCalibrate} disabled={calibrating}
          className="px-5 py-2 border border-nexus-green/20 bg-nexus-green/5 hover:bg-nexus-green/10 text-nexus-green font-mono text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50">
          <RefreshCw className={`w-3 h-3 ${calibrating ? 'animate-spin' : ''}`} />
          {calibrating ? 'Calibrating...' : 'Calibrate AI Model'}
        </button>
        <button onClick={handlePingNodes} disabled={nodesPinging}
          className="px-5 py-2 border border-accent/15 bg-secondary/10 hover:bg-secondary/20 text-muted-foreground font-mono text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
          <Activity className="w-3 h-3" />
          {nodesPinging ? 'Pinging...' : 'Ping All Nodes'}
        </button>
        <button onClick={handleReset}
          className={`px-5 py-2 border font-mono text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${resetConfirm ? 'border-nexus-alert/50 bg-nexus-alert/10 text-nexus-alert' : 'border-nexus-alert/20 text-muted-foreground hover:text-nexus-alert'}`}>
          <AlertTriangle className="w-3 h-3" />
          {resetConfirm ? 'Confirm Reset !' : 'Factory Reset'}
        </button>
      </div>
    </div>
  );
};

export default Settings;
