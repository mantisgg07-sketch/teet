import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Use sessionStorage in browser so each tab has its own session (logout in one tab does not log out others)
const authOptions = typeof window !== 'undefined' && window.sessionStorage
  ? { auth: { storage: window.sessionStorage } }
  : {}

// Create a dummy client if environment variables are not set
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, authOptions)
  : null
