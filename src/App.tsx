import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ManageProfile from './pages/admin/ManageProfile';
import ManageProjects from './pages/admin/ManageProjects';
import ManageExperiences from './pages/admin/ManageExperiences';
import ManageSocialLinks from './pages/admin/ManageSocialLinks';
import type { SocialLink, Profile } from './types/database';
import { getSocialLinks, getProfile } from './lib/supabase';
import { isSupabaseConfigured, demoSocialLinks, demoProfile } from './lib/demoData';

function ScrollToHashElement() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const elementId = hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          const yOffset = -100;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash]);
  return null;
}

function PublicSinglePageLayout() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function fetchPublicData() {
      if (isSupabaseConfigured()) {
        try {
          const [links, prof] = await Promise.all([getSocialLinks(), getProfile()]);
          setSocialLinks(links && links.length > 0 ? links : demoSocialLinks);
          setProfile(prof || demoProfile);
        } catch {
          setSocialLinks(demoSocialLinks);
          setProfile(demoProfile);
        }
      } else {
        setSocialLinks(demoSocialLinks);
        setProfile(demoProfile);
      }
    }
    fetchPublicData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 sm:px-8">
        <HomePage />
      </main>
      <Footer socialLinks={socialLinks} profileName={profile?.full_name || 'Dian Maheru'} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHashElement />
      <Routes>
        {/* Admin CMS routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ManageProfile />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="experiences" element={<ManageExperiences />} />
          <Route path="social-links" element={<ManageSocialLinks />} />
        </Route>

        {/* Public Route */}
        <Route path="/*" element={<PublicSinglePageLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
