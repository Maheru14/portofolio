import { motion } from 'framer-motion';
import type { Profile } from '@/types/database';

interface HeroProps {
  profile: Profile | null;
}

export const HeroSection = ({ profile }: HeroProps) => {
  const fullName = profile?.full_name || 'Dian Maheru';
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  return (
    <section id="profile" className="w-full min-h-[90vh] pt-32 pb-12 flex items-center justify-center px-4 lg:px-8 relative overflow-hidden">
      {/* Decorative blobs behind the glass */}
      <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-[#50E8F4]/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-[#99E1D9]/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-70" />

      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-[1400px] mx-auto gap-16 lg:gap-12 bg-white/20 backdrop-blur-[32px] border border-white/40 p-8 lg:p-16 rounded-[3rem] shadow-[0_8px_32px_rgba(0,22,25,0.05)] relative z-10">
        
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
            animate={{ y: [0, -15, 0] }}
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
    </section>
  );
};
