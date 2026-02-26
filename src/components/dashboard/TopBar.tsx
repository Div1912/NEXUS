import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, ChevronRight, User, Zap } from 'lucide-react';
import { useNexus } from '@/contexts/NexusContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const routeLabels: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/flow': 'FLOW',
  '/dashboard/eco': 'ECO',
  '/dashboard/space': 'SPACE',
  '/dashboard/maintain': 'MAINTAIN',
  '/dashboard/guard': 'GUARD',
  '/dashboard/federate': 'FEDERATE',
  '/dashboard/reports': 'Reports',
  '/dashboard/settings': 'Settings',
};

const TopBar: React.FC = () => {
  const location = useLocation();
  const { simulationActive, toggleSimulation, presentationMode } = useNexus();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const crumb = routeLabels[location.pathname] || 'Overview';

  if (presentationMode) return null;

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/60 backdrop-blur-md shrink-0">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">NEXUS OS</span>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <span className="text-foreground font-medium">{crumb}</span>
      </div>

      <div className="flex items-center gap-5">
        {/* Simulation Toggle */}
        <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-1.5 border border-border">
          <Zap className={`w-3 h-3 ${simulationActive ? 'text-nexus-alert' : 'text-muted-foreground'}`} />
          <span className="text-xs text-muted-foreground">Sim</span>
          <Switch checked={simulationActive} onCheckedChange={toggleSimulation} />
          {simulationActive && (
            <Badge className="bg-nexus-alert/20 text-nexus-alert border-nexus-alert/30 text-[9px] animate-pulse-glow">
              500 EVENT
            </Badge>
          )}
        </div>

        {/* Clock */}
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>

        {/* Alerts */}
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-nexus-red text-[8px] text-foreground flex items-center justify-center font-mono">
            {simulationActive ? 7 : 2}
          </span>
        </button>

        {/* Campus Selector */}
        <span className="text-xs text-muted-foreground border border-border rounded-lg px-3 py-1.5 bg-secondary/30">
          Campus Alpha
        </span>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent/50 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-foreground" />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
