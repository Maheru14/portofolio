import { useEffect, useState } from 'react';
import {
  Plus,
  Save,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  Users,
  Edit3,
  Calendar,
  Building2,
  UploadCloud,
  Loader2,
} from 'lucide-react';
import type { Experience } from '../../types/database';
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  uploadImage,
} from '../../lib/supabase';
import { demoExperiences } from '../../lib/demoData';

const emptyExperience: Omit<Experience, 'id' | 'created_at' | 'updated_at'> = {
  type: 'work',
  company: '',
  role: '',
  description: '',
  start_date: new Date().toISOString().split('T')[0],
  end_date: null,
  logo_url: '',
  sort_order: 0,
};

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function ManageExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [isCurrent, setIsCurrent] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'work' | 'organization'>('all');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0 || !editing) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    setMessage(null);
    
    try {
      const publicUrl = await uploadImage(file, 'experiences');
      setEditing({ ...editing, logo_url: publicUrl });
      setMessage({ type: 'success', text: 'Logo berhasil diunggah!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal mengunggah logo' });
    } finally {
      setUploadingImage(false);
    }
  }

  async function fetchExperiences() {
    try {
      const data = await getExperiences();
      if (data && data.length > 0) {
        setExperiences(data);
      } else {
        setExperiences(demoExperiences);
      }
    } catch (err) {
      console.warn('Error fetching experiences, using fallback:', err);
      setExperiences(demoExperiences);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExperiences();
  }, []);

  function handleOpenEdit(exp: Partial<Experience>) {
    setEditing({ ...exp });
    setIsCurrent(!exp.end_date);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        type: editing.type || 'work',
        company: editing.company || '',
        role: editing.role || '',
        description: editing.description || null,
        start_date: editing.start_date || new Date().toISOString().split('T')[0],
        end_date: isCurrent ? null : editing.end_date || null,
        logo_url: editing.logo_url || null,
        sort_order: editing.sort_order || 0,
      };

      if (editing.id) {
        await updateExperience(editing.id, payload);
      } else {
        await createExperience(payload);
      }
      setMessage({ type: 'success', text: 'Pengalaman berhasil disimpan ke database!' });
      setEditing(null);
      await fetchExperiences();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal menyimpan pengalaman';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus data pengalaman ini?')) return;
    try {
      await deleteExperience(id);
      setMessage({ type: 'success', text: 'Pengalaman berhasil dihapus!' });
      await fetchExperiences();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal menghapus pengalaman';
      setMessage({ type: 'error', text: errorMessage });
    }
  }

  const filteredList =
    activeTab === 'all'
      ? experiences
      : experiences.filter((e) => e.type === activeTab);

  const workCount = experiences.filter((e) => e.type === 'work').length;
  const orgCount = experiences.filter((e) => e.type === 'organization').length;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2.5">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-500">Memuat data pengalaman...</span>
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
            Riwayat Pengalaman
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Kelola pengalaman kerja profesional dan keikutsertaan organisasi.
          </p>
        </div>
        <button
          onClick={() => handleOpenEdit({ ...emptyExperience })}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-slate-800"
        >
          <Plus size={15} />
          <span>Tambah Pengalaman</span>
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

      {/* Tab Filter */}
      <div className="flex gap-1.5 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          style={{ padding: '8px 16px' }}
        >
          Semua ({experiences.length})
        </button>
        <button
          onClick={() => setActiveTab('work')}
          className={`rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'work'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          style={{ padding: '8px 16px' }}
        >
          Pengalaman Kerja ({workCount})
        </button>
        <button
          onClick={() => setActiveTab('organization')}
          className={`rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'organization'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          style={{ padding: '8px 16px' }}
        >
          Organisasi ({orgCount})
        </button>
      </div>

      {/* Experience List */}
      <div className="space-y-3">
        {filteredList.map((exp) => (
          <div
            key={exp.id}
            className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-start gap-3.5" style={{ padding: '24px' }}>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 font-extrabold text-slate-700">
                {exp.logo_url ? (
                  <img
                    src={exp.logo_url}
                    alt={exp.company}
                    className="h-full w-full object-cover"
                  />
                ) : exp.type === 'work' ? (
                  <Briefcase size={20} className="text-slate-500" />
                ) : (
                  <Users size={20} className="text-slate-500" />
                )}
              </div>
              <div className="flex flex-1 flex-col sm:flex-row">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900">{exp.role}</h2>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        exp.type === 'work'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                          : 'bg-violet-50 text-violet-700 border border-violet-200/60'
                      }`}
                    >
                      {exp.type === 'work' ? 'Kerja' : 'Organisasi'}
                    </span>
                  </div>
                  <p className="flex items-center gap-1 text-xs font-semibold text-slate-600 mt-0.5">
                    <Building2 size={12} className="text-slate-400" />
                    {exp.company}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar size={11} />
                    {formatDate(exp.start_date)} —{' '}
                    {exp.end_date ? formatDate(exp.end_date) : 'Sekarang'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/50 p-4 sm:border-t-0 sm:bg-transparent sm:p-4.5" style={{ minWidth: '160px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => handleOpenEdit(exp)}
                className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                <Edit3 size={12} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
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
          <div className="max-h-[90vh] w-full max-w-[95%] md:max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl" style={{ padding: '32px' }}>
            <div className="flex items-center justify-between border-b border-slate-100" style={{ marginBottom: '24px', paddingBottom: '16px' }}>
              <h2 className="text-base font-bold text-slate-900">
                {editing.id ? 'Edit Pengalaman' : 'Tambah Pengalaman Baru'}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col" style={{ gap: '20px' }}>
              {/* Type selector */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Tipe Pengalaman *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, type: 'work' })}
                    className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-bold transition-all ${
                      editing.type === 'work'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Briefcase size={14} />
                    Pengalaman Kerja
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, type: 'organization' })}
                    className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-bold transition-all ${
                      editing.type === 'organization'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Users size={14} />
                    Organisasi
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Nama Perusahaan / Organisasi *
                </label>
                <input
                  type="text"
                  required
                  value={editing.company || ''}
                  onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 text-xs font-medium text-slate-900 focus:border-indigo-600 focus:outline-none sm:text-sm"
                  style={{ padding: '12px 16px' }}
                  placeholder="Contoh: Tech Startup Inc."
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Posisi / Jabatan *
                </label>
                <input
                  type="text"
                  required
                  value={editing.role || ''}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 text-xs font-medium text-slate-900 focus:border-indigo-600 focus:outline-none sm:text-sm"
                  style={{ padding: '12px 16px' }}
                  placeholder="Contoh: Frontend Developer / Tech Lead"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Tanggal Mulai *
                  </label>
                  <input
                    type="date"
                    required
                    value={editing.start_date ? editing.start_date.split('T')[0] : ''}
                    onChange={(e) => setEditing({ ...editing, start_date: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 text-xs font-medium text-slate-900 focus:border-indigo-600 focus:outline-none sm:text-sm"
                    style={{ padding: '12px 16px' }}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    disabled={isCurrent}
                    value={editing.end_date ? editing.end_date.split('T')[0] : ''}
                    onChange={(e) => setEditing({ ...editing, end_date: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 text-xs font-medium text-slate-900 focus:border-indigo-600 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 sm:text-sm"
                    style={{ padding: '12px 16px' }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="current-checkbox"
                  type="checkbox"
                  checked={isCurrent}
                  onChange={(e) => {
                    setIsCurrent(e.target.checked);
                    if (e.target.checked) setEditing({ ...editing, end_date: null });
                  }}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="current-checkbox" className="text-xs font-semibold text-slate-700">
                  Masih aktif / bekerja di sini hingga saat ini (Sekarang)
                </label>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Gambar / Logo (Opsional)
                </label>
                <div className="flex flex-col gap-2">
                  {editing.logo_url && (
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200">
                      <img src={editing.logo_url} alt="Logo Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <input
                    id="experience-logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => document.getElementById('experience-logo-upload')?.click()}
                    className="flex items-center justify-center gap-2 w-full max-w-sm rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    style={{ padding: '12px 16px' }}
                  >
                    {uploadingImage ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <UploadCloud size={16} />
                    )}
                    {uploadingImage ? 'Mengunggah...' : (editing.logo_url ? 'Ganti Logo' : 'Pilih Foto dari Komputer')}
                  </button>
                  <p className="text-[11px] text-slate-400">
                    Pilih logo resolusi persegi maks. 2MB.
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Deskripsi Tanggung Jawab & Pencapaian
                </label>
                <textarea
                  rows={3}
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 text-xs font-medium text-slate-900 focus:border-indigo-600 focus:outline-none sm:text-sm"
                  style={{ padding: '12px 16px' }}
                  placeholder="Jelaskan peran Anda, teknologi yang digunakan, serta pencapaian..."
                />
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
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
