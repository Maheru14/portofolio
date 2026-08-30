import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { signIn } from '../../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Login gagal. Silakan periksa kembali email dan password Anda.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 relative">
      {/* Back Link */}
      <div className="absolute top-8 left-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Kembali ke Portofolio</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white relative z-10"
        style={{ padding: '56px' }}
      >
        <div className="text-center" style={{ marginBottom: '40px' }}>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Masuk ke CMS
          </h2>
          <p className="mt-3 text-base text-slate-500">
            Masukkan email dan password Anda.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" style={{ marginBottom: '32px' }}>
            <AlertCircle size={17} className="mt-0.5 shrink-0 text-red-600" />
            <div className="flex-1 font-semibold">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: '28px' }}>
          <div>
            <label htmlFor="login-email" className="font-bold text-slate-700 uppercase tracking-widest text-[11px]" style={{ display: 'block', marginBottom: '12px' }}>
              Email
            </label>
            <div className="relative flex items-center" style={{ width: '100%' }}>
              <span className="pointer-events-none absolute text-slate-400" style={{ left: '20px' }}>
                <Mail size={20} />
              </span>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 text-base text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                style={{ padding: '18px 20px 18px 56px', minHeight: '60px' }}
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="font-bold text-slate-700 uppercase tracking-widest text-[11px]" style={{ display: 'block', marginBottom: '12px' }}>
              Password
            </label>
            <div className="relative flex items-center" style={{ width: '100%' }}>
              <span className="pointer-events-none absolute text-slate-400" style={{ left: '20px' }}>
                <Lock size={20} />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 text-base text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                style={{ padding: '18px 56px 18px 56px', minHeight: '60px' }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-slate-400 transition-colors hover:text-slate-600 focus:outline-none"
                style={{ right: '20px' }}
                aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 text-white font-bold transition-all hover:bg-slate-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            style={{ padding: '20px', minHeight: '64px', marginTop: '16px', fontSize: '16px' }}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Memverifikasi...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Lock size={18} />
                <span>Masuk ke Dashboard</span>
              </div>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
