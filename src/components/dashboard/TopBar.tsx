import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, ChevronRight, User, Zap } from 'lucide-react';
import { useNexus } from '@/contexts/NexusContext';
import { Switch } from '@/components/ui/switch';
import NotificationPanel from './NotificationPanel';

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
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const crumb = routeLabels[location.pathname] || 'Overview';

  if (presentationMode) return null;

  return (
    <header className="h-12 border-b border-white/[0.04] flex items-center justify-between px-6 bg-background/80 backdrop-blur-md shrink-0">
      <div className="flex items-center gap-2 text-xs font-mono">
        <span className="text-muted-foreground">NEXUS</span>
        <ChevronRight className="w-3 h-3 text-accent/20" />
        <span className="text-foreground uppercase tracking-wider">{crumb}</span>
      </div>

      <div className="flex items-center gap-5">
        {/* Simulation Toggle */}
        <div className="flex items-center gap-2 px-3 py-1 border border-accent/8">
          <Zap className={`w-3 h-3 ${simulationActive ? 'text-nexus-alert' : 'text-muted-foreground'}`} />
          <span className="font-mono text-[9px] text-muted-foreground uppercase">Sim</span>
          <Switch checked={simulationActive} onCheckedChange={toggleSimulation} />
          {simulationActive && (
            <span className="font-mono text-[9px] text-nexus-alert animate-pulse-glow uppercase tracking-wider">
              500 EVENT
            </span>
          )}
        </div>

        {/* Clock */}
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums tracking-wider">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>

        {/* Alerts */}
        <button onClick={() => setNotifOpen(true)} className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-nexus-red text-[7px] text-foreground flex items-center justify-center font-mono">
            {simulationActive ? 7 : 2}
          </span>
        </button>
        <NotificationPanel open={notifOpen} onOpenChange={setNotifOpen} />

        {/* Campus */}
        <span className="font-mono text-[9px] text-muted-foreground border border-accent/8 px-2 py-1 uppercase tracking-wider">
          Campus α
        </span>

        {/* Avatar */}
        <div className="w-6 h-6 rounded-none bg-gradient-to-br from-primary/60 to-accent/30 flex items-center justify-center border border-accent/10">
          <User className="w-3 h-3 text-foreground" />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
