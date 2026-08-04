import { createClient } from '@supabase/supabase-js'

var supabaseUrl = import.meta.env.VITE_SUPABASE_URL
var supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
}

export var supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'public' },
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
})
