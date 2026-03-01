import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    activating: boolean;
    onComplete: () => void;
}

/* ── Matrix rain column ──────────────────────────────────────────────────── */
const CHARS = 'アイウエオカキクΔΩΨΞ01248NEXUSCYBERNET∞⌬◈▲▼◉ΨΛΩΦ∑∏∂∇€¥£';
const HACK_LINES = [
    '> INITIALISING NEXUS KERNEL v4.2.0...',
    '> DECRYPTING TELEMETRY VAULT............[OK]',
    '> AUTH: RSA-4096 HANDSHAKE..............[OK]',
    '> MOUNTING /dev/campus_alpha............[OK]',
    '> CAUSAL_ENGINE: ARMED...................[OK]',
    '> NODE_MESH: 6/6 SYNCED.................[OK]',
    '> LIVE_STREAM://nexus.local:9000........[OK]',
    '> ALL SYSTEMS ██████████ ONLINE',
];
const SHUTDOWN_LINES = [
    '> FLUSHING LIVE TELEMETRY CACHE.........',
    '> DISARMING CAUSAL_ENGINE...............[OK]',
    '> UNMOUNTING /dev/campus_alpha...........[OK]',
    '> WIPING SESSION KEYS...................[OK]',
    '> POWERING DOWN NODE_MESH 6/6...........[OK]',
    '> ALL SYSTEMS ██████████ STANDBY',
];

/* Canvas-based matrix rain — much smoother than DOM approach */
const MatrixCanvas: React.FC<{ color: string }> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const cols = Math.floor(canvas.width / 18);
        const drops = Array.from({ length: cols }, () => Math.random() * -40);
        const frame = () => {
            ctx.fillStyle = 'rgba(0,0,0,0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = '14px "JetBrains Mono", monospace';
            for (let i = 0; i < drops.length; i++) {
                const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
                // bright tip
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.fillText(ch, i * 18, drops[i] * 18);
                // trailing chars
                ctx.fillStyle = color;
                ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * 18, (drops[i] - 1) * 18);
                if (drops[i] * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i] += 0.4 + Math.random() * 0.4;
            }
        };
        const id = setInterval(frame, 33);
        return () => clearInterval(id);
    }, [color]);
    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

/* Vortex ring — a single rotating segmented arc ring */
const VortexRing: React.FC<{
    size: number; dir: 1 | -1; speed: number; segments: number;
    color: string; opacity: number; delay: number;
}> = ({ size, dir, speed, segments, color, opacity, delay }) => {
    const r = size / 2;
    const cx = r, cy = r;
    const segLen = (2 * Math.PI * r) / segments;
    const gap = segLen * 0.35;
    const st = segLen - gap;
    const total = 2 * Math.PI * r;
    return (
        <motion.svg
            width={size} height={size}
            className="absolute"
            style={{ top: '50%', left: '50%', marginLeft: -r, marginTop: -r }}
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity, rotate: dir * 360 * 6 }}
            transition={{ opacity: { delay, duration: 0.3 }, rotate: { delay, duration: speed, ease: 'linear', repeat: Infinity } }}
        >
            <circle
                cx={cx} cy={cy} r={r - 2}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeDasharray={`${st} ${gap}`}
                style={{ filter: `drop-shadow(0 0 4px ${color})` }}
            />
        </motion.svg>
    );
};

/* Radial pulse wave */
const PulseWave: React.FC<{ color: string; delay: number }> = ({ color, delay }) => (
    <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ top: '50%', left: '50%', border: `1px solid ${color}`, boxShadow: `0 0 12px ${color}` }}
        initial={{ width: 40, height: 40, marginLeft: -20, marginTop: -20, opacity: 0.8 }}
        animate={{ width: '200vmax', height: '200vmax', marginLeft: '-100vmax', marginTop: '-100vmax', opacity: 0 }}
        transition={{ delay, duration: 1.0, ease: 'easeOut' }}
    />
);

