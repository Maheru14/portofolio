export interface Profile {
  id: string;
  full_name: string;
  title: string;
  bio: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  category: string | null;
  year: string | null;
  role: string | null;
  description: string | null;
  long_description: string | null;
  key_contributions: string[];
  image_url: string | null;
  gallery_urls: string[];
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  type: 'work' | 'organization';
  company: string;
  role: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  logo_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  sort_order: number;
  created_at: string;
}

// Supabase database type mapping
export interface Database {
  public: {
    Tables: {
      profile: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>;
      };
      experiences: {
        Row: Experience;
        Insert: Omit<Experience, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>;
      };
      social_links: {
        Row: SocialLink;
        Insert: Omit<SocialLink, 'id' | 'created_at'>;
        Update: Partial<Omit<SocialLink, 'id' | 'created_at'>>;
      };
    };
  };
}
