import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Users, ChevronDown } from 'lucide-react';
import type { Experience } from '@/types/database';

export const ExperienceContainer = ({ experiences }: { experiences: Experience[] }) => {
  const [activeTab, setActiveTab] = useState<'work' | 'organization'>('work');
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  if (!experiences || experiences.length === 0) return null;

  const filteredExperiences = experiences
    .filter(exp => exp.type === activeTab)
    // Sort descending by start_date (newest at top)
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

  // Date formatting helpers
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getDuration = (start: string, end: string | null) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    
    if (months < 1) return 'Less than a month';
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = '';
    if (years > 0) result += `${years} yr${years > 1 ? 's' : ''} `;
    if (remainingMonths > 0 || years === 0) result += `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
    
    return result.trim();
  };

  return (
    <section id="experience" className="w-full scroll-mt-32">
      <div className="relative w-full bg-white/60 backdrop-blur-3xl rounded-[40px] p-8 md:p-16 shadow-[0_30px_60px_-15px_rgba(0,22,25,0.1),0_10px_30px_-10px_rgba(0,22,25,0.05),inset_0_1px_2px_rgba(255,255,255,1)] border border-[#001619]/10 overflow-hidden">
        
        {/* Decorative Background Blobs for the Outer Card */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#50E8F4]/30 to-[#C7F8FE]/20 blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-[#99E1D9]/30 to-transparent blur-[120px] pointer-events-none -z-10" />

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMjIsIDI1LCAwLjA0KSIvPjwvc3ZnPg==')] opacity-40 pointer-events-none -z-10" />
        
        {/* Header & Tabs */}
        <div className="flex flex-col items-center text-center mb-16 gap-8">
          <h2 className="display-font text-[2.5rem] md:text-[3.5rem] font-bold text-[#001619] leading-tight max-w-3xl">
            Professional & Organizational Experience
          </h2>
          
          <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex p-1.5 hover:p-2 bg-[#F4F8F9]/60 backdrop-blur-md saturate-150 rounded-full w-max relative shadow-[inset_0_1px_2px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(0,22,25,0.05),0_4px_15px_rgba(0,22,25,0.05)] border border-[#001619]/10 transition-all duration-700"
            style={{
              transform: `scale(${isHovered ? 1.02 : 1})`,
              transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
            }}
          >
            {(['work', 'organization'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setExpandedIds([]); // Close accordion on tab switch
                }}
                className={`relative px-10 py-3.5 rounded-full font-bold text-sm transition-colors z-10 capitalize tracking-wide ${
                  activeTab === tab ? 'text-[#001619]' : 'text-[#001619]/40 hover:text-[#001619]'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="experienceTab"
                    className="absolute inset-0 rounded-full -z-10 overflow-hidden border border-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,22,25,0.15),0_8px_16px_rgba(0,22,25,0.12),0_2px_4px_rgba(0,22,25,0.08)]"
                    transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.8 }}
                  >
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.3) 100%)",
                        backdropFilter: "blur(12px) saturate(160%)",
                        filter: "url(#glass-distortion)",
                        boxShadow: "inset 0 1px 1px rgba(255,255,255,1)"
                      }}
                    />
                  </motion.div>
                )}
                <span className="relative z-20 flex items-center gap-2">
                  {tab === 'work' ? (
                    <Briefcase size={16} className={activeTab === tab ? 'text-[#50E8F4]' : ''} />
                  ) : (
                    <Users size={16} className={activeTab === tab ? 'text-[#50E8F4]' : ''} />
                  )}
                  {tab === 'work' ? 'Work' : 'Organizations'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline List */}
        <div className="relative w-full mt-10">
          
          <div className="flex flex-col gap-8 md:gap-4 relative w-full">
            {filteredExperiences.length === 0 ? (
              <p className="text-[#001619]/50 font-medium text-center py-10">No experience added in this category yet.</p>
            ) : (
              filteredExperiences.map((exp, i) => {
                const isExpanded = expandedIds.includes(exp.id);
                
                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative flex flex-col md:flex-row w-full group"
                  >
                    {/* Left: Metadata (Desktop) / Top: Metadata (Mobile) */}
                    <div className="md:w-[280px] shrink-0 flex flex-col md:items-end md:text-right pl-12 md:pl-0 md:pr-10 pt-1 md:pt-6 mb-4 md:mb-0 relative z-10">
                      
                      {/* Mobile Timeline Line Segment (hides on md) */}
                      <div className="absolute left-[20px] top-8 bottom-[-40px] w-[2px] bg-gradient-to-b from-[#50E8F4]/50 to-transparent md:hidden" />
                      {/* Mobile Timeline Dot (hides on md) */}
                      <div className="absolute left-[14px] top-[10px] w-[14px] h-[14px] rounded-full bg-[#50E8F4] shadow-[0_0_0_6px_white,0_0_0_10px_rgba(80,232,244,0.15)] md:hidden z-10" />

                      <div className="flex flex-col items-start md:items-end gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#001619]/5 rounded-full border border-[#001619]/10">
                          <span className="text-[10px] font-bold tracking-widest text-[#001619] uppercase">
                            {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5">
                          <span className="text-[10px] font-bold tracking-widest text-[#001619]/50 uppercase">
                            {getDuration(exp.start_date, exp.end_date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Timeline (Desktop Only) */}
                    <div className="hidden md:flex flex-col items-center w-12 shrink-0 relative">
                      {/* Vertical Line */}
                      <div className="absolute top-0 bottom-[-16px] w-[2px] bg-[#001619]/5 group-last:bg-gradient-to-b group-last:from-[#001619]/5 group-last:to-transparent group-first:top-6" />
                      {/* Timeline Dot */}
                      <div className="w-[14px] h-[14px] rounded-full bg-[#50E8F4] shadow-[0_0_0_6px_white,0_0_0_10px_rgba(80,232,244,0.15)] mt-8 z-10" />
                    </div>

                    {/* Right: Content Card */}
                    <div className="flex-1 pl-12 md:pl-6 pb-6 md:pb-12">
                      <div 
                        onClick={() => toggleExpand(exp.id)}
                        className="bg-white border border-[#001619]/5 shadow-[0_4px_20px_rgba(0,22,25,0.03)] hover:shadow-[0_8px_30px_rgba(0,22,25,0.08)] hover:border-[#50E8F4]/30 rounded-3xl p-6 md:p-8 cursor-pointer transition-all duration-300 w-full group/card"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
                          
                          {/* Role & Company info */}
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-[#F4F8F9] flex items-center justify-center shrink-0 border border-[#001619]/5">
                              {exp.logo_url ? (
                                <img src={exp.logo_url} alt="" className="w-10 h-10 object-contain rounded-lg" />
                              ) : (
                                activeTab === 'work' ? <Briefcase size={22} className="text-[#001619]/70" /> : <Users size={22} className="text-[#001619]/70" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-[#001619]">{exp.role}</h3>
                              <div className="text-[#001619]/60 font-medium text-sm mt-1">{exp.company}</div>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Description Footer */}
                        <div className="mt-4">
                          <AnimatePresence initial={false}>
                            {isExpanded && exp.description ? (
                              <motion.div
                                key="content"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <div className="pt-4 pb-2">
                                  <p className="text-[#001619]/70 text-sm md:text-base leading-relaxed whitespace-pre-line font-medium bg-[#F4F8F9]/50 p-6 rounded-2xl border border-[#001619]/5">
                                    {exp.description}
                                  </p>
                                </div>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>

                          {exp.description && (
                            <div 
                              className="flex items-center justify-between mt-4 pt-4 border-t border-dashed border-[#001619]/15 group/btn"
                            >
                              <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${isExpanded ? 'text-[#001619]' : 'text-[#001619]/40 group-hover/btn:text-[#001619]'}`}>
                                {isExpanded ? 'Hide Details' : 'Explore Details'}
                              </span>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-[#50E8F4] text-[#001619] rotate-180' : 'bg-[#F4F8F9] text-[#001619]/50 group-hover/btn:bg-[#001619] group-hover/btn:text-white'}`}>
                                <ChevronDown size={16} />
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                  </motion.div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
