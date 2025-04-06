import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/db/database.types';
// Removed next-auth imports as they are not used currently

// Helper function to generate a URL-friendly slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters (excluding spaces and hyphens)
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Helper function to get Supabase client with service role key
const getSupabaseAdminClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase Admin URL or Service Role Key');
    throw new Error('Internal Server Error: Missing Supabase admin config');
  }
  return createClient<Database>(supabaseUrl, supabaseServiceKey);
};


export async function GET(request: NextRequest) {
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

// POST handler to create a new category
export async function POST(request: NextRequest) {
  // TODO: Add proper authorization check later if needed (e.g., check if user is admin)

  try {
    const supabase = getSupabaseAdminClient();
    const body = await request.json();

    const { name, description, icon } = body;

    // Basic validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }
    if (description && typeof description !== 'string') {
        return NextResponse.json({ error: 'Description must be a string' }, { status: 400 });
    }
    if (icon && typeof icon !== 'string') {
        return NextResponse.json({ error: 'Icon must be a string' }, { status: 400 });
    }

    const slug = generateSlug(name.trim());

    const { data: newCategory, error } = await supabase
      .from('forum_categories')
      .insert({
        name: name.trim(),
        slug: slug, // Add the generated slug
        description: description?.trim() || null, // Ensure null if empty
        icon: icon?.trim() || null, // Ensure null if empty
        // created_by: userId // TODO: Add user ID if tracking creators and auth is implemented
      })
      .select('id, name, description, icon, slug') // Return the created category including slug
      .single(); // Expecting a single row back

    if (error) {
      console.error('Error creating forum category:', error);
      // Handle potential unique constraint violation (e.g., duplicate name)
      if (error.code === '23505') { // PostgreSQL unique violation code
          return NextResponse.json({ error: 'A category with this name already exists.', details: error.message }, { status: 409 }); // 409 Conflict
      }
      return NextResponse.json({ error: 'Failed to create category', details: error.message }, { status: 500 });
    }

    if (!newCategory) {
        return NextResponse.json({ error: 'Failed to create category: No data returned' }, { status: 500 });
    }

    return NextResponse.json(newCategory, { status: 201 }); // 201 Created

  } catch (err) {
    console.error('Unexpected error creating forum category:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    // Handle specific errors like missing admin config
    if (errorMessage.includes('Missing Supabase admin config')) {
        return NextResponse.json({ error: 'Internal Server Error: Configuration issue' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
