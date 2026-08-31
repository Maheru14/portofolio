import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import type { Experience } from '@/types/database';

export const InternshipSection = ({ internships }: { internships: Experience[] }) => {
  if (!internships || internships.length === 0) return null;

  return (
    <section id="experience" className="w-full relative scroll-mt-24">
      <div className="flex flex-col mb-16">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-[#001619] bg-[#C7F8FE] uppercase rounded-full w-fit">
          Career Path
        </span>
        <h2 className="display-font text-4xl md:text-5xl font-bold text-[#001619]">
          Professional Experience
        </h2>
      </div>

      <div className="relative max-w-4xl border-l-2 border-[#99E1D9]/30 ml-4 md:ml-8 pl-8 md:pl-12 flex flex-col gap-16">
        {internships.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative"
          >
            {/* Timeline Dot */}
            <div className={`absolute -left-[41px] md:-left-[57px] top-1 w-5 h-5 rounded-full border-4 border-white ${!job.end_date ? 'bg-[#50E8F4]' : 'bg-[#99E1D9]'}`} />
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 md:items-start">
              
              {/* Date Column */}
              <div className="md:w-48 shrink-0 pt-1">
                <span className="text-sm font-bold text-[#001619]/50 uppercase tracking-widest">
                  {new Date(job.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  {' — '}
                  {!job.end_date ? 'Present' : new Date(job.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>

              {/* Content Column */}
              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 shrink-0 rounded-lg bg-[#C7F8FE] flex items-center justify-center text-[#001619] overflow-hidden border border-[#99E1D9]/50">
                    {job.logo_url ? <img src={job.logo_url} alt="" className="w-full h-full object-cover" /> : <Briefcase size={20} />}
                  </div>
                  <h3 className="display-font text-2xl font-bold text-[#001619]">
                    {job.role}
                  </h3>
                </div>
                
                <h4 className="text-lg font-semibold text-[#50E8F4] mb-4">
                  {job.company}
                </h4>

                <p className="text-[#001619]/70 leading-relaxed text-base max-w-2xl">
                  {job.description}
                </p>
              </div>

            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
