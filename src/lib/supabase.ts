import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Entry = {
  id: string;
  user_id: string;
  raw_text: string;
  tags: string[];
  severity: number;
  body_area: string | null;
  flagged: boolean;
  created_at: string;
};

export type NewEntry = {
  raw_text: string;
  tags?: string[];
  severity?: number;
  body_area?: string | null;
  flagged?: boolean;
};
