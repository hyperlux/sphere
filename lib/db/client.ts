import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Client for browser/client-side operations
export const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server-side client for API routes and server-side rendering
export const supabaseServerClient = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Utility function to handle potential missing environment variables
function validateSupabaseEnv() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }
  if (!process.env.SUPABASE_URL) {
    throw new Error('Missing SUPABASE_URL environment variable')
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }
  // We might still want validation, but perhaps called explicitly elsewhere
  // or rely on Supabase client errors.
}

// Remove the top-level validation call to avoid issues during build
// validateSupabaseEnv()
