import { useEffect, useState } from 'react';
import { FolderGit2 } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import GlassCard from '../components/GlassCard';
import type { Project } from '../types/database';
import { getProjects } from '../lib/supabase';
import { isSupabaseConfigured, demoProjects } from '../lib/demoData';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (isSupabaseConfigured()) {
        try {
          const data = await getProjects();
          setProjects(data);
        } catch {
          setProjects(demoProjects);
        }
      } else {
        setProjects(demoProjects);
      }
      setLoading(false);
    }
    fetchData();
  }, []);



  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6" style={{ paddingBottom: '128px', paddingTop: '144px' }}>
      {/* ===== Page Header ===== */}
      <AnimatedSection>
        <div className="text-center flex flex-col items-center" style={{ marginBottom: '80px', gap: '32px' }}>
          <span className="section-badge">SHOWCASE</span>
          <h1 className="section-title">
            Daftar Proyek
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-slate-500 mt-2">
            Kumpulan aplikasi web, tools, dan proyek teknis yang telah saya bangun dengan berbagai teknologi modern.
          </p>
        </div>
      </AnimatedSection>



      {/* ===== Projects Grid ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2" style={{ gap: '64px' }}>
        {projects.map((project, i) => (
          <AnimatedSection key={project.id} delay={i * 0.05}>
            <GlassCard noPadding={true} className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#7AAACE]/50 bg-[#355872] shadow-[0_8px_30px_rgba(156,213,255,0.08)] transition-all hover:shadow-[0_8px_40px_rgba(156,213,255,0.15)] hover:border-[#9CD5FF]">
              {/* Project Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0f172a] border-b border-[#7AAACE]/50">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#7AAACE] h-full justify-center">
                    <FolderGit2 size={40} />
                    <span className="text-xs font-medium text-[#7AAACE]/80">Project Preview</span>
                  </div>
                )}

                {project.is_featured && (
                  <span className="absolute top-4 right-4 rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-4 py-1 text-[10px] font-bold text-white shadow-sm tracking-widest uppercase">
                    FEATURED
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col bg-transparent flex-1" style={{ padding: '32px' }}>
                <div className="flex items-center mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#7AAACE]">
                      {project.tech_stack?.[0] || 'Project'} <span className="mx-2">•</span> 2026
                    </span>
                </div>
                <h3 className="text-xl font-bold text-[#9CD5FF] mb-3">
                  {project.title}
                </h3>
              </div>
            </GlassCard>
          </AnimatedSection>
        ))}
      </div>


    </div>
  );
}
