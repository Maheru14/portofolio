-- =============================================
-- Portfolio Database Schema & Seed Data for Supabase
-- Run this entire script in Supabase SQL Editor
-- =============================================

-- 1. Create Tables
-- Profile (singleton)
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  image_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Experiences (work + organization)
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('work', 'organization')),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  logo_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Social Links
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 2. Row Level Security (RLS)
-- Public can read, only authenticated users can write
-- =============================================

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can read profile" ON profile;
DROP POLICY IF EXISTS "Public can read projects" ON projects;
DROP POLICY IF EXISTS "Public can read experiences" ON experiences;
DROP POLICY IF EXISTS "Public can read social_links" ON social_links;

DROP POLICY IF EXISTS "Auth can insert profile" ON profile;
DROP POLICY IF EXISTS "Auth can update profile" ON profile;
DROP POLICY IF EXISTS "Auth can delete profile" ON profile;

DROP POLICY IF EXISTS "Auth can insert projects" ON projects;
DROP POLICY IF EXISTS "Auth can update projects" ON projects;
DROP POLICY IF EXISTS "Auth can delete projects" ON projects;

DROP POLICY IF EXISTS "Auth can insert experiences" ON experiences;
DROP POLICY IF EXISTS "Auth can update experiences" ON experiences;
DROP POLICY IF EXISTS "Auth can delete experiences" ON experiences;

DROP POLICY IF EXISTS "Auth can insert social_links" ON social_links;
DROP POLICY IF EXISTS "Auth can update social_links" ON social_links;
DROP POLICY IF EXISTS "Auth can delete social_links" ON social_links;

-- Public read policies
CREATE POLICY "Public can read profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Public can read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public can read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public can read social_links" ON social_links FOR SELECT USING (true);

-- Authenticated write policies
CREATE POLICY "Auth can insert profile" ON profile FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth can update profile" ON profile FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth can delete profile" ON profile FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth can insert projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth can update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth can delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth can insert experiences" ON experiences FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth can update experiences" ON experiences FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth can delete experiences" ON experiences FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth can insert social_links" ON social_links FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth can update social_links" ON social_links FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth can delete social_links" ON social_links FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- 3. Auto-update updated_at trigger
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profile_updated_at ON profile;
DROP TRIGGER IF EXISTS projects_updated_at ON projects;
DROP TRIGGER IF EXISTS experiences_updated_at ON experiences;

CREATE TRIGGER profile_updated_at BEFORE UPDATE ON profile FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 4. Initial Seed Data (Contoh Data Awal)
-- =============================================

-- Seed Profile (Hanya insert jika masih kosong)
INSERT INTO profile (full_name, title, bio, avatar_url)
SELECT
  'Dian Maheru',
  'Full Stack Developer',
  'Passionate developer crafting clean, efficient, and user-friendly digital solutions. I specialize in modern web technologies including React, TypeScript, Node.js, and cloud backend architecture.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'
WHERE NOT EXISTS (SELECT 1 FROM profile);

-- Seed Projects
INSERT INTO projects (title, description, long_description, image_url, tech_stack, live_url, github_url, is_featured, sort_order)
SELECT
  'E-Commerce Platform',
  'Platform e-commerce modern dengan manajemen inventaris real-time, integrasi gateway pembayaran Stripe, dan dashboard analytics.',
  'Full-featured e-commerce solution with payment integration, admin dashboard, inventory tracking, and sales analytics.',
  'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
  ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
  'https://github.com/dianmaheru',
  'https://github.com/dianmaheru',
  true,
  0
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'E-Commerce Platform');

INSERT INTO projects (title, description, long_description, image_url, tech_stack, live_url, github_url, is_featured, sort_order)
SELECT
  'Task Management & Collaboration App',
  'Aplikasi manajemen tugas kolaboratif dengan sinkronisasi real-time, papan Kanban drag-and-drop, dan pelacakan produktivitas tim.',
  'Collaborative task management tool with real-time sync, drag-and-drop Kanban boards, team permissions, and productivity metrics.',
  'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80',
  ARRAY['TypeScript', 'React', 'Supabase', 'Tailwind CSS', 'Framer Motion'],
  'https://github.com/dianmaheru',
  'https://github.com/dianmaheru',
  true,
  1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Task Management & Collaboration App');

