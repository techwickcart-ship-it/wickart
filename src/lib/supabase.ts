import { createClient } from '@supabase/supabase-js';

export const PRIMARY_SUPABASE_URL = 'https://uklbaemzjopcchmjtqko.supabase.co';
export const PRIMARY_SUPABASE_ANON_KEY = 'sb_publishable_Pf8ZACL6n_5ZsiaYua_BAg_h9uQFiKj';

export function getSupabaseCredentials() {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || (import.meta as any).env?.VITE_DB_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_DB_ANON_KEY;

  let storedUrl = localStorage.getItem('wikcart_supabase_url');
  let storedKey = localStorage.getItem('wikcart_supabase_anon_key');

  // Purge/override stale legacy credentials if present in localStorage
  if (storedUrl === 'https://jlxyisjrqebcmbsihjdb.supabase.co') {
    localStorage.removeItem('wikcart_supabase_url');
    storedUrl = null;
  }
  if (storedKey === 'sb_publishable_52aGLulyDO9WhkcdTUhkww_uTqgljEt') {
    localStorage.removeItem('wikcart_supabase_anon_key');
    storedKey = null;
  }

  const url = envUrl || storedUrl || PRIMARY_SUPABASE_URL;
  const anonKey = envKey || storedKey || PRIMARY_SUPABASE_ANON_KEY;

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

