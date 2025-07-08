'use client';
import { useEffect, useRef, useState } from 'react';

const RoadmapShowcaseSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set([0, 1]));

  const roadmapItems = [
    { title: 'HTML & CSS Fundamentals', progress: 100, completed: true },
    { title: 'JavaScript Basics', progress: 100, completed: true },
    { title: 'React.js Framework', progress: 75, completed: false },
    { title: 'State Management (Redux)', progress: 30, completed: false },
    { title: 'API Integration', progress: 0, completed: false },
    { title: 'Testing & Deployment', progress: 0, completed: false },
  ];

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

  const toggleItem = (index: number) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(index)) {
      newCheckedItems.delete(index);
    } else {
      newCheckedItems.add(index);
    }
    setCheckedItems(newCheckedItems);
  };

  return (
    <section className="py-24 border-t border-white/5" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="section-animate">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
              Your learning journey,{' '}
              <span className="gradient-text font-medium">visualized</span>
            </h2>
            <p className="text-xl text-white/70 mb-8 font-light leading-relaxed">
              Track your progress with our interactive roadmap. Check off completed tasks, 
              monitor your skill development, and stay motivated as you advance toward your career goals.
            </p>
            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="text-white/70 text-sm">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                <span className="text-white/70 text-sm">In Progress</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white/30 rounded-full mr-2"></div>
                <span className="text-white/70 text-sm">Not Started</span>
              </div>
            </div>
          </div>

          {/* Interactive Roadmap */}
          <div className="section-animate">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-medium text-lg">Frontend Developer Roadmap</h3>
                <span className="text-white/60 text-sm">4 of 6 completed</span>
              </div>
              
              <div className="space-y-4">
                {roadmapItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 group">
                    <button
                      onClick={() => toggleItem(index)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                        checkedItems.has(index) || item.completed
                          ? 'bg-green-400 border-green-400'
                          : 'border-white/30 hover:border-white/50'
                      }`}
                    >
                      {(checkedItems.has(index) || item.completed) && (
                        <i className="ph ph-check text-white text-xs"></i>
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium transition-colors ${
                          checkedItems.has(index) || item.completed 
                            ? 'text-white line-through' 
                            : 'text-white/90'
                        }`}>
                          {item.title}
                        </span>
                        <span className="text-white/60 text-xs">
                          {item.progress}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            item.progress === 100 ? 'bg-green-400' : 'bg-blue-400'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Overall Progress</span>
                  <span className="text-white font-medium">67%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapShowcaseSection;