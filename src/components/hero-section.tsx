'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, cubicBezier } from 'framer-motion';
import { Badge } from './ui/badge';
import { Rocket } from 'lucide-react';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: cubicBezier(0.4, 0, 0.2, 1) } },
};

const HeroSection = () => {
  const [jobTitle, setJobTitle] = useState('');

  const handleGenerateRoadmap = () => {
    if (jobTitle.trim()) {
      console.log('Generating roadmap for:', jobTitle);
      // Here you would typically navigate to a roadmap page or trigger roadmap generation
    }
  };

  return (
    <section className="h-screen flex flex-col justify-center relative overflow-hidden">
      {/* Spline Background */}
      <div className="absolute inset-0 -z-10 w-full h-full">
        {/* <iframe src='https://my.spline.design/worldplanet-f0PEjiO2lyA98Gb4iFm5Dn1a/'
          width='100%'
          height='100%'
        ></iframe> */}
        <iframe src='https://my.spline.design/glowingplanetparticles-oXQBauqIGIfegN3iqvAAOSlW/' 
          width='100%' 
          height='100%'
        ></iframe>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 h-full flex flex-col justify-center">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center px-4 py-2 glass-card mb-8 text-sm text-white/80"
          >
            <Badge className="ml-3 bg-purple-400/15 text-white py-1 ">
              Trusted by 50,000+ career changers
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl font-light mb-6 text-white leading-tight tracking-tight"
          >
            Master skills to land your{' '}
            <span className="gradient-text font-medium">dream role</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeUp}
            className="text-xl md:text-2xl text-white/70 mb-12 font-light max-w-3xl mx-auto leading-relaxed"
          >
            Get AI-powered, personalized career roadmap with step-by-step guidance,
            skill tracking, and industry-recognized certificates.
          </motion.p>

          {/* Input and CTA */}
          <motion.div variants={fadeUp} className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4 glass-card p-6">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter your dream job title (e.g., Frontend Developer)"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="bg-white/10 border-purple-300/30 text-white placeholder:text-white/50 text-lg h-12 focus:border-purple-300/50 focus:ring-purple-300/25"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateRoadmap()}
                />
              </div>
              <Button
                onClick={handleGenerateRoadmap}
                className="h-12 px-8 text-white font-medium text-lg"
                variant="default"
                disabled={!jobTitle.trim()}
              >
                <Rocket className="inline-block mr-2" />
                Generate My Roadmap
              </Button>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.p
            variants={fadeUp}
            className="text-white/50 text-sm mb-8"
          >
            No credit card required • Free forever plan available
          </motion.p>

          {/* Scroll Indicator */}
          <motion.div
            variants={fadeUp}
            className="animate-bounce"
          >
            <i className="ph ph-arrow-down text-white/50 text-2xl"></i>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;