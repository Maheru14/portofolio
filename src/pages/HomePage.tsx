import { useEffect, useState } from 'react';
import type { Profile, Project, Experience, SocialLink } from '../types/database';
import { getProfile, getProjects, getExperiences, getSocialLinks } from '../lib/supabase';
import { isSupabaseConfigured, demoProfile, demoProjects, demoExperiences, demoSocialLinks } from '../lib/demoData';

import { HeroSection } from '../components/sections/HeroSection';
import { ExperienceContainer } from '../components/sections/ExperienceContainer';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { ContactSection } from '../components/sections/ContactSection';

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (isSupabaseConfigured()) {
        try {
          const [p, proj, exp, links] = await Promise.all([
            getProfile(),
            getProjects(),
            getExperiences(),
            getSocialLinks(),
          ]);
          setProfile(p || demoProfile);
          setProjects(proj && proj.length > 0 ? proj : demoProjects);
          setExperiences(exp && exp.length > 0 ? exp : demoExperiences);
          setSocialLinks(links && links.length > 0 ? links : demoSocialLinks);
        } catch (err) {
          setProfile(demoProfile);
          setProjects(demoProjects);
          setExperiences(demoExperiences);
          setSocialLinks(demoSocialLinks);
        }
      } else {
        setProfile(demoProfile);
        setProjects(demoProjects);
        setExperiences(demoExperiences);
        setSocialLinks(demoSocialLinks);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#C7F8FE] border-t-[var(--color-brand-primary)]" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-32 pb-32">
      <HeroSection profile={profile} />
      <ExperienceContainer experiences={experiences} />
      <ProjectsSection projects={projects} />
      <ContactSection socialLinks={socialLinks} profile={profile} />
    </div>
  );
}
