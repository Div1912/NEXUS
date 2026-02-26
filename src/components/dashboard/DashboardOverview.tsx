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
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Command Center</h2>
          <p className="text-xs text-muted-foreground">Real-time campus intelligence</p>
        </div>
        {simulationActive && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 bg-nexus-alert/10 border border-nexus-alert/30 rounded-lg px-3 py-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-nexus-alert animate-pulse-glow" />
            <span className="text-xs font-mono text-nexus-alert">SIMULATION ACTIVE</span>
          </motion.div>
        )}
      </motion.div>

      {/* Row 1 — KPIs */}
      <div className={`grid gap-4 ${presentationMode ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'}`}>
        {kpis.map((k, i) => (
          <KPICard key={k.id} data={k} index={i} presentationMode={presentationMode} />
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
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Active Modules</div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
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
