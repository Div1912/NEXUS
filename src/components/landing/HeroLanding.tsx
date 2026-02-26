import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NeuralMesh from './NeuralMesh';
import StatCounter from './StatCounter';
import CampusVisualization from './CampusVisualization';
import { Button } from '@/components/ui/button';

const HeroLanding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-background">
      <NeuralMesh />

      {/* Radial glow accents */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-16">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-5xl md:text-7xl font-extrabold leading-[1.05] mb-6"
          >
            The Campus
            <br />
            That <span className="nexus-gradient-text">Thinks.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-xl mb-10 leading-relaxed"
          >
            Causal AI for campus infrastructure — edge-native, sub-5ms response.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-8 mb-10 flex-wrap"
          >
            <StatCounter value="< 5" label="ms Latency" delay={600} />
            <StatCounter value="6" label="Modules" delay={750} />
            <StatCounter value="100" label="% Edge" delay={900} />
            <StatCounter value="0" label="Cloud" delay={1050} />
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex gap-4 flex-wrap"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-8 transition-transform active:scale-[0.98] hover:scale-[1.02]"
              onClick={() => navigate('/dashboard')}
            >
              Explore Dashboard
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent/10 font-semibold rounded-xl px-8 transition-transform active:scale-[0.98] hover:scale-[1.02]"
            >
              View Architecture
            </Button>
          </motion.div>
        </div>

        {/* Right — Campus Visualization */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <CampusVisualization />
        </div>
      </div>
    </div>
  );
};

export default HeroLanding;
