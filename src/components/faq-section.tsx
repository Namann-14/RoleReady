'use client';
import { useEffect, useRef, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const FAQSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  const faqs = [
    {
      question: 'How does PathPilot create personalized roadmaps?',
      answer: 'PathPilot uses AI to analyze job market data, skill requirements, and industry trends to create customized learning paths. We consider your current experience, learning pace, and career goals to build a roadmap that\'s perfectly tailored to you.'
    },
    {
      question: 'Are the certificates recognized by employers?',
      answer: 'Yes! Our certificates are verified and recognized by leading companies across various industries. We partner with established education providers and maintain high standards for certification requirements.'
    },
    {
      question: 'Can I change my career goal after starting a roadmap?',
      answer: 'Absolutely! Your career goals may evolve, and PathPilot adapts with you. You can modify your target role at any time, and we\'ll adjust your roadmap accordingly, preserving relevant progress you\'ve already made.'
    },
    {
      question: 'How long does it typically take to complete a roadmap?',
      answer: 'Timeline varies based on your target role and time commitment. Most users complete their roadmaps in 6-12 months, dedicating 5-10 hours per week. Our progress tracking helps you stay on pace and adjust timelines as needed.'
    },
    {
      question: 'What if I get stuck or need help during my learning journey?',
      answer: 'We provide multiple support channels including community forums, email support, and for Pro users, monthly 1-on-1 coaching sessions. Our AI assistant is also available 24/7 to answer questions and provide guidance.'
    },
    {
      question: 'Do you offer refunds if I\'m not satisfied?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all paid plans. If you\'re not completely satisfied with PathPilot, we\'ll provide a full refund, no questions asked.'
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

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-24 border-t border-white/5" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 section-animate">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
            Frequently asked <span className="gradient-text font-medium">questions</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto font-light">
            Everything you need to know about PathPilot and your learning journey
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="section-animate mb-4" style={{ animationDelay: `${index * 0.1}s` }}>
              <Collapsible
                open={openItems.has(index)}
                onOpenChange={() => toggleItem(index)}
              >
                <CollapsibleTrigger className="glass-card p-6 w-full text-left hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white pr-4">{faq.question}</h3>
                    <i className={`ph ${openItems.has(index) ? 'ph-minus' : 'ph-plus'} text-white/70 text-xl flex-shrink-0 transition-transform duration-300`}></i>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6">
                  <div className="pt-4 border-t border-white/10 mt-4">
                    <p className="text-white/80 leading-relaxed">{faq.answer}</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
