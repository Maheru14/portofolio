import { useEffect, useState } from 'react';
import { Briefcase, Users, Calendar, Clock, Building2 } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import GlassCard from '../components/GlassCard';
import type { Experience } from '../types/database';
import { getExperiences } from '../lib/supabase';
import { isSupabaseConfigured, demoExperiences } from '../lib/demoData';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
}

function getDuration(startDate: string, endDate: string | null): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years > 0 && remainingMonths > 0) return `${years} thn ${remainingMonths} bln`;
  if (years > 0) return `${years} thn`;
  return `${remainingMonths || 1} bln`;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'work' | 'organization'>('work');

  useEffect(() => {
    async function fetchData() {
      if (isSupabaseConfigured()) {
        try {
          const data = await getExperiences();
          setExperiences(data);
        } catch {
          setExperiences(demoExperiences);
        }
      } else {
        setExperiences(demoExperiences);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredExperiences = experiences.filter((e) => e.type === activeTab);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-28">
      {/* ===== Page Header ===== */}
      <AnimatedSection>
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-bold tracking-widest text-indigo-600 uppercase">Track Record</p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Pengalaman <span className="gradient-text">Kerja & Organisasi</span>
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-slate-500">
            Riwayat karier profesional dan aktivitas kepemimpinan dalam organisasi yang membentuk keahlian saya.
          </p>
        </div>
      </AnimatedSection>

      {/* ===== Tabs ===== */}
      <AnimatedSection delay={0.08}>
        <div className="mb-12 flex justify-center">
          <div className="flex gap-1 rounded-2xl border border-slate-200 bg-slate-100/80 p-1.5 shadow-sm">
            <button
              onClick={() => setActiveTab('work')}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
                activeTab === 'work'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Briefcase size={15} />
              Pengalaman Kerja
            </button>
            <button
              onClick={() => setActiveTab('organization')}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
                activeTab === 'organization'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users size={15} />
              Pengalaman Organisasi
            </button>
          </div>
        </div>
      </AnimatedSection>

      {/* ===== Timeline ===== */}
      <div className="relative pl-8 sm:pl-10">
        {/* Vertical Line */}
        <div className="absolute top-4 bottom-4 left-4 sm:left-5 w-0.5 bg-gradient-to-b from-indigo-300 via-slate-200 to-transparent rounded-full" />

        <div className="flex flex-col gap-7">
          {filteredExperiences.map((exp, i) => (
            <AnimatedSection key={exp.id} delay={i * 0.1}>
              <div className="relative">
                {/* Timeline Dot */}
                <div className="absolute -left-8 sm:-left-10 top-6 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-[#9CD5FF] shadow-md shadow-[#9CD5FF]/50">
                  <div className="h-2 w-2 rounded-full bg-[#0f172a]" />
                </div>

                <GlassCard className="p-6 sm:p-7 border border-[#7AAACE]/50 bg-[#355872] shadow-[0_8px_30px_rgba(156,213,255,0.08)] transition-all hover:shadow-[0_8px_40px_rgba(156,213,255,0.15)] hover:border-[#9CD5FF]">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    {/* Left: Company Info */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#7AAACE]/50 bg-[#0f172a] font-extrabold text-[#9CD5FF] shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                        {exp.logo_url ? (
                          <img src={exp.logo_url} alt={exp.company} className="h-8 w-8 rounded-xl object-contain" />
                        ) : (
                          <span className="text-xs">
                            {exp.company.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h2 className="text-base font-extrabold text-[#9CD5FF]">{exp.role}</h2>
                        <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-[#9CD5FF]/80">
                          <Building2 size={13} className="opacity-70" />
                          {exp.company}
                        </p>
                      </div>
                    </div>

                    {/* Right: Date & Duration */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#7AAACE]/50 bg-[#0f172a] px-3 py-1 text-xs font-semibold text-[#9CD5FF]">
                        <Calendar size={11} className="text-[#9CD5FF]/70" />
                        {formatDate(exp.start_date)} — {exp.end_date ? formatDate(exp.end_date) : 'Sekarang'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#7AAACE]/50 bg-[#0f172a] px-3 py-1 text-xs font-semibold text-[#9CD5FF]">
                        <Clock size={11} className="text-[#9CD5FF]/70" />
                        {getDuration(exp.start_date, exp.end_date)}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <p className="mt-5 border-t border-[#7AAACE]/20 pt-4 text-sm leading-relaxed text-[#F7F8F0]">
                      {exp.description}
                    </p>
                  )}
                </GlassCard>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Empty State */}
        {filteredExperiences.length === 0 && (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 py-20 text-center">
            {activeTab === 'work' ? (
              <Briefcase size={40} className="mb-3 text-slate-300" />
            ) : (
              <Users size={40} className="mb-3 text-slate-300" />
            )}
            <p className="text-sm font-semibold text-slate-500">
              Belum ada data {activeTab === 'work' ? 'pengalaman kerja' : 'pengalaman organisasi'}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
