import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://kquqmdrkvjwsrgojqwyz.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_uWuHg7Yk8ixHeww3O5bDOw_e7Wqkt0g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
