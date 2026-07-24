import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://jlxyisjrqebcmbsihjdb.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_52aGLulyDO9WhkcdTUhkww_uTqgljEt';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
