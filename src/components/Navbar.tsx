import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#profile');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Scroll Spy Observer
    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        
        const visibleSections = entries.filter((entry) => entry.isIntersecting);
        if (visibleSections.length > 0) {
          const mostVisible = visibleSections.reduce((prev, current) => 
            (prev.intersectionRatio > current.intersectionRatio) ? prev : current
          );
          setActiveSection(`#${mostVisible.target.id}`);
        }
      },
      { rootMargin: '-100px 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

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
      isProgrammaticScroll.current = true;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        setActiveSection(href);
      }, 10);

      scrollTimeout.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 1000);
    }
  };

  return (
    <>
      {/* SVG Definitions for Liquid Glass Distortion */}
      <svg className="hidden">
        <defs>
          <filter id="liquid-glass">
            <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <motion.nav 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl z-50 rounded-[24px] px-6 py-3 flex items-center justify-between"
        animate={{ 
          scale: 1,
          width: "95%",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
          y: isScrolled ? "1rem" : "1.5rem"
        }}
        whileHover={{ 
          scale: 1.04, 
          width: ["95%", "99%", "97.5%"],
          paddingTop: ["0.75rem", "1.5rem", "1.15rem"],
          paddingBottom: ["0.75rem", "1.5rem", "1.15rem"],
          y: isScrolled ? ["1rem", "0.25rem", "0.6rem"] : ["1.5rem", "0.75rem", "1.1rem"],
          transition: { duration: 1.5, ease: [0.33, 1, 0.68, 1], times: [0, 0.5, 1] }
        }}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      >
        {/* Glass Layer */}
        <div 
          className="absolute inset-0 rounded-[24px] pointer-events-none transition-all duration-500 ease-out border border-white/20"
          style={{
            boxShadow: 'inset 0 2.5px 0 rgba(255,255,255,1), inset 0 6px 8px rgba(255,255,255,0.3), inset 0 -1px 1px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {/* WebKit Clipping Hack Layer */}
          <div 
            className="absolute inset-0 rounded-[24px] overflow-hidden"
            style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
          >
            {/* Oversized Inner Layer to hide SVG filter wobbly edges */}
            <div 
              className="absolute -inset-[24px]"
              style={{
                background: 'rgba(255, 255, 255, 0.45)',
                backdropFilter: 'blur(24px) saturate(150%)',
                WebkitBackdropFilter: 'blur(24px) saturate(150%)',
                filter: 'url(#liquid-glass)',
              }}
            />
          </div>
        </div>

        {/* Content Layer */}
        <div className={`relative z-10 flex items-center justify-between w-full transition-all duration-500 ease-out`}>
          
          {/* Logo / Status */}
          <a href="#" className="flex items-center gap-2 text-[10px] font-medium text-[#001619] tracking-widest uppercase hover:opacity-80 transition-opacity">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#50E8F4] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#50E8F4]"></span>
              </div>
              <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Open to work</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="relative px-4 py-2 text-sm font-semibold transition-colors flex items-center group"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                >
                  {/* Spotlight Hover & Active Background */}
                  <div className={`absolute inset-0 rounded-xl transition-all duration-300 border backdrop-blur-md ${
                    isActive 
                      ? 'bg-white/40 shadow-[inset_0_1.5px_0_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,22,25,0.1),0_4px_12px_rgba(0,22,25,0.05)] border-white/30' 
                      : 'bg-white/0 border-transparent group-hover:bg-white/20'
                  }`} />
                  
                  <span className="relative z-10 flex items-center gap-1.5 text-[#001619] transition-colors duration-300">
                    {link.name}
                  </span>
                </a>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden md:flex flex-shrink-0">
            <a 
              href="#contact" 
              onClick={(e) => handleScrollTo(e, '#contact')}
              className="relative overflow-hidden border border-white/40 hover:border-white/80 bg-white/10 hover:bg-white/20 text-[#001619] px-6 py-2 rounded-xl text-sm font-semibold transition-all min-h-[40px] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
            >
              Hire Me
            </a>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-[#001619] relative z-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 right-0 mt-4 p-6 rounded-3xl flex flex-col gap-4 overflow-hidden"
            >
              <div 
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.45)',
                  backdropFilter: 'blur(32px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -1px 1px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
                }}
              />
              {navLinks.map((link) => {
                const isActive = activeSection === link.href;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className={`relative z-10 px-4 py-3 text-lg font-semibold text-[#001619] rounded-xl transition-all border backdrop-blur-md ${
                      isActive ? 'bg-white/40 shadow-[inset_0_1.5px_0_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,22,25,0.1)] border-white/30' : 'border-transparent hover:bg-white/20'
                    }`}
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                  >
                    {link.name}
                  </a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
