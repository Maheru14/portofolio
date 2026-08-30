import { useState } from 'react';
import { motion } from 'framer-motion';
import type { SocialLink, Profile } from '@/types/database';

import { getPlatformIcon, getPlatformLabel } from '@/lib/platformUtils';

export const ContactSection = ({ socialLinks, profile }: { socialLinks: SocialLink[], profile: Profile | null }) => {
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const emailLink = socialLinks.find(l => l.platform === 'email');
  const targetEmail = emailLink?.url.replace('mailto:', '') || 'hello@example.com';

  const isFormEmpty = !formData.email && !formData.subject && !formData.message;
  const buttonText = isFormEmpty ? "Send" : "Send Message";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _replyto: formData.email,
          _subject: formData.subject || "New Message from Portfolio",
          email: formData.email,
          message: formData.message
        })
      });
      
      setIsSuccess(true);
      setFormData({ email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full scroll-mt-32">
      <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
        
        {/* Left: Social Links */}
        <div className="flex-1 flex flex-col items-start justify-center w-full">
          <div className="flex flex-col gap-4 w-full max-w-sm">
            {socialLinks.slice(0, 4).map((link) => (
              <a 
                key={link.id} 
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-6 p-4 rounded-2xl hover:bg-[#C7F8FE]/40 transition-colors border border-transparent hover:border-[#99E1D9]/50 group"
              >
                <span className="w-12 h-12 rounded-full bg-[#C7F8FE] text-[#001619] flex items-center justify-center shrink-0 group-hover:bg-[#50E8F4] group-hover:scale-110 transition-all duration-300">
                  {getPlatformIcon(link.platform)}
                </span>
                <span className="text-[#001619] font-bold text-lg group-hover:text-[#50E8F4] transition-colors">{getPlatformLabel(link.platform)}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="flex-1 w-full flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-xl shadow-[#001619]/5 border border-[#001619]/5 relative overflow-hidden"
          >
            {isSuccess ? (
              <div className="absolute inset-0 bg-[#50E8F4] flex flex-col items-center justify-center text-[#001619] z-10 p-10 text-center animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 className="display-font text-3xl font-bold mb-2">Message Sent!</h3>
                <p className="font-medium opacity-80">Thank you for reaching out. I'll get back to you shortly.</p>
              </div>
            ) : null}

            <h3 className="display-font text-3xl font-bold text-[#001619] mb-2">Send a Message</h3>
            <p className="text-[#001619]/50 text-sm mb-8 font-medium">Fill out the form below and your message will be sent directly to my inbox.</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <input
                type="email"
                required
                disabled={isSubmitting}
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#F4F8F9] px-6 py-4 rounded-2xl text-[#001619] placeholder:text-[#001619]/40 font-medium focus:outline-none focus:ring-2 focus:ring-[#50E8F4] disabled:opacity-50"
                placeholder="Your Email Address"
              />
              <input
                type="text"
                required
                disabled={isSubmitting}
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-[#F4F8F9] px-6 py-4 rounded-2xl text-[#001619] placeholder:text-[#001619]/40 font-medium focus:outline-none focus:ring-2 focus:ring-[#50E8F4] disabled:opacity-50"
                placeholder="Subject"
              />
              <textarea
                required
                disabled={isSubmitting}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full bg-[#F4F8F9] px-6 py-4 rounded-2xl text-[#001619] placeholder:text-[#001619]/40 font-medium focus:outline-none focus:ring-2 focus:ring-[#50E8F4] resize-none disabled:opacity-50"
                placeholder="Your Message..."
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C7F8FE] text-[#001619] font-bold text-lg py-4 rounded-2xl hover:bg-[#50E8F4] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#001619]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Sending...
                  </>
                ) : (
                  buttonText
                )}
              </button>
            </form>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
