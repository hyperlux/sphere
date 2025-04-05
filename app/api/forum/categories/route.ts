import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/db/client'; // Import the function
import { Database } from '@/lib/db/database.types'; // Import the generated types

export async function GET() {
  // Create the server client instance inside the handler
  const supabase = createServerSupabaseClient();

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
