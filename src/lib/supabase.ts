import { createClient } from '@supabase/supabase-js';

// We fall back to empty strings to prevent the app from crashing on boot 
// before the environment variables are properly set in Vercel/local.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
