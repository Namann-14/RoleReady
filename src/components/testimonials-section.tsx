'use client';
import { useEffect, useRef, useState } from 'react';

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Frontend Developer at Google',
      avatar: 'SC',
      content: 'PathPilot transformed my career from marketing to tech. The roadmap was perfectly structured and the progress tracking kept me motivated throughout my 8-month journey.',
      rating: 5
    },
    {
      name: 'Marcus Johnson',
      role: 'Data Scientist at Microsoft',
      avatar: 'MJ',
      content: 'The personalized learning path was exactly what I needed. I went from complete beginner to landing my dream job in data science within 10 months.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer at Airbnb',
      avatar: 'ER',
      content: 'The skill assessments and project-based learning approach helped me build a portfolio that impressed employers. Couldn\'t be happier with the results!',
      rating: 5
    },
    {
      name: 'David Park',
      role: 'DevOps Engineer at Amazon',
      avatar: 'DP',
      content: 'PathPilot\'s roadmap helped me transition from traditional IT to cloud engineering. The certificate validation gave me confidence in interviews.',
      rating: 5
    }
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-24" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 section-animate">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
            Success <span className="gradient-text font-medium">stories</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto font-light">
            Join thousands who've transformed their careers with PathPilot
          </p>
        </div>

        <div className="max-w-4xl mx-auto section-animate">
          <div className="glass-card p-8 md:p-12 text-center">
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="ph-fill ph-star text-yellow-400 text-xl mr-1"></i>
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl text-white/90 font-light leading-relaxed mb-8">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-medium text-sm">
                  {testimonials[currentTestimonial].avatar}
                </span>
              </div>
              <div className="text-left">
                <div className="text-white font-medium">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-white/60 text-sm">
                  {testimonials[currentTestimonial].role}
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? 'bg-blue-400 w-8' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;