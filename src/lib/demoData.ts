import type { Profile, Project, Experience, SocialLink } from '../types/database';

// Demo data used when Supabase is not configured yet
export const demoProfile: Profile = {
  id: 'demo',
  full_name: 'Dian Maheru',
  title: 'Full Stack Developer',
  bio: 'Passionate developer crafting clean, efficient, and user-friendly digital solutions. I specialize in modern web technologies including React, TypeScript, Node.js, and cloud backend architecture.',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
  resume_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const demoProjects: Project[] = [
  {
    id: 'demo-1',
    title: 'E-Commerce Platform',
    category: 'WEB APP',
    year: '2024',
    role: 'Full Stack Developer',
    description: 'Platform e-commerce modern dengan manajemen inventaris real-time, integrasi gateway pembayaran Stripe, dan dashboard analytics.',
    long_description: 'Full-featured e-commerce solution with payment integration, admin dashboard, inventory tracking, and sales analytics. This project was built from scratch to handle high volume traffic and complex state management across multiple user roles.',
    key_contributions: [
      'Merancang arsitektur database PostgreSQL dan implementasi API menggunakan Node.js',
      'Mengintegrasikan Stripe payment gateway untuk transaksi yang aman',
      'Membangun dashboard admin interaktif dengan chart dan visualisasi data real-time'
    ],
    image_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
    ],
    tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    live_url: 'https://github.com/dianmaheru',
    github_url: 'https://github.com/dianmaheru',
    is_featured: true,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Task Management App',
    category: 'WEB APP',
    year: '2023',
    role: 'Frontend Engineer',
    description: 'Aplikasi manajemen tugas kolaboratif dengan sinkronisasi real-time, papan Kanban drag-and-drop, dan pelacakan produktivitas tim.',
    long_description: 'Collaborative task management tool with real-time sync, drag-and-drop Kanban boards, team permissions, and productivity metrics. Designed to help remote teams coordinate seamlessly.',
    key_contributions: [
      'Mengimplementasikan fitur drag-and-drop Kanban board yang sangat responsif',
      'Membuat sistem real-time sync menggunakan Supabase Realtime',
      'Merancang UI komponen yang reusable dengan Tailwind CSS'
    ],
    image_url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80'
    ],
    tech_stack: ['TypeScript', 'React', 'Supabase', 'Tailwind CSS', 'Framer Motion'],
    live_url: 'https://github.com/dianmaheru',
    github_url: 'https://github.com/dianmaheru',
    is_featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    title: 'AI Chat Assistant Platform',
    category: 'AI PROJECT',
    year: '2023',
    role: 'Backend Engineer',
    description: 'Asisten AI cerdas berbasis LLM dengan memori percakapan kontekstual, streaming response, dan integrasi API FastAPI.',
    long_description: 'Intelligent chatbot platform powered by OpenAI GPT models with contextual memory, vector embeddings, and streaming responses for a seamless conversational experience.',
    key_contributions: [
      'Membangun API Backend berkinerja tinggi menggunakan FastAPI',
      'Mengelola integrasi model LLM OpenAI dengan prompt engineering khusus',
      'Mengoptimalkan latensi response dengan mekanisme chunk streaming'
    ],
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    gallery_urls: [],
    tech_stack: ['Python', 'FastAPI', 'React', 'OpenAI', 'PostgreSQL'],
    live_url: 'https://github.com/dianmaheru',
    github_url: 'https://github.com/dianmaheru',
    is_featured: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    title: 'Modern CMS Portfolio Website',
    category: 'WEB APP',
    year: '2024',
    role: 'Solo Developer',
    description: 'Website portofolio interaktif dan modern yang terintegrasi dengan CMS Headless Supabase dan autentikasi admin panel.',
    long_description: 'Interactive portfolio web application featuring headless Supabase CMS, role-based admin panel, and high performance animations tailored for visual impact.',
    key_contributions: [
      'Mendesain UI/UX dengan pendekatan Glassmorphism dan gaya modern',
      'Mengembangkan Admin Panel untuk manajemen konten tanpa coding',
      'Membuat transisi animasi kompleks menggunakan Framer Motion'
    ],
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
    ],
    tech_stack: ['React 19', 'TypeScript', 'Supabase', 'Tailwind CSS v4', 'Vite'],
    live_url: 'https://github.com/dianmaheru',
    github_url: 'https://github.com/dianmaheru',
    is_featured: false,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const demoExperiences: Experience[] = [
  {
    id: 'demo-w1',
    type: 'work',
    company: 'Tech Startup Inc.',
    role: 'Full Stack Developer',
    description: 'Memimpin perancangan dan pengembangan fitur produk inti menggunakan React dan Node.js. Mengimplementasikan pipeline CI/CD otomatis, meningkatkan performa load aplikasi hingga 40%, serta membimbing 3 junior engineer.',
    start_date: '2023-06-01',
    end_date: null,
    logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-w2',
    type: 'work',
    company: 'Digital Agency Nusantara',
    role: 'Frontend Developer',
    description: 'Mengembangkan aplikasi web interaktif dan responsif untuk klien korporat. Berkolaborasi aktif dengan desainer UI/UX untuk menciptakan antarmuka yang pixel-perfect dengan modern CSS dan arsitektur komponen React.',
    start_date: '2022-01-01',
    end_date: '2023-05-31',
    logo_url: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=120&q=80',
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-o1',
    type: 'organization',
    company: 'Google Developer Student Clubs (GDSC)',
    role: 'Core Team & Tech Lead',
    description: 'Mengorganisir rangkaian workshop dan hackathon teknologi untuk lebih dari 300 peserta mahasiswa. Menjadi pembicara teknis mengenai Web Development Modern, React, dan Cloud Infrastructure.',
    start_date: '2021-08-01',
    end_date: '2023-07-31',
    logo_url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=120&q=80',
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-o2',
    type: 'organization',
    company: 'Himpunan Mahasiswa Informatika',
    role: 'Ketua Divisi Riset & Teknologi',
    description: 'Mengelola dan memelihara infrastruktur server serta website resmi organisasi. Memimpin kepanitiaan kompetisi pemrograman tahunan tingkat nasional.',
    start_date: '2020-09-01',
    end_date: '2022-08-31',
    logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80',
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const demoSocialLinks: SocialLink[] = [
  {
    id: 'demo-s1',
    platform: 'github',
    url: 'https://github.com/dianmaheru',
    sort_order: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-s2',
    platform: 'email',
    url: 'mailto:dianmaheru@example.com',
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-s3',
    platform: 'linkedin',
    url: 'https://linkedin.com/in/dianmaheru',
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-s4',
    platform: 'instagram',
    url: 'https://instagram.com/dianmaheru',
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
];

export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return Boolean(url && url !== 'https://placeholder.supabase.co' && !url.includes('placeholder'));
}
