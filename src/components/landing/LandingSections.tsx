import React, { useState, useRef, useCallback } from 'react';
import { motion, useInView, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/* ─── Section fade-in wrapper ───────────────────────────────────────────── */
const Section: React.FC<{ id: string; children: React.ReactNode; className?: string }> = ({ id, children, className = '' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    return (
        <section id={id} ref={ref} className={`relative py-32 px-6 overflow-hidden ${className}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: 'easeOut' }}>
                {children}
            </motion.div>
        </section>
    );
};

/* ─── 3D mouse-tilt wrapper — NO border, just tilt + subtle spotlight ─── */
const TiltCard: React.FC<{
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
    onClick?: () => void;
}> = ({ children, className = '', glowColor = 'hsl(186,100%,50%)', onClick }) => {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [spotX, setSpotX] = useState(50);
    const [spotY, setSpotY] = useState(50);
    const [hovered, setHovered] = useState(false);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 280, damping: 28 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 280, damping: 28 });

    const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mouseX.set((e.clientX - r.left) / r.width - 0.5);
        mouseY.set((e.clientY - r.top) / r.height - 0.5);
        setSpotX(((e.clientX - r.left) / r.width) * 100);
        setSpotY(((e.clientY - r.top) / r.height) * 100);
    }, [mouseX, mouseY]);

    const onLeave = useCallback(() => {
        mouseX.set(0); mouseY.set(0); setHovered(false);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={onLeave}
            onClick={onClick}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 900 }}
            className={`relative overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
            whileTap={onClick ? { scale: 0.98 } : {}}
        >
            {/* Cursor-follow spotlight — only glow, no border */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-sm"
                style={{
                    opacity: hovered ? 1 : 0,
                    background: `radial-gradient(200px circle at ${spotX}% ${spotY}%, ${glowColor}12, transparent 75%)`,
                }}
            />
            {children}
        </motion.div>
    );
};

/* ════════════════════════════════════════════════════════════════
   PLATFORM SECTION
════════════════════════════════════════════════════════════════ */
const PLATFORM_FEATURES = [
    { label: 'NEXUS CORE', title: 'Edge-Native Processing', desc: 'All inference runs on-device. Zero cloud round-trips. Sub-5ms decision latency regardless of connectivity.', metric: 'Sub-5ms', color: 'hsl(186,100%,50%)' },
    { label: 'NEXUS BRAIN', title: 'Causal AI Engine', desc: 'Not correlation — causation. Reasons through cause-and-effect chains to predict and autonomously resolve events.', metric: 'Causal Reasoning', color: 'hsl(155,100%,43%)' },
    { label: 'NEXUS MESH', title: 'Federated Node Mesh', desc: 'A self-healing mesh of 6+ edge nodes with consensus-driven decisions and Byzantine fault tolerance.', metric: '6 Nodes', color: 'hsl(270,80%,70%)' },
    { label: 'NEXUS VAULT', title: 'Zero-Trust Security', desc: 'RSA-4096 inter-node handshake. Session keys wiped on standby. No persistent credentials stored anywhere.', metric: 'RSA-4096', color: 'hsl(357,85%,52%)' },
    { label: 'NEXUS STREAM', title: 'Real-Time Telemetry', desc: 'Every sensor, gate, meter, and node streams live data to a unified telemetry bus. One source of truth.', metric: 'Real-time', color: 'hsl(47,91%,53%)' },
    { label: 'NEXUS LOOP', title: 'Autonomous Feedback', desc: 'Self-correcting control loops for energy, flow, and maintenance — NEXUS acts before humans need to.', metric: 'Autonomous', color: 'hsl(186,100%,50%)' },
];

export const PlatformSection: React.FC = () => (
    <Section id="platform">
        <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 15% 50%, hsla(186,100%,50%,0.04) 0%, transparent 55%)' }} />
        <div className="container mx-auto max-w-6xl">
            {/* Centred header — matches reference style */}
            <div className="text-center mb-20">
                <motion.div
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    className="font-mono text-[10px] uppercase tracking-[0.45em] mb-4"
                    style={{ color: 'hsl(186,100%,50%)' }}
                >
                    Platform Capabilities
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: 0.08 }}
                    className="font-bold text-4xl md:text-5xl text-foreground mb-5"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                    Built different.<br />Runs different.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ delay: 0.14 }}
                    className="text-muted-foreground font-mono text-xs max-w-md mx-auto leading-relaxed"
                >
                    NEXUS OS isn't a dashboard bolted onto legacy infrastructure. It's an operating system designed for physical intelligence.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                {PLATFORM_FEATURES.map((f, i) => (
                    <motion.div
                        key={f.title}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07, duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
                    >
                        <TiltCard glowColor={f.color} className="p-8">
                            {/* Small cyan module label */}
                            <div className="font-mono text-[9px] uppercase tracking-[0.25em] mb-3" style={{ color: f.color }}>
                                {f.label}
                            </div>
                            {/* Bold title */}
                            <h3 className="font-bold text-foreground text-[18px] mb-3 leading-snug"
                                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                {f.title}
                            </h3>
                            {/* Description */}
                            <p className="font-mono text-[11px] text-muted-foreground leading-relaxed mb-5">
                                {f.desc}
                            </p>
                            {/* Metric — cyan, no background */}
                            <motion.span
                                className="font-mono text-[11px] font-semibold"
                                style={{ color: f.color }}
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                            >
                                {f.metric}
                            </motion.span>
                        </TiltCard>
                    </motion.div>
                ))}
            </div>
        </div>
    </Section>
);

