import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Client for browser/client-side operations
export const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Function to create a server-side client instance when needed
// This delays reading ENV vars until the function is called
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL environment variable for server client');
  }
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable for server client');
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey);
}


// Utility function to handle potential missing environment variables (can be kept for reference or other uses)
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
