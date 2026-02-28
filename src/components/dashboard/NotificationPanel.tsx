import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getCausalEvents } from '@/services/mockData';
import { useNexus } from '@/contexts/NexusContext';
import { X } from 'lucide-react';

const severityColors: Record<string, string> = {
  info: 'bg-accent/20 text-accent',
  warning: 'bg-nexus-yellow/20 text-nexus-yellow',
  critical: 'bg-nexus-alert/20 text-nexus-alert',
};

const NotificationPanel: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void }> = ({ open, onOpenChange }) => {
  const { simulationActive } = useNexus();
  const allEvents = getCausalEvents(simulationActive);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const events = allEvents.filter(e => !dismissed.has(e.id));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-l border-accent/10 w-80 p-0">
        <SheetHeader className="p-4 border-b border-accent/8">
          <SheetTitle className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">
            Alerts ({events.length})
          </SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto max-h-[calc(100vh-80px)] p-3 space-y-2">
          {events.length === 0 && (
            <div className="font-mono text-[10px] text-muted-foreground text-center py-8">No active alerts</div>
          )}
          {events.map(e => (
            <div key={e.id} className="glass-panel p-3 group relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`font-mono text-[8px] uppercase px-1.5 py-0.5 rounded-sm ${severityColors[e.severity] || severityColors.info}`}>
                  {e.severity}
                </span>
                <span className="font-mono text-[8px] text-muted-foreground tabular-nums">
                  {e.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <div className="font-mono text-[10px] text-foreground mb-1">{e.title}</div>
              <div className="font-mono text-[9px] text-muted-foreground">{e.cause}</div>
              <div className="font-mono text-[9px] text-accent/50 mt-1 uppercase tracking-wider">
                Module: {e.moduleId}
              </div>
              <button
                onClick={() => setDismissed(prev => new Set(prev).add(e.id))}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationPanel;
