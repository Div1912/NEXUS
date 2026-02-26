import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import type { ModuleData } from '@/types/nexus';

const statusStyles: Record<string, string> = {
  online: 'bg-nexus-green/20 text-nexus-green border-nexus-green/30',
  warning: 'bg-nexus-yellow/20 text-nexus-yellow border-nexus-yellow/30',
  alert: 'bg-nexus-alert/20 text-nexus-alert border-nexus-alert/30',
};

const Sparkline: React.FC<{ data: number[] }> = ({ data }) => {
  const w = 80, h = 24;
  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min)) * h}`).join(' ');
  return (
    <svg width={w} height={h}><polyline points={pts} fill="none" stroke="hsl(186,100%,50%)" strokeWidth="1" opacity="0.5" /></svg>
  );
};

const ModuleCard: React.FC<{ module: ModuleData; index: number }> = ({ module, index }) => {
  const navigate = useNavigate();
  const isAlert = module.status === 'alert' || module.alertCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onClick={() => navigate(`/dashboard/${module.id}`)}
      className={`nexus-card p-5 cursor-pointer group ${isAlert ? 'nexus-glow-red' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-display font-bold text-sm text-foreground">{module.name}</span>
        <Badge variant="outline" className={`text-[9px] uppercase ${statusStyles[module.status]}`}>
          {module.status}
        </Badge>
      </div>
      <div className="flex items-end gap-2 mb-3">
        <span className="font-mono text-2xl font-bold text-foreground">{module.primaryMetric.value}</span>
        <span className="text-xs text-muted-foreground mb-1">{module.primaryMetric.unit}</span>
      </div>
      <Sparkline data={module.sparkline} />
      <div className="mt-3 space-y-1">
        {module.subMetrics.map(m => (
          <div key={m.label} className="flex justify-between text-[11px]">
            <span className="text-muted-foreground">{m.label}</span>
            <span className="font-mono text-foreground">{m.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[11px] text-accent opacity-0 group-hover:opacity-100 transition-opacity">
        View Details →
      </div>
    </motion.div>
  );
};

export default ModuleCard;
