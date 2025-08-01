import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase_url') || supabaseAnonKey.includes('your_supabase_anon_key')) {
  console.warn('Supabase credentials are missing or using placeholder values. Some features may not work.');
  // Create a mock client for development
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: new Error('Supabase not configured') }),
      insert: () => ({ data: null, error: new Error('Supabase not configured') }),
      update: () => ({ data: null, error: new Error('Supabase not configured') }),
      delete: () => ({ data: null, error: new Error('Supabase not configured') }),
      upsert: () => ({ data: null, error: new Error('Supabase not configured') }),
      maybeSingle: () => ({ data: null, error: new Error('Supabase not configured') }),
      single: () => ({ data: null, error: new Error('Supabase not configured') }),
      eq: function() { return this; },
      gte: function() { return this; },
      lte: function() { return this; },
      order: function() { return this; },
      limit: function() { return this; },
    }),
    rpc: () => ({ data: null, error: new Error('Supabase not configured') }),
    auth: {
      getUser: () => ({ data: { user: null }, error: null }),
      signInWithPassword: () => ({ data: null, error: new Error('Supabase not configured') }),
      signUp: () => ({ data: null, error: new Error('Supabase not configured') }),
      signOut: () => ({ error: null }),
      getSession: () => ({ data: { session: null }, error: null }),
    }
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };