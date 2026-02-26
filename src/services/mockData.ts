import type { KPIData, CausalEvent, ModuleData, BuildingNode, CausalGraphNode, CausalGraphEdge, EdgeStatus } from '@/types/nexus';

const sparkline = (base: number, variance: number, len = 20): number[] =>
  Array.from({ length: len }, () => base + (Math.random() - 0.5) * variance);

export const getKPIs = (simActive = false): KPIData[] => {
  const mult = simActive ? 2.2 : 1;
  return [
    { id: 'footfall', label: 'Live Footfall', value: Math.round(1247 * mult), unit: '', trend: simActive ? 118 : 12, confidence: 94, sparkline: sparkline(1247 * mult, 200), color: 'nexus-cyan', moduleId: 'flow' },
    { id: 'energy', label: 'Energy Saved', value: Math.round(342 * (simActive ? 0.7 : 1)), unit: 'kWh', trend: simActive ? -8 : 18, confidence: 91, sparkline: sparkline(342, 50), color: 'nexus-green', moduleId: 'eco' },
    { id: 'alerts', label: 'Active Alerts', value: simActive ? 7 : 2, unit: '', trend: simActive ? 250 : -15, confidence: 97, sparkline: sparkline(simActive ? 7 : 2, 3), color: 'nexus-yellow', moduleId: 'guard' },
    { id: 'latency', label: 'Avg Latency', value: simActive ? 4.2 : 2.8, unit: 'ms', trend: simActive ? 50 : -5, confidence: 99, sparkline: sparkline(simActive ? 4.2 : 2.8, 1.5), color: 'nexus-red', moduleId: 'maintain' },
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

export const getModules = (simActive = false): ModuleData[] => [
  { id: 'flow', name: 'FLOW', fullName: 'NEXUS FLOW — Smart Mobility', status: simActive ? 'warning' : 'online', primaryMetric: { label: 'Footfall', value: simActive ? 2743 : 1247, unit: '/hr' }, sparkline: sparkline(1247, 300), subMetrics: [{ label: 'Gates Active', value: '4/4' }, { label: 'Shuttle ETA', value: '3 min' }], alertCount: simActive ? 2 : 0 },
  { id: 'eco', name: 'ECO', fullName: 'NEXUS ECO — Energy Intelligence', status: simActive ? 'alert' : 'online', primaryMetric: { label: 'Consumption', value: simActive ? 890 : 456, unit: 'kW' }, sparkline: sparkline(456, 80), subMetrics: [{ label: 'Solar Output', value: '124 kW' }, { label: 'Grid Load', value: '67%' }], alertCount: simActive ? 3 : 0 },
  { id: 'space', name: 'SPACE', fullName: 'NEXUS SPACE — Spatial Intelligence', status: 'online', primaryMetric: { label: 'Occupancy', value: simActive ? 89 : 62, unit: '%' }, sparkline: sparkline(62, 15), subMetrics: [{ label: 'Rooms Available', value: '12/30' }, { label: 'Density', value: 'Normal' }], alertCount: 0 },
  { id: 'maintain', name: 'MAINTAIN', fullName: 'NEXUS MAINTAIN — Predictive Maintenance', status: 'online', primaryMetric: { label: 'Health Score', value: 94, unit: '%' }, sparkline: sparkline(94, 5), subMetrics: [{ label: 'Tasks Pending', value: '3' }, { label: 'MTBF', value: '720 hrs' }], alertCount: 0 },
  { id: 'guard', name: 'GUARD', fullName: 'NEXUS GUARD — Safety & Security', status: simActive ? 'warning' : 'online', primaryMetric: { label: 'Threat Level', value: simActive ? 3 : 0, unit: '' }, sparkline: sparkline(0, 1), subMetrics: [{ label: 'Cameras Online', value: '48/48' }, { label: 'Perimeter', value: 'Secure' }], alertCount: simActive ? 1 : 0 },
  { id: 'federate', name: 'FEDERATE', fullName: 'NEXUS FEDERATE — Edge Federation', status: 'online', primaryMetric: { label: 'Nodes Synced', value: 6, unit: '/6' }, sparkline: sparkline(6, 0.5), subMetrics: [{ label: 'Latency', value: '2.1 ms' }, { label: 'Bandwidth', value: '94%' }], alertCount: 0 },
];

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
