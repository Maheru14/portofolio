import { useEffect, useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Briefcase,
  Share2,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { getSession, signOut, supabase } from '../../lib/supabase';

interface SidebarItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}

const sidebarLinks: SidebarItem[] = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, exact: true },
  { to: '/admin/profile', label: 'Profil Diri', icon: <User size={18} /> },
  { to: '/admin/projects', label: 'Kelola Proyek', icon: <FolderGit2 size={18} /> },
  { to: '/admin/experiences', label: 'Pengalaman', icon: <Briefcase size={18} /> },
  { to: '/admin/social-links', label: 'Social Links', icon: <Share2 size={18} /> },
];

export default function AdminLayout() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>('admin@portfolio.com');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        navigate('/admin/login');
      } else {
        setAuthenticated(true);
        if (session.user?.email) {
          setUserEmail(session.user.email);
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/admin/login');
      } else if (session.user?.email) {
        setUserEmail(session.user.email);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  async function handleSignOut() {
    await signOut();
    navigate('/admin/login');
  }

  // Get current page title for breadcrumb
  const currentLink = sidebarLinks.find((link) =>
    link.exact
      ? location.pathname === link.to
      : location.pathname.startsWith(link.to)
  );
  const pageTitle = currentLink ? currentLink.label : 'Admin';

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">Memeriksa sesi login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-transparent font-sans text-slate-900">
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================================================================= */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white/70 backdrop-blur-md md:flex">
        {/* Brand Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <ShieldCheck size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold tracking-tight text-slate-900">
              Portofolio CMS
            </span>
            <span className="text-xs font-medium text-slate-400">
              Admin Workspace
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex flex-1 flex-col justify-between px-4 py-5">
          <nav className="space-y-0.5">
            <div className="px-3 pb-3 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              Menu Utama
            </div>
            {sidebarLinks.map((link) => {
              const isActive = link.exact
                ? location.pathname === link.to
                : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center rounded-xl font-semibold transition-all ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  style={{ padding: '12px 16px', gap: '12px', marginBottom: '4px' }}
                >
                  <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Footer Actions in Sidebar */}
          <div className="space-y-1 border-t border-slate-200 pt-4">
            <div className="rounded-xl bg-slate-50 p-4 mb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                  {userEmail[0]?.toUpperCase() || 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-800">
                    {userEmail.split('@')[0]}
                  </p>
                  <p className="truncate text-xs text-slate-400">{userEmail}</p>
                </div>
              </div>
            </div>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <span className="flex items-center gap-2">
                <ExternalLink size={15} className="text-slate-400" />
                Lihat Website
              </span>
              <ChevronRight size={14} className="text-slate-400" />
            </Link>

            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
            >
              <LogOut size={15} />
              Keluar (Sign Out)
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA & TOPBAR */}
      {/* ========================================================================= */}
      <main className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex min-h-[64px] items-center justify-between border-b border-slate-200 bg-white/70 backdrop-blur-md px-6 py-4">
          {/* Mobile Menu Trigger & Breadcrumb */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 md:hidden"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-slate-400">Admin</span>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-slate-900">{pageTitle}</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 sm:flex"
            >
              <ExternalLink size={14} />
              <span>Lihat Website</span>
            </Link>

            <div className="hidden h-5 w-px bg-slate-200 sm:block" />

            {/* Account pill */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                {userEmail[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-900">{userEmail.split('@')[0]}</p>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-400">Online</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-2xs md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          <aside className="fixed top-[64px] bottom-0 left-0 z-50 w-72 border-r border-slate-200 bg-white p-5 shadow-xl md:hidden">
              <nav className="space-y-0.5">
                {sidebarLinks.map((link) => {
                  const isActive = link.exact
                    ? location.pathname === link.to
                    : location.pathname.startsWith(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center rounded-xl font-semibold transition-all ${
                        isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                      style={{ padding: '12px 16px', gap: '12px', marginBottom: '4px' }}
                    >
                      <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-6 border-t border-slate-200 pt-4">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={15} />
                  Keluar (Sign Out)
                </button>
              </div>
            </aside>
          </>
        )}

        {/* Dynamic Page Outlet */}
        <main className="flex-1" style={{ padding: '40px' }}>
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </main>
    </div>
  );
}
