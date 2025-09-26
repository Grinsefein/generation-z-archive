import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Term {
  id: string;
  title: string;
  icon: string;
  category: string;
  definition: string;
  origin: string;
  examples: string[];
  related_terms: string[];
  popularity_data: number[];
  created_at: string;
  updated_at: string;
  status: 'published' | 'pending' | 'rejected';
  submitted_by?: string;
}

export interface Contribution {
  id: string;
  title: string;
  icon: string;
  category: string;
  definition: string;
  origin: string;
  examples: string[];
  related_terms: string[];
  submitted_by: string;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
  moderator_notes?: string;
}
