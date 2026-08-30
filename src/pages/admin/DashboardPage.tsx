import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  FolderGit2,
  Briefcase,
  Share2,
  ArrowRight,
  Database,
  Plus,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import {
  getProfile,
  getProjects,
  getExperiences,
  getSocialLinks,
} from '../../lib/supabase';
import type { Profile } from '../../types/database';

interface Stats {
  profile: Profile | null;
  projectCount: number;
  featuredProjectCount: number;
  experienceCount: number;
  socialLinkCount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    profile: null,
    projectCount: 0,
    featuredProjectCount: 0,
    experienceCount: 0,
    socialLinkCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [profile, projects, experiences, socialLinks] = await Promise.all([
          getProfile(),
          getProjects(),
          getExperiences(),
          getSocialLinks(),
        ]);
        setStats({
          profile: profile || null,
          projectCount: projects.length,
          featuredProjectCount: projects.filter((p) => p.is_featured).length,
          experienceCount: experiences.length,
          socialLinkCount: socialLinks.length,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    {
      to: '/admin/profile',
      icon: <User size={20} className="text-slate-700" />,
      label: 'Profil Pengguna',
      value: stats.profile ? 'Terkonfigurasi' : 'Belum Diatur',
      desc: stats.profile?.title || 'Atur biodata & avatar Anda',
      actionText: 'Kelola Profil',
    },
    {
      to: '/admin/projects',
      icon: <FolderGit2 size={20} className="text-slate-700" />,
      label: 'Portofolio Proyek',
      value: `${stats.projectCount} Proyek`,
      desc: `${stats.featuredProjectCount} proyek unggulan (featured)`,
      actionText: 'Kelola Proyek',
    },
    {
      to: '/admin/experiences',
      icon: <Briefcase size={20} className="text-slate-700" />,
      label: 'Riwayat Pengalaman',
      value: `${stats.experienceCount} Item`,
      desc: 'Kerja profesional & organisasi',
      actionText: 'Kelola Pengalaman',
    },
    {
      to: '/admin/social-links',
      icon: <Share2 size={20} className="text-slate-700" />,
      label: 'Tautan Sosial & Kontak',
      value: `${stats.socialLinkCount} Link`,
      desc: 'GitHub, LinkedIn, Email, dll',
      actionText: 'Kelola Tautan',
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2.5">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-500">Memuat data dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-[2rem] bg-slate-900 text-white shadow-xl shadow-slate-900/10" style={{ padding: '40px', marginBottom: '24px' }}>
        <p className="mb-2 text-sm font-bold text-slate-400 uppercase tracking-widest">Selamat datang kembali 👋</p>
        <h1 className="mb-2 text-3xl font-black tracking-tight">
          {stats.profile?.full_name || 'Admin'}
        </h1>
        <p className="text-base text-slate-400">{stats.profile?.title || 'Kelola konten portofolio Anda dari sini.'}</p>
      </div>

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '24px', marginBottom: '24px' }}>
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
            style={{ padding: '28px', minHeight: '200px' }}
          >
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                  {card.icon}
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{card.value.split(' ')[0]} <span className="text-lg text-slate-400 font-bold">{card.value.split(' ').slice(1).join(' ')}</span></p>
              <h2 className="mt-2 text-sm font-bold text-slate-700">{card.label}</h2>
              <p className="mt-1 text-sm text-slate-400 line-clamp-1">{card.desc}</p>
            </div>

            <div className="mt-8 flex items-center gap-1.5 border-t border-slate-100 pt-4 text-sm font-bold text-slate-700 transition-colors group-hover:text-indigo-600">
              <span>{card.actionText}</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* Two Column Layout: Quick Actions & Database Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '24px' }}>
        {/* Left: Quick Actions (2 Cols) */}
        <div className="lg:col-span-2 rounded-[2rem] border border-slate-200 bg-white shadow-sm" style={{ padding: '40px' }}>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Aksi Cepat</h2>
              <p className="mt-1 text-sm text-slate-500">Pintasan untuk memperbarui portofolio</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '16px' }}>
            <Link
              to="/admin/projects"
              className="flex items-center rounded-2xl border border-slate-200/80 bg-slate-50/60 transition-colors hover:border-slate-300 hover:bg-white"
              style={{ padding: '20px', gap: '16px' }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm">
                <Plus size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">Tambah Proyek Baru</p>
                <p className="text-[13px] text-slate-500">Upload karya terbaru ke portofolio</p>
              </div>
            </Link>

            <Link
              to="/admin/experiences"
              className="flex items-center rounded-2xl border border-slate-200/80 bg-slate-50/60 transition-colors hover:border-slate-300 hover:bg-white"
              style={{ padding: '20px', gap: '16px' }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm">
                <Briefcase size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">Catat Pengalaman</p>
                <p className="text-[13px] text-slate-500">Update riwayat karier / organisasi</p>
              </div>
            </Link>

            <Link
              to="/admin/profile"
              className="flex items-center rounded-2xl border border-slate-200/80 bg-slate-50/60 transition-colors hover:border-slate-300 hover:bg-white"
              style={{ padding: '20px', gap: '16px' }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm">
                <User size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">Ubah Biodata / Avatar</p>
                <p className="text-[13px] text-slate-500">Edit nama, gelar, dan bio profil</p>
              </div>
            </Link>

            <Link
              to="/admin/social-links"
              className="flex items-center rounded-2xl border border-slate-200/80 bg-slate-50/60 transition-colors hover:border-slate-300 hover:bg-white"
              style={{ padding: '20px', gap: '16px' }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm">
                <Share2 size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">Edit Kontak Sosial</p>
                <p className="text-[13px] text-slate-500">Perbarui email, LinkedIn, GitHub</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right: Database Info & Status */}
        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm" style={{ padding: '40px' }}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Status Sistem</h2>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <CheckCircle2 size={16} />
              Online
            </span>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50" style={{ padding: '20px', marginBottom: '16px' }}>
              <div className="flex items-center gap-2 mb-2.5">
                <Database size={16} className="text-slate-400" />
                <span className="text-sm font-bold text-slate-800">Database Engine</span>
              </div>
              <p className="text-sm text-slate-500">
                PostgreSQL via Supabase Cloud
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50" style={{ padding: '20px' }}>
              <div className="flex items-center gap-2 mb-2.5">
                <ShieldCheck size={16} className="text-slate-400" />
                <span className="text-sm font-bold text-slate-800">Row Level Security</span>
              </div>
              <p className="text-sm text-slate-500">
                Aktif — hanya pengguna terautentikasi yang dapat menulis.
              </p>
            </div>

            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <span>Buka Supabase Dashboard</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