/* ════════════════════════════════════════════════════════════════
   MODULES DATA
════════════════════════════════════════════════════════════════ */
const MODULES = [
    { id: 'FLOW', label: 'Smart Mobility', desc: 'Real-time pedestrian flow, gate management, shuttle orchestration.', metric: 'Real-time', color: 'hsl(186,100%,50%)' },
    { id: 'ECO', label: 'Energy Intelligence', desc: 'Consumption optimisation, solar integration, grid load balancing.', metric: 'Autonomous', color: 'hsl(155,100%,43%)' },
    { id: 'SPACE', label: 'Spatial Intelligence', desc: 'Room occupancy, density mapping, dynamic space allocation.', metric: '30 Zones', color: 'hsl(270,80%,70%)' },
    { id: 'MAINTAIN', label: 'Predictive Maintenance', desc: 'Equipment health scoring, MTBF prediction, auto-dispatch.', metric: 'Predictive', color: 'hsl(47,91%,53%)' },
    { id: 'GUARD', label: 'Safety & Security', desc: 'Threat detection, perimeter monitoring, anomaly classification.', metric: '48 Cameras', color: 'hsl(357,85%,52%)' },
    { id: 'FEDERATE', label: 'Edge Federation', desc: 'Node synchronisation, distributed inference, bandwidth optimisation.', metric: '6 Nodes', color: 'hsl(186,100%,50%)' },
];

/* ─── Standalone Module Card with visible animations, zero border ─────────── */
const ModuleCard: React.FC<{
    m: typeof MODULES[number];
    i: number;
    onClick: () => void;
}> = ({ m, i, onClick }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.09, duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative p-8 cursor-pointer overflow-hidden"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            onClick={onClick}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            style={{ transition: 'background 0.3s ease' }}
        >
            {/* Hover background tint — visible but subtle */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                style={{ background: `radial-gradient(ellipse at 30% 40%, ${m.color}0e 0%, transparent 70%)` }}
            />

            {/* Coloured bottom accent bar — slides in from left on hover */}
            <motion.div
                className="absolute bottom-0 left-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, ${m.color}, ${m.color}40)` }}
                initial={{ width: '0%' }}
                animate={{ width: hovered ? '100%' : '0%' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
            />

            {/* NEXUS MODULE label */}
            <div className="font-mono text-[9px] uppercase tracking-[0.25em] mb-3" style={{ color: m.color }}>
                NEXUS {m.id}
            </div>

            {/* Title — lifts 2px on hover */}
            <motion.h3
                className="font-bold text-foreground text-[19px] mb-3 leading-snug"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                animate={{ y: hovered ? -2 : 0 }}
                transition={{ duration: 0.2 }}
            >
                {m.label}
            </motion.h3>

            {/* Description */}
            <p className="font-mono text-[11px] text-muted-foreground leading-relaxed mb-6">
                {m.desc}
            </p>

            {/* Metric + arrow row */}
            <div className="flex items-center justify-between">
                <motion.span
                    className="font-mono text-[11px] font-semibold"
                    style={{ color: m.color }}
                    animate={{
                        opacity: hovered ? 1 : 0.65,
                        textShadow: hovered ? `0 0 10px ${m.color}` : `0 0 0px ${m.color}`,
                    }}
                    transition={{ duration: 0.25 }}
                >
                    {m.metric}
                </motion.span>
                <motion.span
                    className="font-mono text-[11px]"
                    style={{ color: m.color }}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
                    transition={{ duration: 0.2 }}
                >
                    →
                </motion.span>
            </div>
        </motion.div>
    );
};

export const ModulesSection: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Section id="modules">
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 80% 30%, hsla(155,100%,43%,0.04) 0%, transparent 55%)' }} />
            <div className="container mx-auto max-w-6xl">
                {/* Centred header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                        className="font-mono text-[10px] uppercase tracking-[0.45em] mb-4"
                        style={{ color: 'hsl(186,100%,50%)' }}
                    >
                        System Architecture
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        transition={{ delay: 0.08 }}
                        className="font-bold text-4xl md:text-5xl text-foreground mb-5"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                        Six Causal Modules
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                        transition={{ delay: 0.14 }}
                        className="text-muted-foreground font-mono text-xs max-w-md mx-auto leading-relaxed"
                    >
                        Each module operates independently at the edge, connected by a shared causal inference layer.
                    </motion.p>
                </div>

                {/* 3-col grid — zero borders */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {MODULES.map((m, i) => (
                        <ModuleCard
                            key={m.id}
                            m={m}
                            i={i}
                            onClick={() => navigate(`/dashboard/${m.id.toLowerCase()}`)}
                        />
                    ))}
                </div>
            </div>
        </Section>
    );
};