INSERT INTO projects (title, description, long_description, image_url, tech_stack, live_url, github_url, is_featured, sort_order)
SELECT
  'AI Chat Assistant Platform',
  'Asisten AI cerdas berbasis LLM dengan memori percakapan kontekstual, streaming response, dan integrasi API FastAPI.',
  'Intelligent chatbot platform powered by OpenAI GPT models with contextual memory, vector embeddings, and streaming responses.',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
  ARRAY['Python', 'FastAPI', 'React', 'OpenAI', 'PostgreSQL'],
  'https://github.com/dianmaheru',
  'https://github.com/dianmaheru',
  true,
  2
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'AI Chat Assistant Platform');

INSERT INTO projects (title, description, long_description, image_url, tech_stack, live_url, github_url, is_featured, sort_order)
SELECT
  'Modern CMS Portfolio Website',
  'Website portofolio interaktif dan modern yang terintegrasi dengan CMS Headless Supabase dan autentikasi admin panel.',
  'Interactive portfolio web application featuring headless Supabase CMS, role-based admin panel, and high performance animations.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  ARRAY['React 19', 'TypeScript', 'Supabase', 'Tailwind CSS v4', 'Vite'],
  'https://github.com/dianmaheru',
  'https://github.com/dianmaheru',
  false,
  3
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Modern CMS Portfolio Website');

-- Seed Experiences
INSERT INTO experiences (type, company, role, description, start_date, end_date, logo_url, sort_order)
SELECT
  'work',
  'Tech Startup Inc.',
  'Full Stack Developer',
  'Memimpin perancangan dan pengembangan fitur produk inti menggunakan React dan Node.js. Mengimplementasikan pipeline CI/CD otomatis, meningkatkan performa load aplikasi hingga 40%, serta membimbing 3 junior engineer.',
  '2023-06-01'::DATE,
  NULL,
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
  0
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE company = 'Tech Startup Inc.');

INSERT INTO experiences (type, company, role, description, start_date, end_date, logo_url, sort_order)
SELECT
  'work',
  'Digital Agency Nusantara',
  'Frontend Developer',
  'Mengembangkan aplikasi web interaktif dan responsif untuk klien korporat. Berkolaborasi aktif dengan desainer UI/UX untuk menciptakan antarmuka yang pixel-perfect dengan modern CSS dan arsitektur komponen React.',
  '2022-01-01'::DATE,
  '2023-05-31'::DATE,
  'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=120&q=80',
  1
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE company = 'Digital Agency Nusantara');

INSERT INTO experiences (type, company, role, description, start_date, end_date, logo_url, sort_order)
SELECT
  'organization',
  'Google Developer Student Clubs (GDSC)',
  'Core Team & Tech Lead',
  'Mengorganisir rangkaian workshop dan hackathon teknologi untuk lebih dari 300 peserta mahasiswa. Menjadi pembicara teknis mengenai Web Development Modern, React, dan Cloud Infrastructure.',
  '2021-08-01'::DATE,
  '2023-07-31'::DATE,
  'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=120&q=80',
  0
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE company = 'Google Developer Student Clubs (GDSC)');

INSERT INTO experiences (type, company, role, description, start_date, end_date, logo_url, sort_order)
SELECT
  'organization',
  'Himpunan Mahasiswa Informatika',
  'Ketua Divisi Riset & Teknologi',
  'Mengelola dan memelihara infrastruktur server serta website resmi organisasi. Memimpin kepanitiaan kompetisi pemrograman tahunan tingkat nasional.',
  '2020-09-01'::DATE,
  '2022-08-31'::DATE,
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80',
  1
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE company = 'Himpunan Mahasiswa Informatika');

-- Seed Social Links
INSERT INTO social_links (platform, url, sort_order)
SELECT 'github', 'https://github.com/dianmaheru', 0
WHERE NOT EXISTS (SELECT 1 FROM social_links WHERE platform = 'github');

INSERT INTO social_links (platform, url, sort_order)
SELECT 'email', 'mailto:dianmaheru@example.com', 1
WHERE NOT EXISTS (SELECT 1 FROM social_links WHERE platform = 'email');

INSERT INTO social_links (platform, url, sort_order)
SELECT 'linkedin', 'https://linkedin.com/in/dianmaheru', 2
WHERE NOT EXISTS (SELECT 1 FROM social_links WHERE platform = 'linkedin');

INSERT INTO social_links (platform, url, sort_order)
SELECT 'instagram', 'https://instagram.com/dianmaheru', 3
WHERE NOT EXISTS (SELECT 1 FROM social_links WHERE platform = 'instagram');
