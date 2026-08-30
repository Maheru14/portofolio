import { useEffect, useState } from 'react';
import {
  Plus,
  Save,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Edit3,
  ExternalLink,
} from 'lucide-react';
import type { SocialLink } from '../../types/database';
import {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
} from '../../lib/supabase';
import { getPlatformIcon, getPlatformLabel } from '../../lib/platformUtils';
import { demoSocialLinks } from '../../lib/demoData';

const platformOptions = [
  { value: 'github', label: 'GitHub' },
  { value: 'email', label: 'Email (mailto:)' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
];

const emptySocialLink: Omit<SocialLink, 'id' | 'created_at'> = {
  platform: 'github',
  url: '',
  sort_order: 0,
};

export default function ManageSocialLinks() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<SocialLink> | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function fetchLinks() {
    try {
      const data = await getSocialLinks();
      if (data && data.length > 0) {
        setLinks(data);
      } else {
        setLinks(demoSocialLinks);
      }
    } catch (err) {
      console.warn('Error fetching social links, using fallback:', err);
      setLinks(demoSocialLinks);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setMessage(null);
    try {
      if (editing.id) {
        await updateSocialLink(editing.id, {
          platform: editing.platform || 'github',
          url: editing.url || '',
          sort_order: editing.sort_order || 0,
        });
      } else {
        await createSocialLink({
          platform: editing.platform || 'github',
          url: editing.url || '',
          sort_order: editing.sort_order || 0,
        });
      }
      setMessage({ type: 'success', text: 'Tautan sosial media berhasil disimpan!' });
      setEditing(null);
      await fetchLinks();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal menyimpan tautan sosial media';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus tautan sosial media ini?')) return;
    try {
      await deleteSocialLink(id);
      setMessage({ type: 'success', text: 'Tautan berhasil dihapus!' });
      await fetchLinks();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal menghapus tautan';
      setMessage({ type: 'error', text: errorMessage });
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2.5">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-500">Memuat tautan sosial...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Kelola Social Links & Kontak
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Total {links.length} saluran komunikasi yang terhubung ke portofolio Anda.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...emptySocialLink })}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-slate-800"
        >
          <Plus size={15} />
          <span>Tambah Tautan Baru</span>
        </button>
      </div>

      {/* Message Banner */}
      {message && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border p-4 text-xs font-semibold ${
            message.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '20px' }}>
        {links.map((link) => (
          <div
            key={link.id}
            className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs"
          >
            <div className="flex items-start justify-between" style={{ padding: '24px' }}>
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 shadow-2xs">
                  {getPlatformIcon(link.platform)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">
                    {getPlatformLabel(link.platform)}
                  </p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500 hover:text-slate-900"
                  >
                    <span className="truncate">{link.url}</span>
                    <ExternalLink size={10} className="shrink-0 text-slate-400" />
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0 pl-3">
                <button
                  onClick={() => setEditing({ ...link })}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  title="Edit tautan"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50"
                  title="Hapus tautan"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog Form */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-2xs">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl" style={{ padding: '32px' }}>
            <div className="flex items-center justify-between border-b border-slate-100" style={{ paddingBottom: '16px', marginBottom: '24px' }}>
              <h2 className="text-base font-bold text-slate-900">
                {editing.id ? 'Edit Tautan' : 'Tambah Tautan Baru'}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Platform Media Sosial *
                </label>
                <select
                  required
                  value={editing.platform || 'github'}
                  onChange={(e) => setEditing({ ...editing, platform: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:border-indigo-600 focus:outline-none sm:text-sm"
                  style={{ padding: '12px 16px' }}
                >
                  {platformOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Target URL / Alamat Tautan *
                </label>
                <input
                  type="text"
                  required
                  value={editing.url || ''}
                  onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 text-xs font-medium text-slate-900 focus:border-indigo-600 focus:outline-none sm:text-sm"
                  style={{ padding: '12px 16px' }}
                  placeholder={
                    editing.platform === 'email'
                      ? 'mailto:dianmaheru@example.com'
                      : 'https://github.com/dianmaheru'
                  }
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  {editing.platform === 'email'
                    ? 'Gunakan format mailto:email@anda.com'
                    : 'Gunakan URL lengkap https://...'}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/50" style={{ padding: '16px 20px', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50"
                  style={{ padding: '12px 24px' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-slate-900 text-xs font-bold text-white shadow-xs hover:bg-slate-800 disabled:opacity-60"
                  style={{ padding: '12px 24px' }}
                >
                  {saving ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Save size={14} />
                  )}
                  Simpan Tautan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
