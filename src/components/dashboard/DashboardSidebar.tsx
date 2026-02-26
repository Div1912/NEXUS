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

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-accent/6 flex flex-col z-30 transition-all duration-200 ${collapsed ? 'w-14' : 'w-56'}`}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 h-12 border-b border-accent/6 shrink-0">
        <button onClick={onToggle} className="flex items-center gap-2 w-full">
          <NexusLogo size={collapsed ? 24 : 28} />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-foreground text-xs leading-tight tracking-wider">NEXUS OS</span>
              <span className="text-[8px] text-muted-foreground tracking-[0.15em] font-mono">CAUSAL AI</span>
            </div>
          )}
        </button>
        {!collapsed && (
          <span className="flex items-center gap-1 text-[8px] uppercase tracking-wider text-nexus-red font-mono ml-auto">
            <span className="w-1 h-1 rounded-full bg-nexus-red animate-pulse-glow" />
            LIVE
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs transition-all relative group ${
                isActive
                  ? 'text-foreground bg-accent/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/3'
              }`}
            >
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />}
              <item.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-accent' : 'group-hover:text-accent/50'}`} />
              {!collapsed && <span className="font-mono text-[11px] uppercase tracking-wider">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Edge Status */}
      {!collapsed && (
        <div className="mx-2 mb-2 p-2.5 border-t border-accent/6 text-[9px] font-mono">
          <div className="text-muted-foreground uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-nexus-green" style={{ boxShadow: '0 0 4px hsl(155, 100%, 43%)' }} />
            Edge Status
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nodes</span>
              <span className="text-nexus-green tabular-nums">{edge.nodeOnline}/6</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">CPU</span>
              <div className="flex items-center gap-1.5">
                <div className="w-10 h-0.5 bg-secondary overflow-hidden"><div className="h-full bg-accent/50" style={{ width: `${edge.cpuPercent}%` }} /></div>
                <span className="text-foreground tabular-nums">{edge.cpuPercent}%</span>
              </div>
            </div>
            <div className="flex justify-between"><span className="text-muted-foreground">Temp</span><span className="text-foreground tabular-nums">{edge.tempC}°C</span></div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default DashboardSidebar;
