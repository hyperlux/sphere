import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/db/database.types';

/**
 * Creates a Supabase client configured with the user's JWT if available.
 * Supports extracting JWT from Authorization header or cookies.
 */
export function getSupabaseServerClient(req: Request): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  let accessToken: string | null = null;

  // Extract JWT from Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    accessToken = authHeader.slice(7);
  }

  // Fallback: try to extract from cookies (e.g., 'sb-access-token' or 'sb-<project-ref>')
  if (!accessToken) {
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      // Try sb-access-token first
      let match = cookieHeader.match(/sb-access-token=([^;]+)/);
      if (match) {
        accessToken = decodeURIComponent(match[1]);
      } else {
        // Try sb-<project-ref>
        const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('https://')[1]?.split('.')[0];
        if (projectRef) {
          const projectCookieName = `sb-${projectRef}`;
          match = cookieHeader.match(new RegExp(`${projectCookieName}=([^;]+)`));
          if (match) {
            accessToken = decodeURIComponent(match[1]);
          }
        }
      }
    }
  }

  const client = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
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
