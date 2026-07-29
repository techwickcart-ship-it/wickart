import { createClient } from '@supabase/supabase-js';

export function getSupabaseCredentials() {
  const url =
    (import.meta as any).env?.VITE_SUPABASE_URL ||
    (import.meta as any).env?.VITE_DB_URL ||
    localStorage.getItem('wikcart_supabase_url') ||
    'https://jlxyisjrqebcmbsihjdb.supabase.co';

  const anonKey =
    (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
    (import.meta as any).env?.VITE_DB_ANON_KEY ||
    localStorage.getItem('wikcart_supabase_anon_key') ||
    'sb_publishable_52aGLulyDO9WhkcdTUhkww_uTqgljEt';

  return { url, anonKey };
}

const { url: initialUrl, anonKey: initialKey } = getSupabaseCredentials();

export let supabase = createClient(initialUrl, initialKey);

export function reinitSupabaseClient(customUrl?: string, customAnonKey?: string) {
  if (customUrl !== undefined) {
    localStorage.setItem('wikcart_supabase_url', customUrl);
  }
  if (customAnonKey !== undefined) {
    localStorage.setItem('wikcart_supabase_anon_key', customAnonKey);
  }

  const { url, anonKey } = getSupabaseCredentials();
  supabase = createClient(url, anonKey);
  return supabase;
}

