'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav
      className={`
        fixed top-5 left-0 right-0 z-50
        transition-all duration-300
        bg-white/10 backdrop-blur-sm
        border-1 border-white/25
        shadow-lg
        flex items-center
        ${isScrolled ? 'w-[60%] ' : 'w-[80%]'}
        mx-auto
        rounded-lg
      `}
    >
      <div
        className={`
          mx-auto px-32 sm:px-6 lg:px-8
          transition-all duration-300
          w-full
        `}
      >
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src='/logo.png' alt='logo' width='100' height='100' className='w-full h-40' />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) =>
              item.href.startsWith('#') ? (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href.substring(1))}
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  {item.label}
                </Link>
              )
            )}
            <div className='flex items-center space-x-4'>
              <Button className="font-medium" variant="outline">
                Log in
              </Button>
              <Button className="font-medium" variant="outline">
                Get Started
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white">
                  <i className="ph ph-list text-xl"></i>
                </Button>
              </SheetTrigger>
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <SheetContent side="right" className="w-full max-w-xs bg-space-dark/95 backdrop-blur-xl border-white/10 p-0">
                    <motion.div
                      initial={{ x: 320, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 320, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="h-full flex flex-col justify-between"
                    >
                      <div className="flex flex-col space-y-8 mt-12 px-8">
                        {navItems.map((item) =>
                          item.href.startsWith('#') ? (
                            <button
                              key={item.label}
                              onClick={() => scrollToSection(item.href.substring(1))}
                              className="text-white/90 hover:text-white text-xl font-semibold text-left py-2"
                            >
                              {item.label}
                            </button>
                          ) : (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="text-white/90 hover:text-white text-xl font-semibold py-2"
                            >
                              {item.label}
                            </Link>
                          )
                        )}
                      </div>
                      <div className="flex flex-col gap-4 px-8 pb-8">
                        <Button className="font-medium w-full" variant="outline">
                          Get Started
                        </Button>
                        <Button className="font-medium w-full" variant="secondary">
                          Log in
                        </Button>
                      </div>
                    </motion.div>
                  </SheetContent>
                )}
              </AnimatePresence>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;