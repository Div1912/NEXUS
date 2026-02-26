import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const weeklyData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  footfall: Math.round(800 + Math.random() * 600),
  energy: Math.round(300 + Math.random() * 200),
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
  { title: 'Edge Node Performance Analysis', date: 'Feb 16, 2026', status: 'Generated' },
];

const Reports: React.FC = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-xl font-bold text-foreground tracking-wide">Reports & Analytics</h1>
      <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em] mt-1">Generated Intelligence</p>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-5">
        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">Weekly Footfall & Energy</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsla(229,24%,52%,0.6)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: 'hsla(229,24%,52%,0.4)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(236, 44%, 7%)', border: '1px solid hsla(186,100%,50%,0.15)', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
            <Bar dataKey="footfall" fill="hsla(186, 100%, 50%, 0.4)" radius={[1, 1, 0, 0]} />
            <Bar dataKey="energy" fill="hsla(155, 100%, 43%, 0.4)" radius={[1, 1, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel p-5">
        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">30-Day Efficiency Trend</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyTrend}>
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsla(229,24%,52%,0.4)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: 'hsla(229,24%,52%,0.4)', fontFamily: 'JetBrains Mono' }} domain={[60, 100]} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(236, 44%, 7%)', border: '1px solid hsla(186,100%,50%,0.15)', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
            <Line type="monotone" dataKey="efficiency" stroke="hsl(47, 91%, 53%)" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>

    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-5">
      <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">Generated Reports</div>
      <div className="space-y-1">
        {reports.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.05 }}
            className="flex items-center justify-between p-3 bg-secondary/10 border-l-2 border-l-accent/10 hover:border-l-accent/40 hover:bg-secondary/20 transition-all cursor-pointer"
          >
            <div>
              <div className="text-sm font-medium text-foreground">{r.title}</div>
              <div className="font-mono text-[9px] text-muted-foreground tabular-nums">{r.date}</div>
            </div>
            <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border ${
              r.status === 'Generated' ? 'border-accent/15 text-accent/60' : 'border-nexus-yellow/15 text-nexus-yellow/60'
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
