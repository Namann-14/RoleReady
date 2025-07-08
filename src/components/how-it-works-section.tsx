'use client';
import { useEffect, useRef } from 'react';

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.section-animate');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      icon: 'ph-magnifying-glass',
      title: 'Search Your Career Goal',
      description: 'Tell us your dream job title and we\'ll analyze the skills, experience, and qualifications needed to get there.',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: 'ph-path',
      title: 'Follow Your Personalized Roadmap',
      description: 'Get a step-by-step learning path with curated courses, projects, and milestones tailored to your target role.',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: 'ph-certificate',
      title: 'Earn Your Certificate',
      description: 'Complete assessments and projects to earn industry-recognized certificates that validate your new skills.',
      color: 'from-green-400 to-green-600'
    }
  ];

  return (
    <section id="how-it-works" className="py-24" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 section-animate">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
            How <span className="gradient-text font-medium">PathPilot</span> Works
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto font-light">
            Three simple steps to transform your career and land your dream job
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="section-animate" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="glass-card p-8 text-center hover:bg-white/10 transition-all duration-300 h-full">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center`}>
                  <i className={`${step.icon} text-white text-2xl`}></i>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-white/50 text-sm font-medium mr-2">STEP {index + 1}</span>
                  <div className="flex-1 h-px bg-white/20"></div>
                </div>
                <h3 className="text-xl font-medium text-white mb-4">{step.title}</h3>
                <p className="text-white/70 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;