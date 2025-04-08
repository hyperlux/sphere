import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/db/database.types';

/**
 * Creates a Supabase client configured with the user's JWT if available.
 * Supports extracting JWT from Authorization header or cookies.
 */
export function getSupabaseServerClient(req: Request): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  let accessToken: string | null = null;

  // Extract JWT from Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    accessToken = authHeader.slice(7);
  }

  // Fallback: try to extract from cookies (e.g., 'sb-access-token')
  if (!accessToken) {
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/sb-access-token=([^;]+)/);
      if (match) {
        accessToken = decodeURIComponent(match[1]);
      }
    }
  }

  const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return client;
}
