import React from 'react';
import { motion } from 'framer-motion';
import { useNexus } from '@/contexts/NexusContext';
import { getKPIs, getCausalEvents, getModules } from '@/services/mockData';
import KPICard from './KPICard';
import DigitalTwin from './DigitalTwin';
import CausalFeed from './CausalFeed';
import ModuleCard from './ModuleCard';
import CausalGraph from './CausalGraph';

const DashboardOverview: React.FC = () => {
  const { simulationActive, presentationMode } = useNexus();
  const kpis = getKPIs(simulationActive);
  const events = getCausalEvents(simulationActive);
  const modules = getModules(simulationActive);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground tracking-wide">COMMAND CENTER</h2>
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em]">Real-time campus intelligence</p>
        </div>
        {simulationActive && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 border border-nexus-alert/30 px-3 py-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-nexus-alert animate-pulse-glow" />
            <span className="text-[10px] font-mono text-nexus-alert uppercase tracking-wider">SIMULATION ACTIVE</span>
          </motion.div>
        )}
      </motion.div>

      {/* Row 1 — KPIs as telemetry strip */}
      <div className="flex items-start gap-0">
        {kpis.map((k, i) => (
          <React.Fragment key={k.id}>
            <div className={presentationMode ? 'flex-1' : 'flex-1'}>
              <KPICard data={k} index={i} presentationMode={presentationMode} />
            </div>
            {i < kpis.length - 1 && (
              <div className="w-px self-stretch bg-accent/10 mx-4 mt-2" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Row 2 — Digital Twin + Causal Feed */}
      <div className={`grid gap-4 ${presentationMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-5'}`}>
        <div className={presentationMode ? '' : 'lg:col-span-3'}>
          <DigitalTwin presentationMode={presentationMode} />
        </div>
        {!presentationMode && (
          <div className="lg:col-span-2">
            <CausalFeed events={events} />
          </div>
        )}
      </div>

      {/* Row 3 — Module Cards */}
      {!presentationMode && (
        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-mono mb-3">Active Modules</div>
          <div className="grid gap-px grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 bg-accent/5">
            {modules.map((m, i) => (
              <ModuleCard key={m.id} module={m} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Row 4 — Causal Graph */}
      <CausalGraph presentationMode={presentationMode} />
    </div>
  );
};

export default DashboardOverview;
