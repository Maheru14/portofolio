import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ExternalLink, Code2 } from 'lucide-react';
import type { Project } from '@/types/database';

export const ProjectsSection = ({ projects }: { projects: Project[] }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const selectedProject = projects.find(p => p.id === selectedId);

  // Reset image gallery when opening a new project
  useEffect(() => {
    if (selectedId) {
      setActiveImageIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedId]);

  return (
    <section id="projects" className="w-full scroll-mt-32 relative">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <h2 className="display-font text-[2.5rem] md:text-[3.5rem] font-bold text-[#001619] leading-tight max-w-xl">
          Up-To-Date And Fast Projects In One Place
        </h2>
      </div>

      {/* Grid List */}
      <div className="flex flex-col gap-12 max-w-5xl mx-auto relative z-10">
        {projects.map((project, i) => {
          // Dim others when one is selected
          const isDimmed = selectedId !== null && selectedId !== project.id;
          const images = [project.image_url, ...(project.gallery_urls || [])].filter(Boolean) as string[];
          const primaryImage = images[0];

          return (
            <motion.div
              layoutId={`project-container-${project.id}`}
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedId(project.id)}
              className={`group flex flex-col md:flex-row bg-white rounded-[32px] overflow-hidden border border-[#001619]/5 cursor-pointer transition-all duration-300 min-h-[350px] ${
                isDimmed ? 'opacity-30 scale-[0.98]' : 'hover:shadow-xl shadow-sm'
              }`}
            >
              {/* Left/Top: Text Info */}
              <div className="p-10 md:p-12 flex flex-col flex-1 items-start text-left justify-center">
                <motion.div layoutId={`project-meta-${project.id}`} className="flex items-center gap-3 mb-4">
                  {project.category && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#001619]/40">{project.category}</span>
                  )}
                  {project.category && project.year && <span className="w-1 h-1 rounded-full bg-[#001619]/20" />}
                  {project.year && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#001619]/40">{project.year}</span>
                  )}
                </motion.div>
                
                <motion.h3 layoutId={`project-title-${project.id}`} className="display-font text-3xl font-bold text-[#001619] mb-4">
                  {project.title}
                </motion.h3>
                
                <motion.p layoutId={`project-desc-${project.id}`} className="text-[#001619]/50 text-base leading-relaxed mb-8 max-w-md line-clamp-3">
                  {project.description}
                </motion.p>
                
                <motion.div layoutId={`project-tech-${project.id}`} className="flex gap-3 flex-wrap mt-auto">
                  {project.tech_stack?.slice(0,4).map(tech => (
                    <span key={tech} className="px-3 py-1.5 bg-[#F4F8F9] text-[#001619] text-xs font-bold rounded-lg">{tech}</span>
                  ))}
                  {(project.tech_stack?.length || 0) > 4 && (
                    <span className="px-3 py-1.5 bg-[#F4F8F9] text-[#001619]/50 text-xs font-bold rounded-lg">
                      +{(project.tech_stack?.length || 0) - 4}
                    </span>
                  )}
                </motion.div>
              </div>

              {/* Right/Bottom: Graphic Area */}
              <motion.div layoutId={`project-image-container-${project.id}`} className="w-full md:w-[48%] min-h-[260px] md:min-h-[340px] bg-[#F4F8F9] flex items-center justify-center p-6 md:p-8 overflow-hidden relative shrink-0">
                <div className="w-full h-full max-h-[300px] bg-white rounded-2xl md:rounded-[22px] shadow-[0_8px_30px_rgba(0,22,25,0.06)] border border-[#001619]/5 overflow-hidden flex items-center justify-center transform transition-transform duration-500 group-hover:scale-[1.02]">
                  {primaryImage ? (
                    <motion.img layoutId={`project-img-${project.id}-0`} src={primaryImage} alt={project.title} className="w-full h-full object-cover object-center" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#C7F8FE]/30 to-[#99E1D9]/20 flex items-center justify-center p-6">
                      <span className="text-[#001619]/30 font-bold display-font text-xl text-center">{project.title}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Expanded Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-[#001619]/20 backdrop-blur-md"
            />

            {/* Expanded Card */}
            <motion.div
              layoutId={`project-container-${selectedProject.id}`}
              className="bg-white w-full max-w-6xl max-h-[95vh] rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col relative z-10 shadow-2xl border border-white/50"
            >
              {/* Top Bar - sticky for scrolling */}
              <div className="flex justify-between items-start p-6 md:p-10 pb-0 shrink-0">
                <div>
                  <motion.div layoutId={`project-meta-${selectedProject.id}`} className="flex items-center gap-3 mb-2">
                    {selectedProject.category && (
                      <span className="px-3 py-1 bg-[#F4F8F9] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#001619]">{selectedProject.category}</span>
                    )}
                    {selectedProject.year && (
                      <span className="px-3 py-1 bg-[#F4F8F9] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#001619]">{selectedProject.year}</span>
                    )}
                  </motion.div>
                  <motion.h3 layoutId={`project-title-${selectedProject.id}`} className="display-font text-3xl md:text-5xl font-bold text-[#001619]">
                    {selectedProject.title}
                  </motion.h3>
                </div>
                
                <button
                  onClick={() => setSelectedId(null)}
                  className="w-12 h-12 rounded-full bg-[#F4F8F9] text-[#001619] flex items-center justify-center hover:bg-[#001619] hover:text-white transition-colors shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 pt-8 custom-scrollbar">
                
                <div className="max-w-4xl mx-auto flex flex-col gap-10">
                  
                  {/* Gallery */}
                  <motion.div layoutId={`project-image-container-${selectedProject.id}`} className="w-full bg-[#F4F8F9] rounded-[24px] md:rounded-[32px] overflow-hidden p-2 md:p-4">
                    <div className="relative aspect-video w-full rounded-[16px] md:rounded-[24px] overflow-hidden bg-white shadow-sm border border-[#001619]/5 group">
                      
                      {(() => {
                        const images = [selectedProject.image_url, ...(selectedProject.gallery_urls || [])].filter(Boolean) as string[];
                        if (images.length === 0) {
                          return (
                            <div className="w-full h-full bg-gradient-to-br from-[#C7F8FE]/30 to-[#99E1D9]/20 flex items-center justify-center">
                              <span className="text-[#001619]/20 font-bold display-font text-2xl">{selectedProject.title}</span>
                            </div>
                          );
                        }
                        
                        return (
                          <>
                            <motion.img 
                              key={activeImageIndex}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              src={images[activeImageIndex]} 
                              alt={`${selectedProject.title} screenshot ${activeImageIndex + 1}`} 
                              className="w-full h-full object-cover object-top" 
                            />
                            
                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                              <>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1); }}
                                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#001619] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg"
                                >
                                  <ChevronLeft size={20} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1); }}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#001619] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg"
                                >
                                  <ChevronRight size={20} />
                                </button>
                              </>
                            )}
                          </>
                        );
                      })()}
                    </div>
                    
                    {/* Thumbnails */}
                    {(() => {
                      const images = [selectedProject.image_url, ...(selectedProject.gallery_urls || [])].filter(Boolean) as string[];
                      if (images.length > 1) {
                        return (
                          <div className="flex gap-2 md:gap-3 mt-2 md:mt-4 overflow-x-auto pb-2 scrollbar-hide">
                            {images.map((img, idx) => (
                              <button
                                key={idx}
                                onClick={() => setActiveImageIndex(idx)}
                                className={`relative w-20 md:w-24 aspect-video rounded-xl overflow-hidden shrink-0 transition-all ${activeImageIndex === idx ? 'ring-2 ring-[#50E8F4] ring-offset-2' : 'opacity-50 hover:opacity-100'}`}
                              >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </motion.div>

                  {/* Tech Stack */}
                  <div>
                    <motion.div layoutId={`project-tech-${selectedProject.id}`} className="flex gap-2 flex-wrap">
                      {selectedProject.tech_stack?.map(tech => (
                        <span key={tech} className="px-3 py-1.5 bg-[#F4F8F9] text-[#001619] text-sm font-bold rounded-xl border border-[#001619]/5">
                          {tech}
                        </span>
                      ))}
                    </motion.div>
                  </div>

                  {/* Long Description */}
                  {(selectedProject.long_description || selectedProject.description) && (
                    <div className="flex flex-col gap-4">
                      <h4 className="text-xl font-bold text-[#001619]">Tentang Proyek Ini</h4>
                      <motion.p layoutId={`project-desc-${selectedProject.id}`} className="text-[#001619]/70 leading-relaxed font-medium whitespace-pre-line text-lg">
                        {selectedProject.long_description || selectedProject.description}
                      </motion.p>
                    </div>
                  )}

                  {/* Role */}
                  {selectedProject.role && (
                    <div className="flex flex-col gap-2">
                      <h4 className="text-xl font-bold text-[#001619]">Role Saya</h4>
                      <p className="text-[#001619]/70 leading-relaxed font-medium text-lg">
                        {selectedProject.role}
                      </p>
                    </div>
                  )}

                  {/* Key Contributions */}
                  {selectedProject.key_contributions && selectedProject.key_contributions.length > 0 && (
                    <div className="flex flex-col gap-4">
                      <h4 className="text-xl font-bold text-[#001619]">Kontribusi Utama</h4>
                      <div className="bg-[#F4F8F9] rounded-3xl p-6 md:p-8 border border-[#001619]/5">
                        <ul className="flex flex-col gap-4">
                          {selectedProject.key_contributions.map((contribution, idx) => (
                            <li key={idx} className="flex gap-4 items-start">
                              <span className="w-2 h-2 rounded-full bg-[#50E8F4] mt-2.5 shrink-0" />
                              <span className="text-[#001619]/80 font-medium leading-relaxed text-lg">{contribution}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  {selectedProject.github_url && (
                    <div className="flex gap-3 pt-4 pb-8">
                      <a 
                        href={selectedProject.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex justify-center items-center gap-2 bg-[#001619] text-white px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider hover:bg-[#001619]/80 transition-all"
                      >
                        <Code2 size={18} /> Source Code
                      </a>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
