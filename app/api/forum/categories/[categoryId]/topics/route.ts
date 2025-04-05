import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/db/client'; // Import the function
import { Database } from '@/lib/db/database.types';

type RouteParams = {
  params: {
    categoryId: string;
  };
};

// GET /api/forum/categories/[categoryId]/topics
export async function GET(request: Request, { params }: RouteParams) {
  const { categoryId } = params;
  // Create the server client instance inside the handler
  const supabase = createServerSupabaseClient();

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
