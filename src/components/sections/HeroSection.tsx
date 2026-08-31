import { motion } from 'framer-motion';
import type { Profile } from '@/types/database';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { useIsMobile, useCanRenderSVGFilter } from '@/hooks/useIsMobile';

interface HeroProps {
  profile: Profile | null;
}

export const HeroSection = ({ profile }: HeroProps) => {
  const fullName = profile?.full_name || 'Dian Maheru';
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  const isMobile = useIsMobile();
  const canRenderHeavyEffects = useCanRenderSVGFilter();

  return (
    <section id="profile" className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden bg-gradient-to-b from-white via-[#A5E3E9] to-white">
      
      {/* Decorative Glowing Orbs behind the glass */}
      <div className={`absolute top-[15%] left-[10%] w-[40rem] h-[40rem] bg-[#50E8F4]/40 rounded-full filter blur-2xl md:blur-[100px] ${canRenderHeavyEffects ? 'mix-blend-multiply animate-pulse' : ''}`} style={canRenderHeavyEffects ? { animationDuration: '6s' } : undefined} />
      <div className={`absolute bottom-[20%] right-[5%] w-[45rem] h-[45rem] bg-[#34D399]/30 rounded-full filter blur-2xl md:blur-[120px] ${canRenderHeavyEffects ? 'mix-blend-multiply animate-pulse' : ''}`} style={canRenderHeavyEffects ? { animationDuration: '8s' } : undefined} />
      <div className={`absolute top-[30%] left-[40%] w-[35rem] h-[35rem] bg-[#818CF8]/20 rounded-full filter blur-2xl md:blur-[100px] ${canRenderHeavyEffects ? 'mix-blend-multiply animate-pulse' : ''}`} style={canRenderHeavyEffects ? { animationDuration: '10s' } : undefined} />

      {/* Endless Scrolling Tech Grid */}
      <style>{`
        @keyframes pan-grid {
          0% { background-position: 0px 0px; }
          100% { background-position: 32px 32px; }
        }
      `}</style>
      <div 
        className="hidden md:block absolute inset-0 pointer-events-none"
        style={{ 
          maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%)", 
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%)" 
        }}
      >
        <div 
          className="absolute inset-0 opacity-50" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='1.5' fill='%23001619' fill-opacity='0.8'/%3E%3Cpath d='M16 0v32M0 16h32' stroke='%23001619' stroke-opacity='0.04' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '32px 32px',
            animation: 'pan-grid 8s linear infinite',
            maskImage: `
              radial-gradient(circle at 15% 20%, black 0%, transparent 35%),
              radial-gradient(circle at 85% 30%, black 0%, transparent 45%),
              radial-gradient(circle at 50% 60%, black 0%, transparent 45%),
              radial-gradient(circle at 25% 75%, black 0%, transparent 30%),
              radial-gradient(circle at 75% 80%, black 0%, transparent 30%)
            `, 
            WebkitMaskImage: `
              radial-gradient(circle at 15% 20%, black 0%, transparent 35%),
              radial-gradient(circle at 85% 30%, black 0%, transparent 45%),
              radial-gradient(circle at 50% 60%, black 0%, transparent 45%),
              radial-gradient(circle at 25% 75%, black 0%, transparent 30%),
              radial-gradient(circle at 75% 80%, black 0%, transparent 30%)
            `
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex flex-col items-center justify-center min-h-[90vh]">
      {/* Decorative blobs behind the glass */}
      <div className={`absolute top-[20%] left-[10%] w-72 h-72 bg-[#50E8F4]/30 rounded-full filter blur-xl md:blur-[80px] opacity-70 ${canRenderHeavyEffects ? 'mix-blend-multiply animate-pulse' : ''}`} />
      <div className={`absolute bottom-[20%] right-[10%] w-96 h-96 bg-[#99E1D9]/30 rounded-full filter blur-xl md:blur-[100px] opacity-70 ${canRenderHeavyEffects ? 'mix-blend-multiply' : ''}`} />

      <ContainerScroll>
        <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-[1400px] mx-auto gap-16 lg:gap-12 bg-white/70 transition-all duration-300 glass-effect border border-white/20 p-8 lg:p-16 rounded-[3rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.05)] relative z-10">
          
          {/* Left: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 flex flex-col items-start max-w-2xl"
          >
            <h1 className="display-font text-[clamp(3.5rem,8vw,6.5rem)] font-bold text-[#001619] leading-[1.1] tracking-tight mb-4">
              <span className="block">{firstName}</span>
              <span className="block">{lastName}</span>
            </h1>

            <h2 className="text-xl md:text-2xl font-bold text-[#0c1433] tracking-wide mb-6">
              {profile?.title || 'Cloud & Backend Engineer | Software Engineer'}
            </h2>

            <p className="text-lg md:text-xl text-[#001619]/60 leading-relaxed mb-10 max-w-xl">
              {profile?.bio || 'Crafting seamless digital experiences through structural elegance and high-performance engineering.'}
            </p>

            <div className="flex items-center gap-4">
              {profile?.resume_url ? (
                <a 
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#C7F8FE] text-[#001619] px-8 py-4 rounded-full font-bold hover:bg-[#50E8F4] transition-all flex items-center gap-2 shadow-sm no-underline"
                >
                  Download CV 
                  <span className="bg-[#001619] text-[#C7F8FE] p-1.5 rounded-full ml-2 flex items-center justify-center transform group-hover:translate-y-0.5 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                      <path d="M12 12v9" />
                      <path d="m8 17 4 4 4-4" />
                    </svg>
                  </span>
                </a>
              ) : (
                <a 
                  href="#contact"
                  className="bg-[#C7F8FE] text-[#001619] px-8 py-4 rounded-full font-bold hover:bg-[#50E8F4] transition-all flex items-center gap-2 shadow-sm no-underline"
                >
                  Contact Me 
                  <span className="bg-[#001619] text-[#C7F8FE] p-1 rounded-full ml-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Right: Floating Photo */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-1 w-full max-w-lg relative"
          >
            {/* Decorative floating dots (like the reference) */}
            <div className="absolute top-10 left-10 w-4 h-4 bg-[#50E8F4] rounded-sm animate-pulse" />
            <div className="absolute bottom-20 right-10 w-6 h-6 bg-[#C7F8FE] rounded-sm" />
            <div className="absolute -top-5 right-20 w-3 h-3 bg-[#001619] rounded-sm" />

            {/* Main Photo Card */}
            <motion.div 
              animate={isMobile ? {} : { y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-full aspect-[3/4] rounded-[2rem] bg-[#001619] overflow-hidden shadow-2xl relative rotate-3 hover:rotate-0 transition-transform duration-500"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#001619] to-[#002A30] flex items-center justify-center">
                  <span className="text-[#50E8F4] text-9xl font-bold display-font opacity-20">{firstName[0]}</span>
                </div>
              )}
            </motion.div>
          </motion.div>

        </div>
      </ContainerScroll>
      </div>
    </section>
  );
};
