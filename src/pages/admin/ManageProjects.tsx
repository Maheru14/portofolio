import { useEffect, useState } from 'react';
import {
  Plus,
  Save,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  FolderGit2,
  Edit3,
  ExternalLink,
  Code2,
  Star,
  UploadCloud,
  Loader2,
} from 'lucide-react';
import type { Project } from '../../types/database';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadImage,
} from '../../lib/supabase';
import { demoProjects } from '../../lib/demoData';

const emptyProject: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  category: '',
  year: new Date().getFullYear().toString(),
  role: '',
  description: '',
  long_description: null,
  key_contributions: [],
  image_url: '',
  gallery_urls: [],
  tech_stack: [],
  live_url: '',
  github_url: '',
  is_featured: false,
  sort_order: 0,
};

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [techInput, setTechInput] = useState('');
  const [contribInput, setContribInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0 || !editing) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    setMessage(null);
    
    try {
      const publicUrl = await uploadImage(file, 'projects');
      setEditing({ ...editing, image_url: publicUrl });
      setMessage({ type: 'success', text: 'Gambar proyek berhasil diunggah!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal mengunggah gambar' });
    } finally {
      setUploadingImage(false);
    }
  }

  async function fetchProjects() {
    try {
      const data = await getProjects();
      if (data && data.length > 0) {
        setProjects(data);
      } else {
        setProjects(demoProjects);
      }
    } catch (err) {
      console.warn('Error fetching projects, using fallback:', err);
      setProjects(demoProjects);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  function addTech() {
    if (techInput.trim() && editing) {
      setEditing({
        ...editing,
        tech_stack: [...(editing.tech_stack || []), techInput.trim()],
      });
      setTechInput('');
    }
  }

  function removeTech(index: number) {
    if (editing) {
      setEditing({
        ...editing,
        tech_stack: (editing.tech_stack || []).filter((_, i) => i !== index),
      });
    }
  }

  function addContrib() {
    if (contribInput.trim() && editing) {
      setEditing({
        ...editing,
        key_contributions: [...(editing.key_contributions || []), contribInput.trim()],
      });
      setContribInput('');
    }
  }

  function removeContrib(index: number) {
    if (editing) {
      setEditing({
        ...editing,
        key_contributions: (editing.key_contributions || []).filter((_, i) => i !== index),
      });
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setMessage(null);
    try {
      if (editing.id) {
        await updateProject(editing.id, {
          title: editing.title || '',
          category: editing.category || null,
          year: editing.year || null,
          role: editing.role || null,
          description: editing.description || null,
          long_description: editing.long_description || null,
          key_contributions: editing.key_contributions || [],
          image_url: editing.image_url || null,
          gallery_urls: editing.gallery_urls || [],
          tech_stack: editing.tech_stack || [],
          live_url: editing.live_url || null,
          github_url: editing.github_url || null,
          is_featured: editing.is_featured || false,
          sort_order: editing.sort_order || 0,
        });
      } else {
        await createProject({
          title: editing.title || '',
          category: editing.category || null,
          year: editing.year || null,
          role: editing.role || null,
          description: editing.description || null,
          long_description: editing.long_description || null,
          key_contributions: editing.key_contributions || [],
          image_url: editing.image_url || null,
          gallery_urls: editing.gallery_urls || [],
          tech_stack: editing.tech_stack || [],
          live_url: editing.live_url || null,
          github_url: editing.github_url || null,
          is_featured: editing.is_featured || false,
          sort_order: editing.sort_order || 0,
        });
      }
      setMessage({ type: 'success', text: 'Proyek berhasil disimpan ke database!' });
      setEditing(null);
      await fetchProjects();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal menyimpan proyek ke database';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return;
    try {
      await deleteProject(id);
      setMessage({ type: 'success', text: 'Proyek berhasil dihapus!' });
      await fetchProjects();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal menghapus proyek';
      setMessage({ type: 'error', text: errorMessage });
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2.5">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-500">Memuat data proyek...</span>
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
            Kelola Proyek
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Total {projects.length} proyek terdaftar di portofolio Anda.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...emptyProject })}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-slate-800"
        >
          <Plus size={15} />
          <span>Tambah Proyek Baru</span>
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
              {project.image_url ? (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  <FolderGit2 size={32} />
                </div>
              )}
              {project.is_featured && (
                <span className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 shadow-2xs">
                  <Star size={10} className="fill-amber-500 text-amber-500" />
                  Featured
                </span>
              )}
            </div>

            {/* Card Content */}
            <div className="flex flex-1 flex-col" style={{ padding: '24px' }}>
              <h2 className="text-sm font-bold text-slate-900">{project.title}</h2>
              <p className="mt-1 flex-1 text-xs text-slate-500 line-clamp-2">
                {project.description || 'Tidak ada deskripsi singkat.'}
              </p>

              {/* Tech stack */}
              <div className="mt-3 flex flex-wrap gap-1">
                {(project.tech_stack || []).map((t) => (
                  <span
                    key={t}
                    className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Links preview */}
              <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3 text-[11px] font-semibold">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                  >
                    <ExternalLink size={11} /> Demo
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-slate-600 hover:text-slate-900"
                  >
                    <Code2 size={11} /> GitHub
                  </a>
                )}
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/50" style={{ padding: '16px 20px', gap: '12px' }}>
              <button
                onClick={() => setEditing({ ...project })}
                className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                <Edit3 size={12} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="flex items-center gap-1 rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-600 shadow-2xs hover:bg-red-50"
              >
                <Trash2 size={12} />
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog Form */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-2xs">
          <div className="max-h-[90vh] w-full max-w-[95%] md:max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl" style={{ padding: '32px' }}>
            <div className="flex items-center justify-between border-b border-slate-100" style={{ marginBottom: '24px', paddingBottom: '16px' }}>
              <h2 className="text-base font-bold text-slate-900">
                {editing.id ? 'Edit Proyek' : 'Tambah Proyek Baru'}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col" style={{ gap: '20px' }}>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Judul Proyek *
                </label>
                <input
                  type="text"
                  required
                  value={editing.title || ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 text-xs font-medium text-slate-900 focus:border-indigo-600 focus:outline-none sm:text-sm"
                  style={{ padding: '12px 16px' }}
                  placeholder="Contoh: E-Commerce Platform"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Kategori</label>
                  <input
                    type="text"
                    value={editing.category || ''}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 text-xs font-medium focus:border-indigo-600 focus:outline-none sm:text-sm"
                    style={{ padding: '12px 16px' }}
                    placeholder="WEB APP"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Tahun</label>
                  <input
                    type="text"
                    value={editing.year || ''}
                    onChange={(e) => setEditing({ ...editing, year: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 text-xs font-medium focus:border-indigo-600 focus:outline-none sm:text-sm"
                    style={{ padding: '12px 16px' }}
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Role Anda</label>
                  <input
                    type="text"
                    value={editing.role || ''}
                    onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 text-xs font-medium focus:border-indigo-600 focus:outline-none sm:text-sm"
                    style={{ padding: '12px 16px' }}
                    placeholder="Full Stack Developer"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Deskripsi Singkat (Card Grid) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 text-xs font-medium text-slate-900 focus:border-indigo-600 focus:outline-none sm:text-sm"
                  style={{ padding: '12px 16px' }}
                  placeholder="Ringkasan tentang proyek ini..."
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Deskripsi Lengkap (Tentang Proyek)
                </label>
                <textarea
                  rows={4}
                  value={editing.long_description || ''}
                  onChange={(e) => setEditing({ ...editing, long_description: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 text-xs font-medium text-slate-900 focus:border-indigo-600 focus:outline-none sm:text-sm"
                  style={{ padding: '12px 16px' }}
                  placeholder="Ceritakan masalah apa yang diselesaikan dan konteks pembuatannya..."
                />
              </div>

              {/* Key Contributions */}
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Kontribusi Utama (Bullet Points)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={contribInput}
                    onChange={(e) => setContribInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addContrib();
                      }
                    }}
                    className="flex-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-900 focus:border-indigo-600 focus:outline-none sm:text-sm"
                    style={{ padding: '12px 16px' }}
                    placeholder="Contoh: Merancang API menggunakan Node.js (Tekan Tambah)"
                  />
                  <button
                    type="button"
                    onClick={addContrib}
                    className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    Tambah
                  </button>
                </div>
                <div className="mt-2 flex flex-col gap-1.5">
                  {(editing.key_contributions || []).map((t, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 border border-slate-100 text-xs font-medium text-slate-700"
                    >
                      <span>• {t}</span>
                      <button
                        type="button"
                        onClick={() => removeContrib(idx)}
                        className="text-slate-400 hover:text-red-600 shrink-0 ml-2"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Gambar / Cover Proyek
                </label>
                <div className="flex flex-col gap-2">
                  {editing.image_url && (
                    <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-slate-200">
                      <img src={editing.image_url} alt="Cover Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <input
                    id="project-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => document.getElementById('project-image-upload')?.click()}
                    className="flex items-center justify-center gap-2 w-full max-w-sm rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    style={{ padding: '12px 16px' }}
                  >
                    {uploadingImage ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <UploadCloud size={16} />
                    )}
                    {uploadingImage ? 'Mengunggah...' : (editing.image_url ? 'Ganti Gambar' : 'Pilih Foto dari Komputer')}
                  </button>
                  <p className="text-[11px] text-slate-400">
                    Pilih foto resolusi landscape (16:9) maks. 2MB.
                  </p>
                </div>
              </div>

              {/* Tech stack tags */}
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Teknologi (Tech Stack)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTech();
                      }
                    }}
                    className="flex-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-900 focus:border-indigo-600 focus:outline-none sm:text-sm"
                    style={{ padding: '12px 16px' }}
                    placeholder="Contoh: React, TypeScript, Supabase (Tekan Tambah)"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    Tambah
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(editing.tech_stack || []).map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTech(idx)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    URL Live Demo (Opsional)
                  </label>
                  <input
                    type="url"
                    value={editing.live_url || ''}
                    onChange={(e) => setEditing({ ...editing, live_url: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 text-xs font-medium text-slate-900 focus:border-indigo-600 focus:outline-none sm:text-sm"
                    style={{ padding: '12px 16px' }}
                    placeholder="https://my-app.com"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    URL GitHub / Repository (Opsional)
                  </label>
                  <input
                    type="url"
                    value={editing.github_url || ''}
                    onChange={(e) => setEditing({ ...editing, github_url: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 text-xs font-medium text-slate-900 focus:border-indigo-600 focus:outline-none sm:text-sm"
                    style={{ padding: '12px 16px' }}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="featured-checkbox"
                  type="checkbox"
                  checked={editing.is_featured || false}
                  onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="featured-checkbox"
                  className="text-xs font-semibold text-slate-700"
                >
                  Tampilkan sebagai Proyek Unggulan (Featured Project)
                </label>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
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
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
