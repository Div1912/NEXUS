import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const weeklyData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  footfall: Math.round(800 + Math.random() * 600),
  energy: Math.round(300 + Math.random() * 200),
  alerts: Math.round(Math.random() * 5),
}));

const monthlyTrend = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  efficiency: Math.round(75 + Math.random() * 20),
}));

const reports = [
  { title: 'Weekly Campus Summary', date: 'Feb 20, 2026', status: 'Generated' },
  { title: 'Energy Optimization Report', date: 'Feb 19, 2026', status: 'Generated' },
  { title: 'Security Incident Log', date: 'Feb 18, 2026', status: 'Generated' },
  { title: 'Predictive Maintenance Forecast', date: 'Feb 17, 2026', status: 'Pending' },
];

const Reports: React.FC = () => (
  <div className="space-y-6">
    <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl font-bold text-foreground">
      Reports & Analytics
    </motion.h1>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="nexus-card p-5">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Weekly Footfall & Energy</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.06)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#8890B5' }} />
            <YAxis tick={{ fontSize: 10, fill: '#8890B5' }} />
            <Tooltip contentStyle={{ background: 'hsl(235, 49%, 10%)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="footfall" fill="hsl(186, 100%, 50%)" radius={[4, 4, 0, 0]} opacity={0.7} />
            <Bar dataKey="energy" fill="hsl(155, 100%, 43%)" radius={[4, 4, 0, 0]} opacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="nexus-card p-5">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">30-Day Efficiency Trend</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.06)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#8890B5' }} />
            <YAxis tick={{ fontSize: 10, fill: '#8890B5' }} domain={[60, 100]} />
            <Tooltip contentStyle={{ background: 'hsl(235, 49%, 10%)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="efficiency" stroke="hsl(47, 91%, 53%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>

    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="nexus-card p-5">
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Generated Reports</div>
      <div className="space-y-2">
        {reports.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border hover:border-accent/30 transition-colors cursor-pointer"
          >
            <div>
              <div className="text-sm font-medium text-foreground">{r.title}</div>
              <div className="text-xs text-muted-foreground">{r.date}</div>
            </div>
            <span className={`text-[10px] uppercase tracking-wider font-mono px-2 py-1 rounded ${
              r.status === 'Generated' ? 'bg-accent/10 text-accent' : 'bg-nexus-yellow/10 text-nexus-yellow'
            }`}>
              {r.status}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

export default Reports;
