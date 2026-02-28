import type { KPIData, CausalEvent, ModuleData, BuildingNode, CausalGraphNode, CausalGraphEdge, EdgeStatus } from '@/types/nexus';

const jitter = (val: number, pct: number) => val + (Math.random() - 0.5) * 2 * val * pct;

const sparkline = (base: number, variance: number, len = 20): number[] =>
  Array.from({ length: len }, () => base + (Math.random() - 0.5) * variance);

export const getKPIs = (simActive = false): KPIData[] => {
  const base = simActive ? 2743 : 1247;
  const footfall = Math.round(jitter(base, 0.04));
  const energyBase = simActive ? 239 : 342;
  return [
    { id: 'footfall', label: 'Live Footfall', value: Math.round(jitter(footfall, 0.02)), unit: '', trend: +(jitter(simActive ? 118 : 12, 0.15)).toFixed(1), confidence: Math.round(jitter(94, 0.02)), sparkline: sparkline(footfall, footfall * 0.15), color: 'nexus-cyan', moduleId: 'flow' },
    { id: 'energy', label: 'Energy Saved', value: Math.round(jitter(energyBase, 0.05)), unit: 'kWh', trend: +(jitter(simActive ? -8 : 18, 0.2)).toFixed(1), confidence: Math.round(jitter(91, 0.02)), sparkline: sparkline(energyBase, energyBase * 0.12), color: 'nexus-green', moduleId: 'eco' },
    { id: 'alerts', label: 'Active Alerts', value: Math.round(jitter(simActive ? 7 : 2, 0.3)), unit: '', trend: +(jitter(simActive ? 250 : -15, 0.1)).toFixed(1), confidence: Math.round(jitter(97, 0.01)), sparkline: sparkline(simActive ? 7 : 2, 3), color: 'nexus-yellow', moduleId: 'guard' },
    { id: 'latency', label: 'Avg Latency', value: +(jitter(simActive ? 4.2 : 2.8, 0.08)).toFixed(1), unit: 'ms', trend: +(jitter(simActive ? 50 : -5, 0.15)).toFixed(1), confidence: Math.round(jitter(99, 0.005)), sparkline: sparkline(simActive ? 4.2 : 2.8, 1.5), color: 'nexus-red', moduleId: 'maintain' },
  ];
};

export const getCausalEvents = (simActive = false): CausalEvent[] => {
  const events: CausalEvent[] = [
    { id: '1', timestamp: new Date(), title: 'Footfall Spike Detected', cause: 'Gate B surge +40%', effect: 'HVAC Zone 3 preemptive cooling', action: 'Auto-adjusted', severity: 'info', moduleId: 'flow' },
    { id: '2', timestamp: new Date(Date.now() - 60000), title: 'Bin Fill Rate Acceleration', cause: 'Cafeteria footfall +25%', effect: 'Collection route re-optimized', action: 'Dispatched', severity: 'warning', moduleId: 'maintain' },
    { id: '3', timestamp: new Date(Date.now() - 120000), title: 'Energy Anomaly Resolved', cause: 'HVAC Zone 1 overcooling', effect: 'Reduced 12kWh waste', action: 'Corrected', severity: 'info', moduleId: 'eco' },
    { id: '4', timestamp: new Date(Date.now() - 180000), title: 'Perimeter Alert Cleared', cause: 'Motion sensor Zone D', effect: 'Camera verified — wildlife', action: 'Dismissed', severity: 'info', moduleId: 'guard' },
  ];
  if (simActive) {
    events.unshift(
      { id: 's1', timestamp: new Date(), title: '⚠ Simulation: Mass Ingress', cause: '500 person event triggered', effect: 'All modules responding', action: 'Autonomous', severity: 'critical', moduleId: 'flow' },
      { id: 's2', timestamp: new Date(), title: 'HVAC Emergency Ramp', cause: 'Thermal load +300%', effect: 'All chillers activated', action: 'Auto-scaled', severity: 'critical', moduleId: 'eco' },
    );
  }
  return events;
};

