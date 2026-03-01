import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NeuralMesh from './NeuralMesh';
import StatCounter from './StatCounter';
import CampusVisualization from './CampusVisualization';
import NexusLogo from '@/components/dashboard/NexusLogo';
import BootSequence from './BootSequence';
import LandingNav from './LandingNav';
import { PlatformSection, ModulesSection, ArchitectureSection, ContactSection } from './LandingSections';

// ── Typewriter component: types left→right, holds, erases right→left, loops ──
const TypewriterText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<'typing' | 'holding' | 'erasing'>('typing');

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => {
          setDisplayed(text.slice(0, displayed.length + 1));
        }, 80);
      } else {
        // Full text shown — hold before erasing
        timeout = setTimeout(() => setPhase('holding'), 1800);
      }
    } else if (phase === 'holding') {
      timeout = setTimeout(() => setPhase('erasing'), 0);
    } else if (phase === 'erasing') {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, displayed.length - 1));
        }, 45);
      } else {
        // All erased — pause then start typing again
        timeout = setTimeout(() => setPhase('typing'), 600);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, text]);

  return (
    <span className={className}>
      {displayed}
      <span
        className="inline-block w-[3px] h-[0.85em] ml-[2px] align-middle"
        style={{
          background: 'linear-gradient(135deg, hsl(357, 85%, 52%), hsl(186, 100%, 50%))',
          animation: 'typewriter-blink 1s step-end infinite',
          verticalAlign: 'middle',
        }}
      />
    </span>
  );
};

const HeroLanding: React.FC = () => {
  const navigate = useNavigate();
  const archRef = useRef<HTMLDivElement>(null);
  const [booting, setBooting] = useState(false);

  const scrollToArch = () => {
    archRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <LandingNav />
      {booting && <BootSequence onComplete={() => navigate('/dashboard')} />}
      {/* HERO SECTION */}
      <div className="relative min-h-screen flex items-center overflow-hidden">
        <NeuralMesh />

        {/* Radial glows */}
        <div className="absolute top-1/4 left-1/6 w-[700px] h-[700px] rounded-full bg-primary/8 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/6 w-[600px] h-[600px] rounded-full bg-accent/6 blur-[120px] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 pt-20 pb-20 flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-8"
            >
              <NexusLogo size={40} />
              <span className="font-display font-bold text-foreground tracking-wider text-sm">NEXUS OS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl font-extrabold leading-[1.05] mb-6"
            >
              The Campus
              <br />
              That{' '}
              <TypewriterText
                text="Thinks"
                className="nexus-gradient-text"
              />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="max-w-lg mb-10 leading-snug"
            >
              <span className="block text-foreground text-lg font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Your buildings are smart
              </span>
              <span className="block text-foreground text-lg font-semibold mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Your infrastructure should be{' '}
                <span className="nexus-gradient-text">Intelligent</span>
              </span>
              <span className="block font-mono text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
                Edge native AI powering autonomous campus infrastructure
              </span>
            </motion.p>


            {/* Stats as telemetry strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-0 mb-10"
            >
              <StatCounter value="< 5" label="ms Latency" delay={600} />
              <div className="w-px h-8 bg-accent/20 mx-4" />
              <StatCounter value="6" label="Modules" delay={750} />
              <div className="w-px h-8 bg-accent/20 mx-4" />
              <StatCounter value="100" label="% Edge" delay={900} />
              <div className="w-px h-8 bg-accent/20 mx-4" />
              <StatCounter value="0" label="Cloud" delay={1050} />
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex gap-4 flex-wrap"
            >
              <button
                onClick={() => setBooting(true)}
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_30px_hsla(357,85%,52%,0.3)]"
              >
                Explore Dashboard
              </button>
              <button
                onClick={scrollToArch}
                className="px-8 py-3 border border-accent/40 text-accent font-mono text-xs uppercase tracking-widest hover:bg-accent/5 hover:border-accent/60 transition-all"
              >
                View Architecture
              </button>
            </motion.div>
          </div>

          {/* Right — Campus Visualization */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <CampusVisualization />
          </div>
        </div>
      </div>

      {/* ARCHITECTURE SECTION */}
      <div ref={archRef} className="relative py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <div className="font-mono text-xs text-accent/60 uppercase tracking-[0.3em] mb-4">System Architecture</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Six Causal Modules</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm">Each module operates independently at the edge, connected by a shared causal inference layer.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-accent/5">
            {[
              { id: 'FLOW', title: 'Smart Mobility', desc: 'Real-time pedestrian flow, gate management, shuttle orchestration', metric: 'Real-time' },
              { id: 'ECO', title: 'Energy Intelligence', desc: 'Consumption optimization, solar integration, grid load balancing', metric: 'Autonomous' },
              { id: 'SPACE', title: 'Spatial Intelligence', desc: 'Room occupancy, density mapping, dynamic space allocation', metric: '30 Zones' },
              { id: 'MAINTAIN', title: 'Predictive Maintenance', desc: 'Equipment health scoring, MTBF prediction, auto-dispatch', metric: 'Predictive' },
              { id: 'GUARD', title: 'Safety & Security', desc: 'Threat detection, perimeter monitoring, anomaly classification', metric: '48 Cameras' },
              { id: 'FEDERATE', title: 'Edge Federation', desc: 'Node synchronization, distributed inference, bandwidth optimization', metric: '6 Nodes' },
            ].map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-background p-8 group hover:bg-secondary/30 transition-colors cursor-pointer card-3d"
                onClick={() => navigate(`/dashboard/${m.id.toLowerCase()}`)}
              >
                <div className="font-mono text-[10px] text-accent/50 uppercase tracking-[0.2em] mb-2">NEXUS {m.id}</div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{m.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{m.desc}</p>
                <div className="font-mono text-sm text-accent">{m.metric}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ─ Landing page content sections ─ */}
      <PlatformSection />
      <ModulesSection />
      <ArchitectureSection />
      <ContactSection />
    </div>
  );
};

export default HeroLanding;
