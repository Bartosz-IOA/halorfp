import { createClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

// @supabase/supabase-js throws if URL or key are empty (empty string is invalid).
// When both are missing in dev, use the standard Supabase CLI defaults so the UI can load;
// point VITE_* at your hosted project (or run `supabase start`) for real auth/API.
const LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321';
const LOCAL_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const useLocalDefaults = import.meta.env.DEV && !envUrl && !envKey;
const supabaseUrl = envUrl || (useLocalDefaults ? LOCAL_SUPABASE_URL : '');
const supabaseAnonKey = envKey || (useLocalDefaults ? LOCAL_SUPABASE_ANON_KEY : '');

if (import.meta.env.DEV && useLocalDefaults) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY unset; using local CLI defaults. Add a .env with VITE_* for your project.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
