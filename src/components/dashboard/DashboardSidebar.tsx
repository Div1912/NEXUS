import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useNexus } from '@/contexts/NexusContext';
import { getEdgeStatus } from '@/services/mockData';
import NexusLogo from './NexusLogo';
import {
  LayoutDashboard, Waypoints, Leaf, Grid3X3, Wrench, Shield, Network, FileText, Settings,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'FLOW', icon: Waypoints, path: '/dashboard/flow' },
  { label: 'ECO', icon: Leaf, path: '/dashboard/eco' },
  { label: 'SPACE', icon: Grid3X3, path: '/dashboard/space' },
  { label: 'MAINTAIN', icon: Wrench, path: '/dashboard/maintain' },
  { label: 'GUARD', icon: Shield, path: '/dashboard/guard' },
  { label: 'FEDERATE', icon: Network, path: '/dashboard/federate' },
  { label: 'Reports', icon: FileText, path: '/dashboard/reports' },
  { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

const DashboardSidebar: React.FC<{ collapsed: boolean; onToggle: () => void }> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const edge = getEdgeStatus();
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <aside className={`fixed left-0 top-0 h-screen glass-deep border-r border-white/[0.05] flex flex-col z-30 transition-all duration-200 ${collapsed ? 'w-14' : 'w-56'}`}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 h-14 border-b border-white/[0.05] shrink-0">
        <button onClick={onToggle} className="flex items-center gap-2 w-full group">
          <div className="relative">
            <NexusLogo size={collapsed ? 24 : 28} />
            {/* Glow ring around logo */}
            <div className="absolute inset-0 rounded-full animate-neon-pulse opacity-40 pointer-events-none" style={{ boxShadow: '0 0 8px hsl(186,100%,50%)' }} />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-foreground text-xs leading-tight tracking-wider">NEXUS OS</span>
              <span className="text-[8px] text-muted-foreground tracking-[0.15em] font-mono shimmer-text">CAUSAL AI</span>
            </div>
          )}
        </button>
        {!collapsed && (
          <span className="flex items-center gap-1 text-[8px] uppercase tracking-wider text-nexus-red font-mono ml-auto">
            <span className="w-1 h-1 rounded-full bg-nexus-red animate-pulse-glow" style={{ boxShadow: '0 0 6px hsl(357,85%,52%)' }} />
            LIVE
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-3 py-2.5 text-xs transition-all relative group ${isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {/* Active indicator */}
              {isActive && (
                <>
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[2px]"
                    style={{
                      background: 'linear-gradient(180deg, transparent, hsl(186,100%,50%), transparent)',
                      boxShadow: '2px 0 8px hsla(186,100%,50%,0.5)',
                    }}
                  />
                  <div className="absolute inset-0 bg-accent/[0.06]" />
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      background: 'linear-gradient(90deg, hsla(186,100%,50%,0.08), transparent)',
                    }}
                  />
                </>
              )}
              <item.icon
                className={`w-3.5 h-3.5 shrink-0 transition-all z-10 ${isActive
                    ? 'text-accent'
                    : 'group-hover:text-accent/60 group-hover:scale-110'
                  }`}
                style={isActive ? { filter: 'drop-shadow(0 0 4px hsl(186,100%,50%))' } : {}}
              />
              {!collapsed && (
                <span className="font-mono text-[11px] uppercase tracking-wider z-10">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer: edge status + clock */}
      {!collapsed && (
        <div className="mx-0 border-t border-white/[0.05] p-3">
          {/* Campus profile */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded flex items-center justify-center"
              style={{
                background: 'hsla(186,100%,50%,0.08)',
                border: '1px solid hsla(186,100%,50%,0.2)',
                boxShadow: '0 0 12px hsla(186,100%,50%,0.08)',
              }}
            >
              <span className="font-display text-[9px] font-bold text-accent">SC</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-foreground font-bold tracking-wide">SMART CAMPUS</span>
              <span className="font-mono text-[8px] text-muted-foreground tracking-wider">ALPHA v2.1</span>
            </div>
          </div>

          {/* Edge health mini-dots */}
          <div className="text-[9px] font-mono space-y-2">
            <div className="text-muted-foreground uppercase tracking-[0.12em] flex items-center gap-1.5 mb-2">
              <span className="w-1 h-1 rounded-full bg-nexus-green" style={{ boxShadow: '0 0 4px hsl(155,100%,43%)' }} />
              Edge Status
            </div>
            {/* Node dots */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Nodes</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: i < edge.nodeOnline ? 'hsl(155,100%,43%)' : 'hsl(0,0%,20%)',
                      boxShadow: i < edge.nodeOnline ? '0 0 4px hsl(155,100%,43%)' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
            {/* CPU ring bar */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">CPU</span>
              <div className="flex items-center gap-1.5">
                <div className="w-12 h-1 bg-secondary overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${edge.cpuPercent}%`,
                      background: 'linear-gradient(90deg, hsl(186,100%,50%), hsl(155,100%,43%))',
                      boxShadow: '0 0 4px hsl(186,100%,50%)',
                    }}
                  />
                </div>
                <span className="text-foreground tabular-nums">{edge.cpuPercent}%</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Temp</span>
              <span className="text-foreground tabular-nums">{edge.tempC}°C</span>
            </div>
          </div>

          {/* Live clock */}
          <div className="mt-3 pt-2 border-t border-white/[0.04]">
            <div className="font-mono text-[11px] text-accent tabular-nums text-center tracking-widest"
              style={{ textShadow: '0 0 8px hsl(186,100%,50%)' }}>
              {clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="font-mono text-[8px] text-muted-foreground text-center tracking-wider mt-0.5">
              {clock.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default DashboardSidebar;
