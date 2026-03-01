import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, ChevronRight, User, Zap, Cpu, Activity, Wifi, Sun, Moon } from 'lucide-react';
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

const useSystemStats = () => {
  const [stats, setStats] = useState({ cpu: 34, ram: 61, net: 2.1 });
  useEffect(() => {
    const t = setInterval(() => {
      setStats({
        cpu: Math.round(30 + Math.random() * 15),
        ram: Math.round(58 + Math.random() * 8),
        net: parseFloat((1.8 + Math.random() * 0.8).toFixed(1)),
      });
    }, 3000);
    return () => clearInterval(t);
  }, []);
  return stats;
};

const SystemStat: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-1.5 px-2.5 py-1 border border-border/50 bg-secondary/30">
    <span style={{ color }}>{icon}</span>
    <span className="font-mono text-[9px] text-muted-foreground uppercase">{label}</span>
    <span className="font-mono text-[10px] text-foreground tabular-nums font-bold">{value}</span>
  </div>
);

const TopBar: React.FC = () => {
  const location = useLocation();
  const { simulationActive, toggleSimulation, presentationMode, lightMode, toggleLightMode, live } = useNexus();
  const [time, setTime] = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const stats = useSystemStats();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const crumb = routeLabels[location.pathname] || 'Overview';

  if (presentationMode) return null;

  return (
    <header className="h-14 border-b border-border/30 flex items-center justify-between px-6 glass-deep shrink-0 relative z-20">
      {/* Shimmer line */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, hsla(186,100%,50%,0.15), transparent)' }} />

      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs font-mono">
        <span className="text-muted-foreground">NEXUS</span>
        <ChevronRight className="w-3 h-3 text-accent/30" />
        <span className="text-foreground uppercase tracking-wider">{crumb}</span>
      </div>

      {/* Center: Live system stats */}
      <div className="hidden md:flex items-center gap-2">
        <SystemStat icon={<Cpu className="w-2.5 h-2.5" />} label="CPU" value={`${stats.cpu}%`} color="hsl(186,100%,50%)" />
        <SystemStat icon={<Activity className="w-2.5 h-2.5" />} label="RAM" value={`${stats.ram}%`} color="hsl(155,100%,43%)" />
        <SystemStat icon={<Wifi className="w-2.5 h-2.5" />} label="NET" value={`${stats.net}ms`} color="hsl(47,91%,53%)" />
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* ── Light / Dark Mode Toggle ── */}
        <button
          onClick={toggleLightMode}
          title={lightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          className="relative w-8 h-8 flex items-center justify-center border border-border/40 hover:border-accent/40 bg-secondary/20 hover:bg-accent/5 transition-all"
          style={{ boxShadow: lightMode ? '0 0 8px hsla(40,80%,45%,0.2)' : '0 0 8px hsla(186,100%,50%,0.08)' }}
        >
          {lightMode
            ? <Moon className="w-3.5 h-3.5 text-accent" />
            : <Sun className="w-3.5 h-3.5 text-muted-foreground hover:text-accent transition-colors" />
          }
        </button>

        {/* ── Simulation Toggle ── */}
        <div className={`flex items-center gap-2 px-3 py-1.5 border transition-all ${simulationActive
          ? 'border-nexus-alert/40 bg-nexus-alert/5'
          : 'border-accent/10 bg-transparent'
          }`}>
          <Zap className={`w-3 h-3 ${simulationActive ? 'text-nexus-alert' : 'text-muted-foreground'}`} />
          <span className="font-mono text-[9px] text-muted-foreground uppercase">Sim</span>
          <Switch checked={simulationActive} onCheckedChange={toggleSimulation} />
          {simulationActive && (
            <span className="font-mono text-[9px] text-nexus-alert animate-pulse uppercase tracking-wider">
              ● LIVE
            </span>
          )}
        </div>

        {/* Date + Time */}
        <div className="flex flex-col items-end">
          <span className="font-mono text-[11px] text-foreground tabular-nums tracking-widest"
            style={{ textShadow: lightMode ? 'none' : '0 0 6px hsla(186,100%,50%,0.3)' }}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="font-mono text-[8px] text-muted-foreground tracking-wider">
            {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Alert Bell — count from live context */}
        <button onClick={() => setNotifOpen(true)} className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-3.5 h-3.5" />
          <span
            className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-nexus-red text-[7px] text-white flex items-center justify-center font-mono"
            style={{ boxShadow: '0 0 8px hsla(357,85%,52%,0.5)' }}
          >
            {live.alertCount}
          </span>
        </button>
        <NotificationPanel open={notifOpen} onOpenChange={setNotifOpen} />

        {/* Campus badge */}
        <span className="font-mono text-[9px] text-muted-foreground border border-border/40 px-2 py-1 uppercase tracking-wider bg-secondary/20">
          Campus α
        </span>

        {/* Avatar */}
        <div
          className="w-7 h-7 flex items-center justify-center border border-accent/20"
          style={{
            background: lightMode
              ? 'linear-gradient(135deg, hsla(220,80%,48%,0.2), hsla(186,80%,38%,0.15))'
              : 'linear-gradient(135deg, hsla(357,85%,52%,0.3), hsla(186,100%,50%,0.2))',
            boxShadow: '0 0 12px hsla(186,100%,50%,0.1)',
          }}
        >
          <User className="w-3 h-3 text-foreground" />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
