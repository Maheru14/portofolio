import { useEffect, useState } from 'react';
import { Send, ArrowUpRight, MessageSquare, Mail } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import GlassCard from '../components/GlassCard';
import type { SocialLink } from '../types/database';
import { getSocialLinks } from '../lib/supabase';
import { isSupabaseConfigured, demoSocialLinks } from '../lib/demoData';
import { getPlatformIcon, getPlatformLabel, getPlatformColor } from '../lib/platformUtils';

export default function ContactPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    async function fetchData() {
      if (isSupabaseConfigured()) {
        try {
          const data = await getSocialLinks();
          setSocialLinks(data);
        } catch {
          setSocialLinks(demoSocialLinks);
        }
      } else {
        setSocialLinks(demoSocialLinks);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const emailLink = socialLinks.find((l) => l.platform === 'email');
  const emailAddress = emailLink?.url.replace('mailto:', '') || 'dianmaheru@example.com';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(formData.subject || `Pesan dari ${formData.name}`);
    const body = encodeURIComponent(
      `Halo Dian,\n\nNama: ${formData.name}\nEmail: ${formData.email}\n\nPesan:\n${formData.message}`
    );
    window.open(`mailto:${emailAddress}?subject=${subject}&body=${body}`, '_self');
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-28">
      {/* ===== Page Header ===== */}
      <AnimatedSection>
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-bold tracking-widest text-indigo-600 uppercase">Get In Touch</p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Hubungi <span className="gradient-text">Saya</span>
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-slate-500">
            Tertarik untuk bekerja sama, menawarkan peluang kerja, atau sekadar berdiskusi? Jangan ragu untuk menghubungi saya.
          </p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* ===== Social Links Column ===== */}
        <div className="lg:col-span-2">
          <AnimatedSection delay={0.08} direction="left">
            <h2 className="mb-5 flex items-center gap-2 text-base font-extrabold text-[#9CD5FF]">
              <MessageSquare size={17} className="text-[#9CD5FF]" />
              Saluran Komunikasi
            </h2>
            <div className="flex flex-col gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <GlassCard className="flex items-center gap-4 p-4 transition-all border border-[#7AAACE]/50 bg-[#355872] shadow-[0_8px_30px_rgba(156,213,255,0.08)] hover:shadow-[0_8px_40px_rgba(156,213,255,0.15)] hover:border-[#9CD5FF]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#7AAACE]/50 bg-[#0f172a] text-[#9CD5FF] shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                      {getPlatformIcon(link.platform)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#F7F8F0]">{getPlatformLabel(link.platform)}</p>
                      <p className="mt-0.5 truncate text-xs text-[#7AAACE]">
                        {link.url.replace('mailto:', '').replace('https://', '').replace('www.', '')}
                      </p>
                    </div>
                    <ArrowUpRight size={16} className="shrink-0 text-[#7AAACE] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </GlassCard>
                </a>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* ===== Contact Form Column ===== */}
        <div className="lg:col-span-3">
          <AnimatedSection delay={0.12} direction="right">
            <GlassCard hover={false} className="p-7 sm:p-8 border border-[#7AAACE]/50 bg-[#355872] shadow-[0_8px_30px_rgba(156,213,255,0.08)]">

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="input-label">
                      Nama Lengkap *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="Nama Anda"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="input-label">
                      Alamat Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      placeholder="email@anda.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="input-label">
                    Subjek / Topik
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field"
                    placeholder="Contoh: Project Offer"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="input-label">
                    Pesan *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Tuliskan pesan Anda secara detail..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary group mt-2 w-full py-4 text-base"
                >
                  <Send size={15} className="transition-transform group-hover:translate-x-0.5" />
                  Kirim Pesan ke Email
                </button>
              </form>
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
