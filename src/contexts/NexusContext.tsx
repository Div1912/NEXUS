import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface NexusState {
  simulationActive: boolean;
  presentationMode: boolean;
  highContrast: boolean;
  toggleSimulation: () => void;
  togglePresentation: () => void;
  toggleHighContrast: () => void;
}

const NexusContext = createContext<NexusState | null>(null);

export const NexusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [simulationActive, setSimulationActive] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const toggleSimulation = useCallback(() => setSimulationActive(p => !p), []);
  const togglePresentation = useCallback(() => setPresentationMode(p => !p), []);
  const toggleHighContrast = useCallback(() => setHighContrast(p => !p), []);

  // Apply high contrast class to root
  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

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
    <NexusContext.Provider value={{ simulationActive, presentationMode, highContrast, toggleSimulation, togglePresentation, toggleHighContrast }}>
      {children}
    </NexusContext.Provider>
  );
};

export const useNexus = () => {
  const ctx = useContext(NexusContext);
  if (!ctx) throw new Error('useNexus must be used within NexusProvider');
  return ctx;
};
