import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import type { Experience } from '@/types/database';

export const OrganizationSection = ({ organizations }: { organizations: Experience[] }) => {
  if (!organizations || organizations.length === 0) return null;

  return (
    <section id="organizations" className="w-full relative scroll-mt-24">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-[#001619] bg-[#C7F8FE] uppercase rounded-full">
          Leadership & Community
        </span>
        <h2 className="display-font text-4xl md:text-5xl font-bold text-[#001619]">
          Organizations
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org, i) => (
          <motion.div
            key={org.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col p-8 rounded-[24px] bg-white border border-[#99E1D9]/40 hover:border-[#50E8F4] hover:shadow-[0_8px_30px_rgba(80,232,244,0.15)] transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-[#C7F8FE] text-[#001619] flex items-center justify-center mb-6">
              {org.logo_url ? (
                <img src={org.logo_url} alt={org.company} className="w-full h-full object-cover rounded-full" />
              ) : (
                <Users size={20} />
              )}
            </div>

            <h3 className="display-font text-xl font-bold text-[#001619] mb-1">
              {org.role}
            </h3>
            <p className="text-sm font-semibold text-[#50E8F4] mb-4 uppercase tracking-wide">
              {org.company}
            </p>
            
            <p className="text-[#001619]/70 text-sm leading-relaxed mb-6 flex-1">
              {org.description}
            </p>

            <div className="mt-auto pt-4 border-t border-[#99E1D9]/30 text-xs font-bold text-[#001619]/50 uppercase tracking-widest">
              {new Date(org.start_date).getFullYear()} - {!org.end_date ? 'Present' : new Date(org.end_date).getFullYear()}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
