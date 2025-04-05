import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // Import base client
import { Database } from '@/lib/db/database.types';

export async function GET() {
  // Use public keys for this public GET route
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase public URL or Anon Key');
    return NextResponse.json({ error: 'Internal Server Error: Missing Supabase config' }, { status: 500 });
  }

  // Create client with public keys
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

  try {
    const { data: categories, error } = await supabase
      .from('forum_categories')
      .select('id, name, description, icon') // Select the columns needed for display
      .order('name', { ascending: true }); // Order alphabetically by name

    if (error) {
      console.error('Error fetching forum categories:', error);
      return NextResponse.json({ error: 'Failed to fetch categories', details: error.message }, { status: 500 });
    }

    return NextResponse.json(categories);

  } catch (err) {
    console.error('Unexpected error fetching forum categories:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
