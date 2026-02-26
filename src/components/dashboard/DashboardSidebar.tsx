import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useNexus } from '@/contexts/NexusContext';
import { getEdgeStatus } from '@/services/mockData';
import NexusLogo from './NexusLogo';
import {
  LayoutDashboard, Waypoints, Leaf, Grid3X3, Wrench, Shield, Network, FileText, Settings,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'NEXUS FLOW', icon: Waypoints, path: '/dashboard/flow' },
  { label: 'NEXUS ECO', icon: Leaf, path: '/dashboard/eco' },
  { label: 'NEXUS SPACE', icon: Grid3X3, path: '/dashboard/space' },
  { label: 'NEXUS MAINTAIN', icon: Wrench, path: '/dashboard/maintain' },
  { label: 'NEXUS GUARD', icon: Shield, path: '/dashboard/guard' },
  { label: 'NEXUS FEDERATE', icon: Network, path: '/dashboard/federate' },
  { label: 'Reports', icon: FileText, path: '/dashboard/reports' },
  { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

const DashboardSidebar: React.FC<{ collapsed: boolean; onToggle: () => void }> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const edge = getEdgeStatus();

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-30 transition-all duration-200 ${collapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <button onClick={onToggle} className="flex items-center gap-2.5 w-full">
          <NexusLogo size={collapsed ? 28 : 32} />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-foreground text-sm leading-tight">NEXUS OS</span>
              <span className="text-[9px] text-muted-foreground tracking-wider">CAUSAL AI ENGINE</span>
            </div>
          )}
        </button>
        {!collapsed && (
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-nexus-red font-semibold ml-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-nexus-red animate-pulse-glow" />
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
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all relative group ${
                isActive
                  ? 'text-foreground bg-sidebar-accent'
                  : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-sidebar-primary rounded-r" />}
              <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-accent' : 'group-hover:text-accent/70'}`} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Edge Status */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-lg bg-secondary/50 border border-border text-[11px]">
          <div className="text-muted-foreground uppercase tracking-wider mb-2 text-[10px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-nexus-green animate-pulse-glow" />
            Edge Status
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between"><span className="text-muted-foreground">Nodes Online</span><span className="font-mono text-nexus-green">{edge.nodeOnline}/6</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">CPU</span>
              <div className="flex items-center gap-2">
                <div className="w-12 h-1 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-accent rounded-full" style={{ width: `${edge.cpuPercent}%` }} /></div>
                <span className="font-mono text-foreground">{edge.cpuPercent}%</span>
              </div>
            </div>
            <div className="flex justify-between"><span className="text-muted-foreground">Temp</span><span className="font-mono text-foreground">{edge.tempC}°C</span></div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default DashboardSidebar;
