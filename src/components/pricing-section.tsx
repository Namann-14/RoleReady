'use client';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

const PricingSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for exploring your career options',
      features: [
        'Basic career roadmaps',
        'Progress tracking',
        'Community access',
        'Email support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'Accelerate your career transformation',
      features: [
        'Unlimited detailed roadmaps',
        'AI-powered recommendations',
        'Live skill assessments',
        'Industry certificates',
        'Priority support',
        '1-on-1 career coaching (monthly)'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Team management dashboard',
        'Custom learning paths',
        'Advanced analytics',
        'Dedicated account manager',
        'SSO integration'
      ],
      cta: 'Contact Sales',
      popular: false
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

  return (
    <section id="pricing" className="py-24 border-t border-white/5" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 section-animate">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
            Choose your <span className="gradient-text font-medium">path</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto font-light">
            Start free and upgrade as you grow. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className="section-animate" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`glass-card p-8 h-full relative ${
                plan.popular 
                  ? 'ring-2 ring-blue-400/50 bg-gradient-to-b from-blue-500/10 to-purple-500/10' 
                  : 'hover:bg-white/5'
              } transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Recommended
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-xl font-medium text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-light text-white">{plan.price}</span>
                    {plan.price !== 'Custom' && (
                      <span className="text-white/60 text-sm ml-1">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-white/70 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <i className="ph ph-check-circle text-green-400 mr-3 mt-0.5 flex-shrink-0"></i>
                      <span className="text-white/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className={`w-full neuro-button text-white font-medium ${
                  plan.popular ? 'animate-glow' : ''
                }`}>
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 section-animate">
          <p className="text-white/60 text-sm">
            All plans include 14-day free trial • No setup fees • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;