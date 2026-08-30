import { useEffect, useState } from 'react';
import { Save, AlertCircle, CheckCircle2, User, Image as ImageIcon, FileText, UploadCloud, Loader2 } from 'lucide-react';
import type { Profile } from '../../types/database';
import { getProfile, upsertProfile, uploadImage, uploadDocument } from '../../lib/supabase';
import { demoProfile } from '../../lib/demoData';

export default function ManageProfile() {
  const [profile, setProfile] = useState<Partial<Profile>>({
    full_name: '',
    title: '',
    bio: '',
    avatar_url: '',
    resume_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleDocumentUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // Only accept PDF
    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Harap unggah file berformat PDF' });
      return;
    }
    
    setUploadingDocument(true);
    setMessage(null);
    
    try {
      const publicUrl = await uploadDocument(file, 'cv');
      setProfile((prev) => ({ ...prev, resume_url: publicUrl }));
      setMessage({ type: 'success', text: 'CV berhasil diunggah! Jangan lupa klik Simpan Perubahan.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal mengunggah CV' });
    } finally {
      setUploadingDocument(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    setMessage(null);
    
    try {
      const publicUrl = await uploadImage(file, 'avatars');
      setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));
      setMessage({ type: 'success', text: 'Foto profil berhasil diunggah! Jangan lupa klik Simpan Perubahan.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal mengunggah gambar' });
    } finally {
      setUploadingImage(false);
    }
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();
        if (data) {
          setProfile(data);
        } else {
          setProfile(demoProfile);
        }
      } catch (err) {
        console.warn('Error fetching profile, using fallback:', err);
        setProfile(demoProfile);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await upsertProfile({
        id: profile.id,
        full_name: profile.full_name || '',
        title: profile.title || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
        resume_url: profile.resume_url || '',
      });
      setMessage({ type: 'success', text: 'Profil berhasil disimpan dan diperbarui!' });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal menyimpan data profil ke Supabase';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2.5">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-500">Memuat profil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Profil Pengguna
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Perbarui informasi biodata, gelar profesi, dan foto avatar yang tampil di halaman utama portofolio.
        </p>
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

      {/* Form Container */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs" style={{ padding: '40px' }}>
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Preview & URL Header */}
          <div className="flex flex-col sm:flex-row sm:items-center border-b border-slate-100" style={{ gap: '24px', paddingBottom: '32px', marginBottom: '32px' }}>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 shadow-2xs">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || 'Avatar'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={32} className="text-slate-400" />
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="profile-avatar"
                className="block text-xs font-bold text-slate-700"
              >
                URL Foto Profil (Avatar)
              </label>
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-3.5 text-slate-400">
                  <ImageIcon size={15} />
                </span>
                <input
                  id="profile-avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => document.getElementById('profile-avatar-upload')?.click()}
                  className="flex items-center gap-2 w-full rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  style={{ padding: '12px 16px', justifyContent: 'center' }}
                >
                  {uploadingImage ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <UploadCloud size={16} />
                  )}
                  {uploadingImage ? 'Mengunggah...' : 'Pilih Foto dari Komputer'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Pilih foto JPG, PNG, atau WebP (maks. 2MB disarankan).
              </p>
            </div>
          </div>

          {/* Names & Title Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '24px' }}>
            <div>
              <label
                htmlFor="profile-name"
                className="mb-1.5 block text-xs font-bold text-slate-700"
              >
                Nama Lengkap *
              </label>
              <input
                id="profile-name"
                type="text"
                required
                value={profile.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none sm:text-sm"
                style={{ padding: '12px 16px' }}
                placeholder="Dian Maheru"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="profile-title"
                className="mb-1.5 block text-xs font-bold text-slate-700"
              >
                Titel / Profesi Utama *
              </label>
              <input
                id="profile-title"
                type="text"
                required
                value={profile.title || ''}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none sm:text-sm"
                style={{ padding: '12px 16px' }}
                placeholder="Full Stack Developer & UI Engineer"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="profile-bio"
              className="mb-1.5 block text-xs font-bold text-slate-700"
            >
              Deskripsi Singkat (Bio)
            </label>
            <textarea
              id="profile-bio"
              rows={4}
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full resize-none rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none sm:text-sm"
              style={{ padding: '12px 16px' }}
              placeholder="Tuliskan ringkasan tentang minat, pengalaman teknis, dan keahlian Anda..."
            />
          </div>

          {/* Resume / CV Link */}
          <div>
            <label
              htmlFor="profile-resume"
              className="mb-1.5 block text-xs font-bold text-slate-700"
            >
              Unggah File Resume / CV (Opsional, khusus PDF)
            </label>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <input
                  id="profile-resume-upload"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleDocumentUpload}
                  disabled={uploadingDocument}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <div
                  className={`flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition-colors ${
                    uploadingDocument
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:border-indigo-400 hover:bg-slate-100'
                  }`}
                  style={{ padding: '16px' }}
                >
                  {uploadingDocument ? (
                    <Loader2 size={18} className="animate-spin text-indigo-600" />
                  ) : (
                    <UploadCloud size={18} className="text-slate-400" />
                  )}
                  <span className="text-xs font-semibold text-slate-600">
                    {uploadingDocument ? 'Mengunggah CV...' : 'Pilih File PDF dari Komputer'}
                  </span>
                </div>
              </div>
              
              {/* Show current CV URL if exists */}
              {profile.resume_url && (
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
                  <FileText size={14} className="text-indigo-600 shrink-0" />
                  <a 
                    href={profile.resume_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="truncate text-slate-600 hover:text-indigo-600 hover:underline flex-1"
                  >
                    {profile.resume_url}
                  </a>
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, resume_url: '' })}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
            <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/50" style={{ padding: '24px', marginTop: '32px' }}>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center rounded-xl bg-slate-900 font-bold text-white transition-all hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                style={{ padding: '16px 32px', gap: '8px' }}
              >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
