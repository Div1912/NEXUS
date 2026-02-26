export type ModuleId = 'flow' | 'eco' | 'space' | 'maintain' | 'guard' | 'federate';

export interface KPIData {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: number;
  confidence: number;
  sparkline: number[];
  color: string;
  moduleId: ModuleId;
}

export interface CausalEvent {
  id: string;
  timestamp: Date;
  title: string;
  cause: string;
  effect: string;
  action: string;
  severity: 'info' | 'warning' | 'critical';
  moduleId: ModuleId;
}

export interface ModuleData {
  id: ModuleId;
  name: string;
  fullName: string;
  status: 'online' | 'warning' | 'alert';
  primaryMetric: { label: string; value: number; unit: string };
  sparkline: number[];
  subMetrics: { label: string; value: string }[];
  alertCount: number;
}

export interface BuildingNode {
  id: string;
  name: string;
  x: number;
  y: number;
  status: 'healthy' | 'warning' | 'alert';
  metrics: { label: string; value: string }[];
}

export interface CausalGraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  active: boolean;
}

export interface CausalGraphEdge {
  source: string;
  target: string;
  active: boolean;
}

export interface EdgeStatus {
  nodeOnline: number;
  cpuPercent: number;
  tempC: number;
}

export interface SimulationState {
  active: boolean;
  multiplier: number;
}