/* ════════════════════════════════════════════════════════════════
   ARCHITECTURE SECTION
════════════════════════════════════════════════════════════════ */
const ARCH_LAYERS = [
    { label: 'Sensor & Device Layer', items: ['Gate Counters', 'Smart Meters', 'CCTV Array', 'Temp / Humidity', 'BMS Feeds'], color: 'hsl(47,91%,53%)' },
    { label: 'Edge Node Mesh ×6', items: ['Federated Consensus', 'Local AI Inference', 'Causal Graph DB', 'RSA-4096 Auth', 'Sub-3ms Sync'], color: 'hsl(186,100%,50%)' },
    { label: 'NEXUS OS Kernel', items: ['Causal Engine', 'Telemetry Bus', 'Module Orchestrator', 'Action Dispatcher', 'Audit Logger'], color: 'hsl(155,100%,43%)' },
    { label: 'NEXUS Dashboard', items: ['Command Center', 'Real-Time KPIs', 'Causal Graph UI', 'Report Engine', 'Settings & Control'], color: 'hsl(270,80%,70%)' },
];

export const ArchitectureSection: React.FC = () => (
    <Section id="architecture">
        <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 80%, hsla(270,80%,70%,0.04) 0%, transparent 60%)' }} />
        <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-20">
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    className="font-mono text-[10px] uppercase tracking-[0.45em] mb-4" style={{ color: 'hsl(270,80%,70%)' }}>
                    How It Works
                </motion.div>
                <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: 0.08 }} className="font-bold text-4xl md:text-5xl text-foreground mb-5"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Edge-first. Zero-cloud.
                </motion.h2>
                <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ delay: 0.14 }} className="text-muted-foreground font-mono text-xs max-w-sm mx-auto leading-relaxed">
                    Four clean layers. Data never leaves your campus. Decisions in milliseconds.
                </motion.p>
            </div>

            <div className="flex flex-col gap-0 max-w-2xl mx-auto">
                {ARCH_LAYERS.map((layer, i) => (
                    <React.Fragment key={layer.label}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.45 }}
                        >
                            <TiltCard glowColor={layer.color} className="p-7">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                                    <motion.div
                                        className="flex-shrink-0 w-9 h-9 flex items-center justify-center font-mono text-xs font-bold"
                                        style={{ color: layer.color }}
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
                                    >
                                        L{i + 1}
                                    </motion.div>
                                    <div className="flex-1">
                                        <div className="font-bold text-foreground text-[14px] mb-2.5"
                                            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{layer.label}</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {layer.items.map((item, j) => (
                                                <motion.span
                                                    key={item}
                                                    initial={{ opacity: 0 }}
                                                    whileInView={{ opacity: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: i * 0.1 + j * 0.04 }}
                                                    className="font-mono text-[9px] px-2 py-0.5 text-muted-foreground"
                                                    style={{ background: `${layer.color}10` }}
                                                >
                                                    {item}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </TiltCard>
                        </motion.div>
                        {i < ARCH_LAYERS.length - 1 && (
                            <div className="flex justify-center">
                                <motion.div className="w-px" style={{ height: 24, background: 'hsla(186,100%,50%,0.15)' }}
                                    animate={{ opacity: [0.2, 0.7, 0.2] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-16 mt-20">
                {[
                    { value: '< 5ms', label: 'End-to-End Latency' },
                    { value: '6', label: 'Edge Nodes' },
                    { value: '0', label: 'Cloud Dependencies' },
                    { value: '99.9%', label: 'Uptime SLA' },
                ].map((stat, i) => (
                    <motion.div key={stat.label} className="text-center"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}>
                        <motion.div className="font-mono text-4xl font-black text-foreground"
                            animate={{ textShadow: ['0 0 0px hsla(186,100%,50%,0)', '0 0 18px hsla(186,100%,50%,0.4)', '0 0 0px hsla(186,100%,50%,0)'] }}
                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}>
                            {stat.value}
                        </motion.div>
                        <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em] mt-1">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    </Section>
);

/* ════════════════════════════════════════════════════════════════
   CONTACT SECTION
════════════════════════════════════════════════════════════════ */
export const ContactSection: React.FC = () => {
    const [form, setForm] = useState({ name: '', org: '', email: '', message: '' });
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setTimeout(() => { setSending(false); setSent(true); }, 1400);
    };

    const inputClass = "w-full bg-transparent border-b border-border/25 px-0 py-3 font-mono text-[12px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent/60 hover:border-border/50 transition-all duration-200";

    return (
        <Section id="contact">
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 10%, hsla(186,100%,50%,0.04) 0%, transparent 55%)' }} />
            <div className="container mx-auto max-w-5xl">
                <div className="text-center mb-20">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                        className="font-mono text-[10px] uppercase tracking-[0.45em] mb-4" style={{ color: 'hsl(186,100%,50%)' }}>
                        Get In Touch
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        transition={{ delay: 0.08 }} className="font-bold text-4xl md:text-5xl text-foreground mb-5"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Let's build smarter.
                    </motion.h2>
                    <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                        transition={{ delay: 0.14 }} className="text-muted-foreground font-mono text-xs max-w-sm mx-auto leading-relaxed">
                        Deployable in under 72 hours. No cloud setup. No vendor lock-in.
                    </motion.p>
                </div>

                <div className="flex flex-col lg:flex-row gap-20">
                    <div className="lg:w-2/5 space-y-6">
                        {[
                            { label: 'Email', value: 'nexus@campus.ai' },
                            { label: 'Deploy SLA', value: '< 72 Hours' },
                            { label: 'Support', value: '24 / 7 Edge Monitoring' },
                        ].map((item, i) => (
                            <motion.div key={item.label}
                                className="flex items-center gap-5"
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}>
                                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground w-20">{item.label}</span>
                                <span className="font-mono text-[11px] text-foreground">{item.value}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex-1">
                        {sent ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 text-center gap-4">
                                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
                                    className="font-mono text-3xl" style={{ color: 'hsl(186,100%,50%)' }}>◉</motion.div>
                                <div className="font-bold text-foreground text-xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Message received.</div>
                                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">We'll respond within 24 hours.</div>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <input required className={inputClass} placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                    <input required className={inputClass} placeholder="Organisation" value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))} />
                                </div>
                                <input required type="email" className={inputClass} placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                                <textarea required rows={4} className={inputClass} placeholder="Tell us about your campus..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                                <motion.button
                                    type="submit" disabled={sending}
                                    whileHover={{ scale: 1.01, boxShadow: '0 0 24px hsla(186,100%,50%,0.12)' }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3.5 border border-accent/25 bg-accent/5 font-mono text-[11px] text-accent uppercase tracking-widest hover:bg-accent/10 transition-all flex items-center justify-center gap-2"
                                >
                                    {sending
                                        ? <><motion.span className="w-1.5 h-1.5 rounded-full bg-accent" animate={{ scale: [1, 1.6, 1] }} transition={{ duration: 0.5, repeat: Infinity }} />TRANSMITTING...</>
                                        : <><span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />SEND MESSAGE</>}
                                </motion.button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="mt-24 pt-8 border-t border-border/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">© 2026 NEXUS OS — Edge Intelligence Platform</div>
                    <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">Zero Cloud · Sub-5ms · Always On</div>
                </div>
            </div>
        </Section>
    );
};
