'use client';
import { useEffect, useRef } from 'react';

const FeaturesSection = () => {
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

  const features = [
    {
      icon: 'ph-chart-line-up',
      title: 'Skill Progress Tracking',
      description: 'Visual progress bars and achievements to track your learning journey and stay motivated.',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: 'ph-brain',
      title: 'Quizzes & Practice Tests',
      description: 'Interactive assessments to reinforce learning and identify areas for improvement.',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: 'ph-graduation-cap',
      title: 'Recommended Courses',
      description: 'Curated course recommendations from top platforms based on your career goals.',
      color: 'from-green-400 to-emerald-400'
    },
    {
      icon: 'ph-medal',
      title: 'Certificate of Completion',
      description: 'Industry-recognized certificates to showcase your skills to potential employers.',
      color: 'from-orange-400 to-red-400'
    }
  ];

  return (
    <section id="features" className="py-24 border-t border-white/5" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 section-animate">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
            Everything you need to <span className="gradient-text font-medium">succeed</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto font-light">
            Comprehensive tools and resources to accelerate your career transformation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="section-animate" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="glass-card p-6 hover:bg-white/10 transition-all duration-300 h-full group">
                <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${feature.icon} text-white text-xl`}></i>
                </div>
                <h3 className="text-lg font-medium text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;