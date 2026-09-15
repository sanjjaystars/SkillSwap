import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jjkoshqmyokdnguffpyc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqa29zaHFteW9rZG5ndWZmcHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODYwNTUsImV4cCI6MjA4ODU2MjA1NX0.l6lBYcAzsjFdKoj8skHcCimYmb1jjeI-niy9WoTqCZA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
