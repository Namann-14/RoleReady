import Navigation from '@/components/navigation';
import HeroSection from '@/components/hero-section';
import FeaturedSection from '@/components/featured-section';
import HowItWorksSection from '@/components/how-it-works-section';
import FeaturesSection from '@/components/features-section';
import TestimonialsSection from '@/components/testimonials-section';
import RoadmapShowcaseSection from '@/components/roadmap-showcase';
import PricingSection from '@/components/pricing-section';
import FAQSection from '@/components/faq-section';
import Footer from '@/components/footer';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <RoadmapShowcaseSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Home;
