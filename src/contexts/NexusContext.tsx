import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export interface LiveTelemetry {
  footfall: number;
  footfallDelta: number;
  footfallTrend: 'up' | 'down' | 'flat';
  solarOutput: number;
  gridLoad: number;
  energySaved: number;
  netConsumption: number;
  alertCount: number;
  avgLatency: number;
  nodesSynced: number;
  tick: number;
}

// Idle / standby state — all zeros
const IDLE_TELEMETRY: LiveTelemetry = {
  footfall: 0, footfallDelta: 0, footfallTrend: 'flat',
  solarOutput: 0, gridLoad: 0, energySaved: 0, netConsumption: 0,
  alertCount: 0, avgLatency: 0, nodesSynced: 0, tick: 0,
};

interface NexusState {
  simulationActive: boolean;
  presentationMode: boolean;
  highContrast: boolean;
  lightMode: boolean;
  live: LiveTelemetry;
  toggleSimulation: () => void;
  togglePresentation: () => void;
  toggleHighContrast: () => void;
  toggleLightMode: () => void;
}

const walk = (current: number, base: number, stepPct: number, minPct = 0.7, maxPct = 1.4) => {
  const step = base * stepPct;
  const next = current + (Math.random() - 0.42) * step * 2;
  return Math.max(base * minPct, Math.min(base * maxPct, next));
};

const makeTelemetry = (prev?: LiveTelemetry): LiveTelemetry => {
  // Simulation-only values (always "large campus operational" when running)
  const footfallBase = 1247;
  const solarBase = 85;
  const gridBase = 190;

  const footfall = Math.round(prev ? walk(prev.footfall, footfallBase, 0.025) : footfallBase);
  const prevFootfall = prev?.footfall ?? footfallBase;
  const footfallDelta = footfall - prevFootfall;
  const footfallTrend: LiveTelemetry['footfallTrend'] = footfallDelta > 5 ? 'up' : footfallDelta < -5 ? 'down' : 'flat';

  const solarOutput = Math.round(prev ? walk(prev.solarOutput, solarBase, 0.05) : solarBase);
  const gridLoad = Math.round(prev ? walk(prev.gridLoad, gridBase, 0.04) : gridBase);
  const netConsumption = Math.round(solarOutput + gridLoad * 0.7 + (Math.random() - 0.3) * 10);
  const energySaved = Math.round(solarOutput * 1.05 + Math.random() * 8);

  const alertCount = Math.max(0, Math.round((prev?.alertCount ?? 2) + (Math.random() > 0.85 ? 1 : Math.random() > 0.85 ? -1 : 0)));
  const avgLatency = parseFloat((prev ? walk(prev.avgLatency, 2.8, 0.04, 0.5, 2) : 2.8).toFixed(1));

  return {
    footfall, footfallDelta, footfallTrend,
    solarOutput, gridLoad, energySaved, netConsumption,
    alertCount, avgLatency, nodesSynced: 6,
    tick: (prev?.tick ?? 0) + 1,
  };
};

const NexusContext = createContext<NexusState | null>(null);

export const NexusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [simulationActive, setSimulationActive] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  // Starts IDLE — all zeros until simulation is toggled ON
  const [live, setLive] = useState<LiveTelemetry>(IDLE_TELEMETRY);
  const simRef = useRef(simulationActive);
  simRef.current = simulationActive;

  const toggleSimulation = useCallback(() => setSimulationActive(p => !p), []);
  const togglePresentation = useCallback(() => setPresentationMode(p => !p), []);
  const toggleHighContrast = useCallback(() => setHighContrast(p => !p), []);
  const toggleLightMode = useCallback(() => setLightMode(p => !p), []);

  // When simulation turns ON: immediately generate first live tick
  // When simulation turns OFF: reset to idle/zero
  useEffect(() => {
    if (simulationActive) {
      setLive(makeTelemetry(undefined)); // kickstart with baseline
    } else {
      setLive(IDLE_TELEMETRY); // back to zero
    }
  }, [simulationActive]);

  // Central ticker — only runs when simulation is active
  useEffect(() => {
    if (!simulationActive) return;
    const interval = setInterval(() => {
      setLive(prev => makeTelemetry(prev));
    }, 2000);
    return () => clearInterval(interval);
  }, [simulationActive]);

  // Apply CSS classes to root
  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', lightMode);
  }, [lightMode]);

  // Keyboard shortcut: P = presentation mode
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          togglePresentation();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [togglePresentation]);

  return (
    <NexusContext.Provider value={{
      simulationActive, presentationMode, highContrast, lightMode, live,
      toggleSimulation, togglePresentation, toggleHighContrast, toggleLightMode,
    }}>
      {children}
    </NexusContext.Provider>
  );
};

export const useNexus = () => {
  const ctx = useContext(NexusContext);
  if (!ctx) throw new Error('useNexus must be used within NexusProvider');
  return ctx;
};