export const getModules = (simActive = false): ModuleData[] => {
  const footfall = Math.round(jitter(simActive ? 2743 : 1247, 0.04));
  const consumption = Math.round(jitter(simActive ? 890 : 456, 0.05));
  const occupancy = Math.round(jitter(simActive ? 89 : 62, 0.06));
  return [
    { id: 'flow', name: 'FLOW', fullName: 'NEXUS FLOW — Smart Mobility', status: simActive ? 'warning' : 'online', primaryMetric: { label: 'Footfall', value: footfall, unit: '/hr' }, sparkline: sparkline(footfall, footfall * 0.2), subMetrics: [{ label: 'Gates Active', value: '4/4' }, { label: 'Shuttle ETA', value: `${Math.round(jitter(3, 0.3))} min` }], alertCount: simActive ? Math.round(jitter(2, 0.4)) : 0 },
    { id: 'eco', name: 'ECO', fullName: 'NEXUS ECO — Energy Intelligence', status: simActive ? 'alert' : 'online', primaryMetric: { label: 'Consumption', value: consumption, unit: 'kW' }, sparkline: sparkline(consumption, consumption * 0.15), subMetrics: [{ label: 'Solar Output', value: `${Math.round(jitter(124, 0.08))} kW` }, { label: 'Grid Load', value: `${Math.round(jitter(67, 0.06))}%` }], alertCount: simActive ? Math.round(jitter(3, 0.3)) : 0 },
    { id: 'space', name: 'SPACE', fullName: 'NEXUS SPACE — Spatial Intelligence', status: 'online', primaryMetric: { label: 'Occupancy', value: occupancy, unit: '%' }, sparkline: sparkline(occupancy, 15), subMetrics: [{ label: 'Rooms Available', value: `${Math.round(jitter(12, 0.15))}/30` }, { label: 'Density', value: occupancy > 75 ? 'High' : 'Normal' }], alertCount: 0 },
    { id: 'maintain', name: 'MAINTAIN', fullName: 'NEXUS MAINTAIN — Predictive Maintenance', status: 'online', primaryMetric: { label: 'Health Score', value: Math.round(jitter(94, 0.02)), unit: '%' }, sparkline: sparkline(94, 5), subMetrics: [{ label: 'Tasks Pending', value: `${Math.round(jitter(3, 0.3))}` }, { label: 'MTBF', value: `${Math.round(jitter(720, 0.03))} hrs` }], alertCount: 0 },
    { id: 'guard', name: 'GUARD', fullName: 'NEXUS GUARD — Safety & Security', status: simActive ? 'warning' : 'online', primaryMetric: { label: 'Threat Level', value: simActive ? Math.round(jitter(3, 0.3)) : 0, unit: '' }, sparkline: sparkline(simActive ? 3 : 0, 1), subMetrics: [{ label: 'Cameras Online', value: '48/48' }, { label: 'Perimeter', value: 'Secure' }], alertCount: simActive ? 1 : 0 },
    { id: 'federate', name: 'FEDERATE', fullName: 'NEXUS FEDERATE — Edge Federation', status: 'online', primaryMetric: { label: 'Nodes Synced', value: 6, unit: '/6' }, sparkline: sparkline(6, 0.5), subMetrics: [{ label: 'Latency', value: `${jitter(2.1, 0.1).toFixed(1)} ms` }, { label: 'Bandwidth', value: `${Math.round(jitter(94, 0.03))}%` }], alertCount: 0 },
  ];
};

export const getBuildingNodes = (): BuildingNode[] => [
  { id: 'b1', name: 'Main Hall', x: 200, y: 120, status: 'healthy', metrics: [{ label: 'Occupancy', value: '72%' }, { label: 'Temp', value: '22°C' }] },
  { id: 'b2', name: 'Science Block', x: 380, y: 80, status: 'healthy', metrics: [{ label: 'Lab Active', value: '3/5' }, { label: 'Power', value: '45 kW' }] },
  { id: 'b3', name: 'Cafeteria', x: 300, y: 220, status: 'warning', metrics: [{ label: 'Queue', value: '12 min' }, { label: 'Bins', value: '78%' }] },
  { id: 'b4', name: 'Library', x: 120, y: 200, status: 'healthy', metrics: [{ label: 'Seats Used', value: '156/200' }, { label: 'Noise', value: 'Low' }] },
  { id: 'b5', name: 'Sports Complex', x: 450, y: 200, status: 'healthy', metrics: [{ label: 'Courts Active', value: '2/4' }, { label: 'Pool', value: 'Open' }] },
];

export const getCausalGraphData = (): { nodes: CausalGraphNode[]; edges: CausalGraphEdge[] } => ({
  nodes: [
    { id: 'footfall', label: 'Footfall', x: 100, y: 150, active: false },
    { id: 'binfill', label: 'Bin Fill', x: 300, y: 50, active: false },
    { id: 'hvac', label: 'HVAC', x: 300, y: 250, active: false },
    { id: 'power', label: 'Power', x: 500, y: 100, active: false },
    { id: 'safety', label: 'Safety', x: 500, y: 200, active: false },
    { id: 'maintenance', label: 'Maintenance', x: 400, y: 150, active: false },
  ],
  edges: [
    { source: 'footfall', target: 'binfill', active: false },
    { source: 'footfall', target: 'hvac', active: false },
    { source: 'hvac', target: 'power', active: false },
    { source: 'binfill', target: 'maintenance', active: false },
    { source: 'power', target: 'safety', active: false },
    { source: 'maintenance', target: 'safety', active: false },
  ],
});

export const getEdgeStatus = (): EdgeStatus => ({
  nodeOnline: 6,
  cpuPercent: 34,
  tempC: 42,
});

export const getFlowChartData = (simActive = false) => {
  const now = Date.now();
  return Array.from({ length: 60 }, (_, i) => ({
    time: new Date(now - (59 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    entry: Math.round((simActive && i > 45 ? 80 : 20) + Math.random() * 15),
    exit: Math.round((simActive && i > 45 ? 30 : 18) + Math.random() * 10),
  }));
};
