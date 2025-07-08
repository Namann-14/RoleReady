'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

const featuredLogos = [
  { name: 'TechCrunch', logo: '/logos/techcrunch.png' },
  { name: 'Forbes', logo: '/logos/forbes.png' },
  { name: 'Wired', logo: '/logos/wired.png' },
  { name: 'Harvard Business Review', logo: '/logos/hbr.png' },
  { name: 'MIT Technology Review', logo: '/logos/mit.png' },
  { name: 'Bloomberg', logo: '/logos/bloomberg.png' },
];

const logos = [...featuredLogos, ...featuredLogos]; // Duplicate for seamless loop

const scrollVariants = {
  animate: {
    x: ['0%', '-50%'],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: 'loop',
        duration: 18,
        ease: 'linear',
      },
    },
  },
};

const FeaturedSection = () => (
  <section className="py-16 border-b border-purple-400/10 bg-transparent">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <p className="text-white/60 text-sm uppercase tracking-wider font-medium mb-8">
          Featured In
        </p>
        <div className="relative overflow-x-hidden overflow-y-hidden">
          <motion.div
            className="flex gap-12 min-w-max"
            variants={scrollVariants}
            animate="animate"
            aria-label="Featured company logos"
          >
            {logos.map((company, idx) => (
              <div
                key={company.name + idx}
                className="flex items-center justify-center w-32 h-16 glass-card bg-white/5 hover:bg-purple-400/10 transition-all duration-300 rounded-lg"
                title={company.name}
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={120}
                  height={40}
                  className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

export default FeaturedSection;