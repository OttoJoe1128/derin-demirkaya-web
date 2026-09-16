import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy client initialization to prevent crashes when environment variables are not yet provided
let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key || url.includes('your-project-ref') || key.includes('your-supabase-anon-key')) {
    return null;
  }

  if (typeof window === 'undefined') {
    // Server-side
    return createClient(url, key);
  }

  // Client-side singleton
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        },
      });
    } catch (err) {
      console.warn('Supabase initialization error:', err);
    }
  }

  return supabaseInstance;
}

export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    key &&
    !url.includes('your-project-ref') &&
    !key.includes('your-supabase-anon-key')
  );
};

// Direct export for standard usage
export const supabase = getSupabase();
