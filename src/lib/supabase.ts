import { createClient } from '@supabase/supabase-js';

export const PRIMARY_SUPABASE_URL = 'https://uklbaemzjopcchmjtqko.supabase.co';
export const PRIMARY_SUPABASE_ANON_KEY = 'sb_publishable_Pf8ZACL6n_5ZsiaYua_BAg_h9uQFiKj';

export function getSupabaseCredentials() {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || (import.meta as any).env?.VITE_DB_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_DB_ANON_KEY;

  let storedUrl = localStorage.getItem('wikcart_supabase_url');
  let storedKey = localStorage.getItem('wikcart_supabase_anon_key');

  // Purge any stale/legacy stored credentials if they don't match our active project credentials
  if (storedUrl && storedUrl !== PRIMARY_SUPABASE_URL) {
    localStorage.removeItem('wikcart_supabase_url');
    storedUrl = null;
  }
  if (storedKey && storedKey !== PRIMARY_SUPABASE_ANON_KEY) {
    localStorage.removeItem('wikcart_supabase_anon_key');
    storedKey = null;
  }

  const url = envUrl || storedUrl || PRIMARY_SUPABASE_URL;
  const anonKey = envKey || storedKey || PRIMARY_SUPABASE_ANON_KEY;

  return { url, anonKey };
}

const { url: initialUrl, anonKey: initialKey } = getSupabaseCredentials();

export let supabase = createClient(initialUrl, initialKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export function reinitSupabaseClient(customUrl?: string, customAnonKey?: string) {
  if (customUrl) {
    localStorage.setItem('wikcart_supabase_url', customUrl);
  } else {
    localStorage.removeItem('wikcart_supabase_url');
  }
  if (customAnonKey) {
    localStorage.setItem('wikcart_supabase_anon_key', customAnonKey);
  } else {
    localStorage.removeItem('wikcart_supabase_anon_key');
  }

  const { url, anonKey } = getSupabaseCredentials();
  supabase = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });
  return supabase;
}

export function clearSupabaseCache() {
  localStorage.removeItem('wikcart_supabase_url');
  localStorage.removeItem('wikcart_supabase_anon_key');
  return reinitSupabaseClient(PRIMARY_SUPABASE_URL, PRIMARY_SUPABASE_ANON_KEY);
}


