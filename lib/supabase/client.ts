'use client'; // Mark this module for client-side use if needed, though utils are often fine

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/lib/db/database.types'; // Assuming your types are here

// Function to create a Supabase client for use in Client Components
export function createClientComponentClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Function to create a Supabase client with a JWT access token attached
export function createClientComponentClientWithToken(token: string) {
  const client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  client.auth.setSession({ access_token: token, refresh_token: '' });
  return client;
}
