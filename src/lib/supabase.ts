import { createClient } from '@supabase/supabase-js';

const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';
const isDemoMode = typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEMO_MODE === 'true';

// Only consider configured if a valid custom URL and key are provided and not demo mode
const isValidUrl = (url: string) => {
  if (!url) return false;
  if (url.includes('your-supabase-project') || url.includes('placeholder')) return false;
  return url.startsWith('https://');
};

const isTestMode = (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') || (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test');

export const isSupabaseConfigured = Boolean(isValidUrl(envUrl) && envKey && !isDemoMode && !isTestMode);

// Safe fallback URL for dummy client initialization
const ACTIVE_URL = isSupabaseConfigured ? envUrl : 'https://placeholder-saad-clinic.supabase.co';
const ACTIVE_KEY = isSupabaseConfigured ? envKey : 'placeholder-anon-key';

export const supabase = createClient(ACTIVE_URL, ACTIVE_KEY, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: isSupabaseConfigured,
  },
});
