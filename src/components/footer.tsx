'use client';
import Link from "next/link";

const Footer = () => {
  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Roadmaps', href: '#' },
      { label: 'Certificates', href: '#' }
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' }
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Community', href: '#' },
      { label: 'Status', href: '#' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'GDPR', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: 'ph-twitter-logo', href: '#', label: 'Twitter' },
    { icon: 'ph-linkedin-logo', href: '#', label: 'LinkedIn' },
    { icon: 'ph-github-logo', href: '#', label: 'GitHub' },
    { icon: 'ph-discord-logo', href: '#', label: 'Discord' }
  ];

  return (
    <footer className="border-t border-white/10 bg-space-dark/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <i className="ph ph-compass text-white text-lg"></i>
              </div>
              <span className="text-xl font-semibold text-white">PathPilot</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
              AI-powered career roadmaps to help you master skills and land your dream job. 
              Join thousands of successful career changers.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 glass-card flex items-center justify-center hover:bg-white/10 transition-all duration-300"
                  aria-label={social.label}
                >
                  <i className={`${social.icon} text-white/70 hover:text-white text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('#') ? (
                    <button
                      onClick={() => {
                        const element = document.getElementById(link.href.substring(1));
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm">
            © 2024 PathPilot. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-white/50 text-sm">Made with ❤️ for career changers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
