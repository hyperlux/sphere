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

  // Attempt to fetch the profile
  // @ts-ignore: TypeScript doesn't recognize the 'profiles' table
  let { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id') // Select only the ID, or '*' if you need more fields immediately
    .eq('id', user.id)
    .maybeSingle(); // Use maybeSingle to return null instead of error if 0 rows

  // Handle potential fetch error (excluding the 0 rows case handled by maybeSingle)
  if (profileError) {
    console.error(`getUserProfile: Error fetching profile for user ID ${user.id}. Error:`, profileError);
    return null;
  }

  // If profile doesn't exist, attempt to create it
  if (!profile) {
    console.log(`getUserProfile: Profile not found for user ID ${user.id}. Attempting to create.`);

    // Step 1: Attempt to insert the profile
    let insertError: any | null = null;
    let initialUsername = user.email || `user_${user.id.substring(0, 8)}`;

    // Try initial insert
    // @ts-ignore: TypeScript doesn't recognize the 'profiles' table
    ({ error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username: initialUsername,
        // Ensure all NOT NULL columns without defaults are handled here if any
      }));

    // Handle unique username conflict (23505)
    if (insertError && insertError.code === '23505' && insertError.message.includes('profiles_username_key')) {
      console.warn(`getUserProfile: Username conflict for '${initialUsername}'. Retrying with modified username.`);
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const fallbackUsername = `${initialUsername.split('@')[0]}_${randomSuffix}`; // More likely unique

      // Retry insert with fallback username
      // @ts-ignore: TypeScript doesn't recognize the 'profiles' table
      ({ error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: fallbackUsername,
        }));
    }

    // Handle any persistent insert error (original or after retry)
    if (insertError) {
      console.error(`getUserProfile: Failed to insert profile for user ID ${user.id} after potential retry. Error:`, insertError);
      return null; // Stop if insert failed
    }

    console.log(`getUserProfile: Insert successful for user ID ${user.id}. Re-fetching profile.`);

    // Step 2: Re-fetch the profile now that it should exist
    // @ts-ignore: TypeScript doesn't recognize the 'profiles' table
    const { data: fetchedProfile, error: fetchAfterInsertError } = await supabase
      .from('profiles')
      .select('id') // Select the required fields
      .eq('id', user.id)
      .single(); // Use single() now, as it MUST exist after successful insert

    // Handle re-fetch error
    if (fetchAfterInsertError || !fetchedProfile) {
      console.error(`getUserProfile: Error fetching profile immediately after insert for user ID ${user.id}. Error:`, fetchAfterInsertError);
      // This case is problematic - insert succeeded but fetch failed?
      return null;
    }

    console.log(`getUserProfile: Successfully created and fetched profile for user ID ${user.id}. Profile ID: ${fetchedProfile.id}`);
    profile = fetchedProfile; // Assign the newly fetched profile
  }

  return profile as UserProfile;
}
