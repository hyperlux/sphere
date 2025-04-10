import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/db/database.types';

export interface UserProfile {
  id: string;
  // Add other fields if needed
}

/**
 * Fetches the current authenticated user's internal profile.
 * Returns null if not authenticated or profile not found.
 */
export async function getUserProfile(
  supabase: SupabaseClient<Database>
): Promise<UserProfile | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  return profile;
}