/* Scrambling text — cycles through random chars before settling */
const ScrambleText: React.FC<{ target: string; delay: number; color: string }> = ({ target, delay, color }) => {
    const [display, setDisplay] = useState(() => Array(target.length).fill('_').join(''));
    const frameRef = useRef(0);
    const startRef = useRef<number | null>(null);
    useEffect(() => {
        const tid = window.setTimeout(() => {
            const start = performance.now();
            startRef.current = start;
            const update = (now: number) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / 700, 1);
                const settled = Math.floor(progress * target.length);
                setDisplay(
                    target.split('').map((ch, i) => {
                        if (i < settled) return ch;
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    }).join('')
                );
                if (progress < 1) frameRef.current = requestAnimationFrame(update);
            };
            frameRef.current = requestAnimationFrame(update);
        }, delay * 1000);
        return () => { window.clearTimeout(tid); cancelAnimationFrame(frameRef.current); };
    }, [target, delay]);
    return (
        <span className="font-mono font-bold tracking-[0.15em]" style={{ color }}>
            {display}
        </span>
    );
};

/* ── Main overlay ─────────────────────────────────────────────────────────── */
const SimulationBootOverlay: React.FC<Props> = ({ activating, onComplete }) => {
    const [termLines, setTermLines] = useState<string[]>([]);
    const [phase, setPhase] = useState<'rain' | 'pulse' | 'collapse'>('rain');
    const timers = useRef<number[]>([]);
    const lines = activating ? HACK_LINES : SHUTDOWN_LINES;
    const accent = activating ? '#00fff7' : '#ff3860';
    const accent2 = activating ? '#14ff8c' : '#ffb347';

    const addLine = useCallback((line: string) => {
        setTermLines(prev => [...prev.slice(-10), line]);
    }, []);

    useEffect(() => {
        // Stagger each terminal line
        lines.forEach((l, i) => {
            const t = window.setTimeout(() => addLine(l), 200 + i * 210);
            timers.current.push(t);
        });
        // Pulse wave phase
        const p1 = window.setTimeout(() => setPhase('pulse'), 500);
        // Collapse + complete
        const p2 = window.setTimeout(() => setPhase('collapse'), 200 + lines.length * 210 + 200);
        const p3 = window.setTimeout(() => onComplete(), 200 + lines.length * 210 + 650);
        timers.current.push(p1, p2, p3);
        return () => timers.current.forEach(clearTimeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] overflow-hidden"
            style={{ background: '#000' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: phase === 'collapse' ? 0 : 1 }}
            transition={{ duration: phase === 'collapse' ? 0.4 : 0.05 }}
        >
            {/* ─ 1. Matrix rain canvas ─────────────────────────────── */}
            <div className="absolute inset-0 opacity-40">
                <MatrixCanvas color={accent} />
            </div>

            {/* ─ 2. Dark vignette so centre elements pop ───────────── */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(0,0,0,0.85) 70%)' }} />

            {/* ─ 3. UFO Vortex ring system at centre ───────────────── */}
            <div className="absolute inset-0 pointer-events-none">
                {[
                    { size: 520, dir: 1 as const, speed: 4.0, segments: 12, color: `${accent}50`, opacity: 0.5, delay: 0.0 },
                    { size: 420, dir: -1 as const, speed: 3.2, segments: 8, color: `${accent}70`, opacity: 0.6, delay: 0.05 },
                    { size: 330, dir: 1 as const, speed: 2.5, segments: 16, color: accent2, opacity: 0.5, delay: 0.1 },
                    { size: 240, dir: -1 as const, speed: 1.8, segments: 6, color: accent, opacity: 0.7, delay: 0.15 },
                    { size: 160, dir: 1 as const, speed: 1.2, segments: 10, color: `${accent2}cc`, opacity: 0.6, delay: 0.2 },
                    { size: 90, dir: -1 as const, speed: 0.8, segments: 4, color: accent, opacity: 0.9, delay: 0.25 },
                ].map((r, i) => <VortexRing key={i} {...r} />)}

                {/* UFO-disc glow beneath rings */}
                <motion.div
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: 180, height: 40,
                        background: `radial-gradient(ellipse, ${accent}60 0%, transparent 70%)`,
                        filter: 'blur(8px)',
                    }}
                    animate={{ scaleX: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Core orb ─ pulsing energy ball */}
                <motion.div
                    className="absolute rounded-full"
                    style={{
                        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                        width: 18, height: 18,
                        background: `radial-gradient(circle, white 10%, ${accent} 60%, transparent 100%)`,
                    }}
                    animate={{
                        boxShadow: [
                            `0 0 12px 4px ${accent}aa, 0 0 40px ${accent}50`,
                            `0 0 30px 10px ${accent}ff, 0 0 80px 20px ${accent}60`,
                            `0 0 12px 4px ${accent}aa, 0 0 40px ${accent}50`,
                        ],
                        scale: [1, 1.6, 1],
                    }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            {/* ─ 4. Pulse waves ─────────────────────────────────────── */}
            {(phase === 'pulse' || phase === 'collapse') && (
                <>
                    <PulseWave color={accent} delay={0} />
                    <PulseWave color={accent2} delay={0.25} />
                    <PulseWave color={accent} delay={0.5} />
                </>
            )}

            {/* ─ 5. Terminal hacking log (bottom-left) ──────────────── */}
            <div
                className="absolute bottom-8 left-8 font-mono text-[10px] space-y-[2px]"
                style={{ maxWidth: 460 }}
            >
                {termLines.map((line, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.08 }}
                        style={{
                            color: line.includes('[OK]') ? accent2
                                : line.includes('ONLINE') || line.includes('STANDBY') ? accent
                                    : 'hsla(224,100%,90%,0.55)',
                            textShadow: line.includes('[OK]') ? `0 0 6px ${accent2}` : 'none',
                        }}
                    >
                        {line}
                    </motion.div>
                ))}
                {/* Blinking cursor */}
                <motion.span
                    className="inline-block w-[7px] h-[12px] ml-1"
                    style={{ background: accent }}
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                />
            </div>

            {/* ─ 6. Scrambling status headline (top-centre) ─────────── */}
            <div className="absolute top-8 w-full flex flex-col items-center gap-2 pointer-events-none">
                <motion.div
                    className="font-mono text-[9px] uppercase tracking-[0.5em]"
                    style={{ color: `${accent}90` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    NEXUS OS v4.2 — {activating ? 'BOOT SEQUENCE' : 'SHUTDOWN SEQUENCE'}
                </motion.div>
                <div className="text-xl">
                    <ScrambleText
                        target={activating ? '◉  SYSTEM ONLINE  ◉' : '◎  STANDBY MODE  ◎'}
                        delay={0.3}
                        color={accent}
                    />
                </div>
            </div>

            {/* ─ 7. Corner HUD brackets ─────────────────────────────── */}
            {[
                { style: { top: 12, left: 12 }, r: 0 },
                { style: { top: 12, right: 12 }, r: 90 },
                { style: { bottom: 12, right: 12 }, r: 180 },
                { style: { bottom: 12, left: 12 }, r: 270 },
            ].map(({ style, r }, i) => (
                <motion.div key={i} className="absolute w-10 h-10" style={style as any}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.7, scale: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}>
                    <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
                        <path d={`M0,20 L0,0 L20,0`} stroke={accent} strokeWidth="1.5"
                            transform={`rotate(${r},20,20)`} />
                    </svg>
                </motion.div>
            ))}

            {/* ─ 8. Collapse: centre implosion then flash ────────────── */}
            {phase === 'collapse' && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 50%, white 0%, ${accent} 10%, transparent 60%)` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.45, ease: 'easeInOut' }}
                />
            )}
        </motion.div>
    );
};

export default SimulationBootOverlay;
