import type { SocialLink } from '@/types/database';
import { getPlatformIcon } from '@/lib/platformUtils';

interface FooterProps {
  socialLinks: SocialLink[];
  profileName: string;
}

export default function Footer({ socialLinks, profileName }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full relative z-20 bg-transparent mt-20 pt-20">
      
      {/* Decorative curved top edge */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] md:h-[100px]">
          <path d="M0,120 C300,0 900,0 1200,120 L1200,120 L0,120 Z" fill="#001619" />
        </svg>
      </div>

      <div className="relative z-10 w-full bg-[#001619] text-white px-6 sm:px-8 pb-12 pt-8">
        <div className="max-w-[1280px] mx-auto">
          
          {/* Bottom Socials & Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-medium text-white/40">
              Copyright © {currentYear} {profileName}. All Rights Reserved.
            </p>
            
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-[#50E8F4] hover:text-[#001619] transition-colors"
                  aria-label={link.platform}
                >
                  {getPlatformIcon(link.platform)}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
