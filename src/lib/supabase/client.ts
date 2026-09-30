import { createBrowserClient } from '@supabase/ssr';

const DEFAULT_SUPABASE_URL = 'https://koeralhhdpolsqioefqs.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_Ehpmy_9f1ikvqLNmUbOffg_TQSUmueR';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createBrowserClient(url, key);
}
