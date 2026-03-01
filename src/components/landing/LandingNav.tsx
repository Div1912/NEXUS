import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NexusLogo from '@/components/dashboard/NexusLogo';

const NAV_LINKS = [
    { label: 'Platform', href: '#platform' },
    { label: 'Modules', href: '#modules' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Contact', href: '#contact' },
];

const LandingNav: React.FC = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState<string | null>(null);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 24);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    const handleLink = (href: string) => {
        setActive(href);
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <motion.nav
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16"
            style={{
                background: scrolled
                    ? 'hsla(236,44%,5%,0.88)'
                    : 'transparent',
                backdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
                borderBottom: scrolled ? '1px solid hsla(186,100%,50%,0.08)' : '1px solid transparent',
                transition: 'background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease',
            }}
        >
            {/* ── Logo ────────────────────────────────────────────── */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2.5 group"
            >
                <NexusLogo size={28} />
                <span
                    className="font-mono font-bold text-[13px] tracking-[0.2em] uppercase text-foreground group-hover:text-accent transition-colors"
                >
                    NEXUS OS
                </span>
            </button>

            {/* ── Nav links ───────────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-1">
                {NAV_LINKS.map((link) => (
                    <button
                        key={link.href}
                        onClick={() => handleLink(link.href)}
                        className="relative px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        {link.label}
                        {/* Animated underline */}
                        <motion.span
                            className="absolute bottom-0 left-4 right-4 h-px"
                            style={{ background: 'hsl(186,100%,50%)', boxShadow: '0 0 6px hsl(186,100%,50%)' }}
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.2 }}
                        />
                        {/* Active dot */}
                        <AnimatePresence>
                            {active === link.href && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    className="absolute top-1 right-2 w-1 h-1 rounded-full bg-accent"
                                    style={{ boxShadow: '0 0 4px hsl(186,100%,50%)' }}
                                />
                            )}
                        </AnimatePresence>
                    </button>
                ))}
            </div>

            {/* ── CTA ─────────────────────────────────────────────── */}
            <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 24px hsla(186,100%,50%,0.2)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 border border-accent/30 bg-accent/5 font-mono text-[10px] text-accent uppercase tracking-widest hover:bg-accent/10 transition-all"
            >
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                GET STARTED
            </motion.button>
        </motion.nav>
    );
};

export default LandingNav;
