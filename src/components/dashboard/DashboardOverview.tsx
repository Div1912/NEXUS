import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexus } from '@/contexts/NexusContext';
import { getCausalEvents, getModules } from '@/services/mockData';
import KPICard from './KPICard';
import DigitalTwin from './DigitalTwin';
import CausalFeed from './CausalFeed';
import ModuleCard from './ModuleCard';
import CausalGraph from './CausalGraph';
import SystemStatusBar from './SystemStatusBar';
import SimulationBootOverlay from './SimulationBootOverlay';
import type { KPIData } from '@/types/nexus';

// ─── Boot overlay driver ──────────────────────────────────────────────────────
// Shows the overlay on first toggle then removes it; displayedSim tracks
// what the UI is *actually showing* vs what the context says.
const DashboardOverview: React.FC = () => {
  const { simulationActive, presentationMode, live, toggleSimulation } = useNexus();

  // displayedSim: the sim state the UI renders. lags behind simulationActive
  // during the overlay so the outgoing state is stable while the animation plays.
  const [displayedSim, setDisplayedSim] = useState(simulationActive);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayActivating, setOverlayActivating] = useState(true);
  const prevSimRef = useRef(simulationActive);

  useEffect(() => {
    // Only react to *changes* (not initial mount)
    if (simulationActive !== prevSimRef.current) {
      prevSimRef.current = simulationActive;
      setOverlayActivating(simulationActive); // true = booting, false = shutdown
      setShowOverlay(true);
      // displayedSim is intentionally NOT updated here — the overlay plays first
    }
  }, [simulationActive]);

  const handleOverlayComplete = () => {
    // Now flip the UI to the new state and remove overlay
    setDisplayedSim(simulationActive);
    setShowOverlay(false);
  };

  // ── Derived data from shared live ticker ──────────────────────────────────
  const kpis: KPIData[] = [
    {
      id: 'footfall', label: 'Live Footfall', value: live.footfall, unit: '',
      trend: parseFloat(((live.footfallDelta / (live.footfall || 1)) * 100).toFixed(1)),
      confidence: 94,
      sparkline: Array.from({ length: 20 }, (_, i) =>
        live.footfall + Math.sin(i * 0.5 + live.tick * 0.1) * live.footfall * 0.06),
      color: 'nexus-cyan', moduleId: 'flow',
    },
    {
      id: 'energy', label: 'Energy Saved', value: live.energySaved, unit: 'kWh',
      trend: parseFloat((((live.energySaved - 85) / 85) * 100).toFixed(1)),
      confidence: 91,
      sparkline: Array.from({ length: 20 }, (_, i) =>
        live.energySaved + Math.sin(i * 0.4 + live.tick * 0.08) * 12),
      color: 'nexus-green', moduleId: 'eco',
    },
    {
      id: 'alerts', label: 'Active Alerts', value: live.alertCount, unit: '',
      trend: -15, confidence: 97,
      sparkline: Array.from({ length: 20 }, () => Math.max(0, live.alertCount + (Math.random() - 0.5) * 2)),
      color: 'nexus-yellow', moduleId: 'guard',
    },
    {
      id: 'latency', label: 'Avg Latency', value: live.avgLatency, unit: 'ms',
      trend: -5, confidence: 99,
      sparkline: Array.from({ length: 20 }, (_, i) =>
        live.avgLatency + Math.sin(i * 0.6 + live.tick * 0.12) * 0.5),
      color: 'nexus-red', moduleId: 'maintain',
    },
  ];

  const events = getCausalEvents(simulationActive);
  const modules = getModules(simulationActive);
  const patchedModules = modules.map(m => {
    if (m.id === 'flow') return { ...m, primaryMetric: { label: 'Footfall', value: live.footfall, unit: '/hr' } };
    if (m.id === 'eco') return { ...m, primaryMetric: { label: 'Consumption', value: live.netConsumption, unit: 'kW' } };
    return m;
  });

  return (
    <>
      {/* ── Cinematic overlay on toggle ── */}
      <AnimatePresence>
        {showOverlay && (
          <SimulationBootOverlay
            activating={overlayActivating}
            onComplete={handleOverlayComplete}
          />
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <SystemStatusBar />

        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wide">COMMAND CENTER</h2>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em]">Real-time campus intelligence</p>
          </div>
          <AnimatePresence mode="wait">
            {displayedSim ? (
              <motion.div
                key="active"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 border border-nexus-alert/40 px-3 py-1.5 bg-nexus-alert/5"
                style={{ boxShadow: '0 0 16px hsla(0,100%,68%,0.1)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-nexus-alert animate-pulse"
                  style={{ boxShadow: '0 0 8px hsl(0,100%,68%)' }} />
                <span className="text-[10px] font-mono text-nexus-alert uppercase tracking-wider">SIMULATION ACTIVE</span>
              </motion.div>
            ) : (
              <motion.div
                key="standby"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 border border-border/30 px-3 py-1.5 bg-secondary/20"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse" />
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">STANDBY</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── IDLE / STANDBY STATE ─────────────────────────── */}
        <AnimatePresence mode="wait">
          {!displayedSim && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="glass-panel p-12 flex flex-col items-center justify-center text-center space-y-6"
              style={{ minHeight: 340 }}
            >
              {/* Concentric standby rings */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-accent/10 animate-spin" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-2 rounded-full border border-border/20" />
                <div className="absolute inset-4 rounded-full border border-border/10" />
                <div className="w-4 h-4 rounded-full bg-muted-foreground/20 animate-pulse" />
              </div>

              <div>
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-2">
                  NEXUS OS v4.2 — System Standby
                </div>
                <p className="text-muted-foreground/50 text-sm max-w-sm">
                  All modules are idle. Activate simulation to start live campus intelligence.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 32px hsla(186,100%,50%,0.2)' }}
                whileTap={{ scale: 0.97 }}
                onClick={toggleSimulation}
                className="flex items-center gap-3 px-8 py-3 border border-accent/30 bg-accent/5 font-mono text-[11px] text-accent uppercase tracking-widest hover:bg-accent/10 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                ACTIVATE SIMULATION
              </motion.button>

              {/* Greyed KPI placeholders */}
              <div className="grid grid-cols-4 gap-8 mt-2 opacity-20 pointer-events-none">
                {['FOOTFALL', 'ENERGY SAVED', 'ALERTS', 'LATENCY'].map(l => (
                  <div key={l} className="text-center">
                    <div className="font-mono text-2xl font-bold text-foreground tabular-nums">—</div>
                    <div className="font-mono text-[8px] text-muted-foreground uppercase tracking-wider mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── LIVE STATE ────────────────────────────────────── */}
          {displayedSim && (
            <motion.div
              key="live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Row 1 — KPI Cards, staggered entry */}
              <div className={`grid gap-3 ${presentationMode ? 'grid-cols-2' : 'grid-cols-2 xl:grid-cols-4'}`}>
                {kpis.map((k, i) => (
                  <motion.div
                    key={k.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.05 * i, duration: 0.35 }}
                  >
                    <KPICard data={k} index={i} presentationMode={presentationMode} />
                  </motion.div>
                ))}
              </div>

              {/* Row 2 — Digital Twin + Causal Feed */}
              <div className={`grid gap-4 ${presentationMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-5'}`}>
                <motion.div
                  className={presentationMode ? '' : 'lg:col-span-3'}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <DigitalTwin presentationMode={presentationMode} />
                </motion.div>
                {!presentationMode && (
                  <motion.div
                    className="lg:col-span-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                  >
                    <CausalFeed events={events} />
                  </motion.div>
                )}
              </div>

              {/* Row 3 — Module Cards */}
              {!presentationMode && (
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-mono mb-3">Active Modules</div>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {patchedModules.map((m, i) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
                      >
                        <ModuleCard module={m} index={i} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Row 4 — Causal Graph */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <CausalGraph presentationMode={presentationMode} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default DashboardOverview;
