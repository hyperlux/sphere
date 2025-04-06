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
