import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#profile');
  const location = useLocation();

  const navLinks = [
    { name: 'Profile', href: '#profile' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname !== '/') return;
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      setIsMobileMenuOpen(false);
      setActiveSection(href);
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 bg-white/70 backdrop-blur-lg border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300">
      
      {/* Logo / Status */}
      <a href="#" className="flex items-center gap-2 text-[10px] font-medium text-[#001619] tracking-widest uppercase">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#50E8F4] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#50E8F4]"></span>
          </div>
          Open to work
      </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-[#50E8F4]' : 'text-[#001619] hover:text-[#50E8F4]'
                }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#50E8F4] inline-block" />}
                {link.name}
              </a>
            );
          })}
        </div>

        {/* CTA */}
        <div className="hidden md:flex flex-shrink-0">
          <a 
            href="#contact" 
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="border-2 border-[#001619]/20 hover:border-[#001619] text-[#001619] px-6 py-2 rounded-full text-sm font-semibold transition-all min-h-[44px] flex items-center justify-center"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-[#001619]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-6 right-6 mt-4 p-6 bg-white rounded-3xl shadow-2xl border border-[#001619]/5 flex flex-col gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-lg font-semibold text-[#001619] hover:text-[#50E8F4]"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
