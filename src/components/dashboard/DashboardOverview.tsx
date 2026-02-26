import React from 'react';
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
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((m, i) => (
            <ModuleCard key={m.id} module={m} index={i} />
          ))}
        </div>
      )}

      {/* Row 4 — Causal Graph */}
      <CausalGraph presentationMode={presentationMode} />
    </div>
  );
};

export default DashboardOverview;
