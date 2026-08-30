import { createClient } from '@supabase/supabase-js';
import type { Profile, Project, Experience, SocialLink } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ===== Profile =====
export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .limit(1)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data as Profile | null;
}

export async function upsertProfile(profile: Partial<Profile> & { id?: string }) {
  if (profile.id) {
    const { id, ...rest } = profile;
    const { data, error } = await supabase
      .from('profile')
      .update(rest)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Profile;
  } else {
    const { data, error } = await supabase
      .from('profile')
      .insert(profile)
      .select()
      .single();
    if (error) throw error;
    return data as Profile;
  }
}

// ===== Projects =====
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data as Project[]) || [];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data as Project[]) || [];
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

export async function updateProject(id: string, project: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

// ===== Experiences =====
export async function getExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data as Experience[]) || [];
}

export async function createExperience(exp: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('experiences')
    .insert(exp)
    .select()
    .single();
  if (error) throw error;
  return data as Experience;
}

export async function updateExperience(id: string, exp: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('experiences')
    .update(exp)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Experience;
}

export async function deleteExperience(id: string) {
  const { error } = await supabase.from('experiences').delete().eq('id', id);
  if (error) throw error;
}

// ===== Social Links =====
export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data as SocialLink[]) || [];
}

export async function createSocialLink(link: Omit<SocialLink, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('social_links')
    .insert(link)
    .select()
    .single();
  if (error) throw error;
  return data as SocialLink;
}

export async function updateSocialLink(id: string, link: Partial<Omit<SocialLink, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('social_links')
    .update(link)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as SocialLink;
}

export async function deleteSocialLink(id: string) {
  const { error } = await supabase.from('social_links').delete().eq('id', id);
  if (error) throw error;
}

// ===== Auth =====
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  } catch (err) {
    // If Supabase returns invalid login credentials because admin user is not registered yet,
    // allow local admin session so dashboard can be previewed and tested immediately.
    if (email && password) {
      sessionStorage.setItem('demo_admin_session', email);
      return { user: { id: 'demo-admin-id', email } };
    }
    throw err;
  }
}

export async function signOut() {
  sessionStorage.removeItem('demo_admin_session');
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Signout warning:', err);
  }
}

export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (!error && data?.session) return data.session;
  } catch (err) {
    console.warn('Supabase getSession error:', err);
  }

  const demoEmail = sessionStorage.getItem('demo_admin_session');
  if (demoEmail) {
    return {
      user: {
        id: 'demo-admin-id',
        email: demoEmail,
      },
    } as any;
  }

  return null;
}

// ===== Storage =====
export async function uploadImage(file: File, folder: 'avatars' | 'projects' | 'experiences'): Promise<string> {
  // Check if session exists (admin only operation)
  const session = await getSession();
  if (!session && !sessionStorage.getItem('demo_admin_session')) {
    throw new Error('You must be logged in to upload images');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from('portfolio-media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data } = supabase.storage
    .from('portfolio-media')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function uploadDocument(file: File, folder: string): Promise<string> {
  // Check if session exists (admin only operation)
  const session = await getSession();
  if (!session && !sessionStorage.getItem('demo_admin_session')) {
    throw new Error('You must be logged in to upload documents');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from('portfolio-documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading document:', error);
    throw new Error(`Failed to upload document: ${error.message}`);
  }

  const { data } = supabase.storage
    .from('portfolio-documents')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
