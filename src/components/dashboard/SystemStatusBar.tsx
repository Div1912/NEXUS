import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const statusItems = [
    { label: '6/6 Edge Nodes', status: 'ok', color: 'hsl(155, 100%, 43%)' },
    { label: 'AI Engine: ACTIVE', status: 'ok', color: 'hsl(155, 100%, 43%)' },
    { label: 'Uptime: 99.98%', status: 'ok', color: 'hsl(155, 100%, 43%)' },
    { label: 'Causal Engine: ONLINE', status: 'ok', color: 'hsl(186, 100%, 50%)' },
    { label: 'Latency: 2.1ms', status: 'warn', color: 'hsl(47, 91%, 53%)' },
    { label: 'Federation: SYNCED', status: 'ok', color: 'hsl(155, 100%, 43%)' },
];

const SystemStatusBar: React.FC = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-center justify-between px-4 py-2 overflow-hidden rounded-sm"
            style={{
                background: 'linear-gradient(90deg, hsla(155,100%,43%,0.06), hsla(186,100%,50%,0.04), hsla(155,100%,43%,0.06))',
                border: '1px solid hsla(155, 100%, 43%, 0.15)',
                boxShadow: '0 2px 16px hsla(155, 100%, 43%, 0.06), inset 0 0 60px hsla(155, 100%, 43%, 0.02)',
            }}
        >
            {/* Animated scan shimmer */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, hsla(155,100%,43%,0.06) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 4s linear infinite',
                }}
            />

            {/* Status items */}
            <div className="flex items-center gap-5 flex-wrap">
                {statusItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div
                            className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                            style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }}
                        />
                        <span className="font-mono text-[9px] uppercase tracking-wider"
                            style={{ color: item.color }}>
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Live timestamp */}
            <div className="font-mono text-[9px] text-muted-foreground tabular-nums shrink-0 ml-4">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                {' '}
                <span className="text-accent/50">UTC+5:30</span>
            </div>
        </motion.div>
    );
};

export default SystemStatusBar;
