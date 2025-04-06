import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/db/database.types';

type RouteParams = {
  params: {
    categoryId: string;
  };
};

export async function GET(request: Request, { params }: RouteParams) {
  const { categoryId } = params;

  // Use public keys for this public GET route
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase public URL or Anon Key');
    return NextResponse.json({ error: 'Internal Server Error: Missing Supabase config' }, { status: 500 });
  }

  // Create client with public keys
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

  if (!categoryId) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }

  try {
    // Fetch topics for the given category, joining with users table to get creator's name
    // Also fetch the category name itself for context
    const { data, error } = await supabase
      .from('forum_topics')
      .select(`
        id,
        title,
        created_at,
        last_activity_at,
        author_id,
        users ( id, username ),
        forum_categories ( id, name )
      `)
      .eq('category_id', categoryId)
      .order('last_activity_at', { ascending: false }); // Show most recently active topics first

    if (error) {
      console.error(`Error fetching topics for category ${categoryId}:`, error);
      return NextResponse.json({ error: 'Failed to fetch topics', details: error.message }, { status: 500 });
    }

    // Optional: Check if the category exists (data might be empty if category is valid but has no topics)
    // If you need to return 404 specifically for non-existent categories, a separate query might be needed.

    // Format the response slightly for easier frontend use
    const formattedData = data?.map(topic => ({
      id: topic.id,
      title: topic.title,
      createdAt: topic.created_at,
      lastActivityAt: topic.last_activity_at,
      category: {
        // Ensure null safety for category relation
        id: topic.forum_categories?.id ?? null,
        name: topic.forum_categories?.name ?? null,
      },
      author: {
         // Ensure null safety for user relation and use username
        id: topic.users?.id ?? null,
        name: topic.users?.username ?? 'Unknown User', // Use username as the primary display name
      }
    }));

    return NextResponse.json(formattedData || []);

  } catch (err) {
    console.error(`Unexpected error fetching topics for category ${categoryId}:`, err);
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  const { categoryId } = params;

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookies() }
  );

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Your session has expired or you are not logged in. Please log in and try again.'
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, tags } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing title or content' }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const { data, error } = await supabase
      .from('forum_topics')
      .insert([
        {
          title,
          slug,
          content,
          category_id: categoryId,
          author_id: userId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating topic:', error);
      return NextResponse.json(
        { error: 'Failed to create topic', details: error.message, supabaseError: error },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Unexpected error creating topic:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
