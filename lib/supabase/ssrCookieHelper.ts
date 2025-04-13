import { cookies } from 'next/headers';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { Database } from '@/lib/db/database.types';

/**
 * Creates a Supabase client instance configured for server-side rendering (SSR)
 * contexts like Route Handlers, Server Components, and Server Actions in Next.js.
 * It uses the `cookies()` function from `next/headers` to manage authentication tokens.
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key environment variables.');
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
          console.warn(`Failed to set cookie '${name}' from Server Component/Route Handler. Middleware should handle session refresh.`);
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
           console.warn(`Failed to remove cookie '${name}' from Server Component/Route Handler. Middleware should handle session refresh.`);
        }
      },
    },
  });
}