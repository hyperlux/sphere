import { NextResponse, NextRequest } from 'next/server';
import { Database } from '@/lib/db/database.types';
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { getUserProfile } from '@/lib/auth/getUserProfile';

type RouteParams = {
  params: {
    topicId: string;
  };
};

const DEFAULT_PAGE_LIMIT = 20; // Number of posts per page

// GET /api/forum/topics/[topicId]/posts?page=1&limit=20
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { topicId } = params;

  const supabase = getSupabaseServerClient(request);

  // Get pagination parameters from query string
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || `${DEFAULT_PAGE_LIMIT}`, 10);
  const offset = (page - 1) * limit;

  if (!topicId) {
    return NextResponse.json({ error: 'Topic ID is required' }, { status: 400 });
  }
  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });
  }
   if (isNaN(limit) || limit < 1 || limit > 100) { // Add a max limit
    return NextResponse.json({ error: `Invalid limit value (must be 1-${100})` }, { status: 400 });
  }

  try {
    // Fetch posts for the given topic, joining with users table to get author's username
    // Also fetch the total count for pagination calculation
    const { data, error, count } = await supabase
      .from('forum_posts')
      .select(`
        id,
        content,
        created_at,
        updated_at,
        parent_post_id,
        author_id,
        author:profiles ( id, username, avatar_url )
      `, { count: 'exact' }) // Request total count
      .eq('topic_id', topicId)
      .order('created_at', { ascending: true }) // Show oldest posts first
      .range(offset, offset + limit - 1); // Apply pagination range

    if (error) {
      console.error(`Error fetching posts for topic ${topicId}:`, error);
      return NextResponse.json({ error: 'Failed to fetch posts', details: error.message }, { status: 500 });
    }

    // Format the response
    const formattedData = data?.map(post => ({
      id: post.id,
      content: post.content,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      parentPostId: post.parent_post_id,
      author: {
        id: post.author?.id ?? null,
        username: post.author?.username ?? 'Unknown User',
        avatarUrl: post.author?.avatar_url ?? null,
      }
      // TODO: Add vote counts later if needed by joining/querying forum_votes
    }));

    const totalPages = Math.ceil((count ?? 0) / limit);

    return NextResponse.json({
      posts: formattedData || [],
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalPosts: count ?? 0,
        totalPages: totalPages,
      }
    });

  } catch (err) {
    console.error(`Unexpected error fetching posts for topic ${topicId}:`, err);
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}


  
// POST /api/forum/topics/[topicId]/posts
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { topicId } = params;

  const supabase = getSupabaseServerClient(request);

  const userProfile = await getUserProfile(supabase);

  if (!userProfile) {
    return NextResponse.json(
      { error: 'Unauthorized or user profile not found' },
      { status: 401 }
    );
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid request body: Must be JSON' }, { status: 400 });
    }

    const { content, parentPostId } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Post content is required' }, { status: 400 });
    }
    if (parentPostId && typeof parentPostId !== 'string') {
      return NextResponse.json({ error: 'Invalid parentPostId' }, { status: 400 });
    }

    const { data: newPost, error: postError } = await supabase
      .from('forum_posts')
      .insert({
        content: content.trim(),
        topic_id: topicId,
        author_id: userProfile.id,
        parent_post_id: parentPostId || null,
      })
      .select(
        `
        id,
        content,
        created_at,
        updated_at,
        parent_post_id,
        author_id,
        author:users ( id, username, avatar_url )
      `
      )
      .single();

    if (postError) {
      console.error(`Error creating post in topic ${topicId}:`, postError);
      if (postError.code === '23503') {
        return NextResponse.json({ error: 'Invalid Topic ID or Author ID', details: postError.message }, { status: 400 });
      }
      return NextResponse.json({ error: 'Failed to create post', details: postError.message }, { status: 500 });
    }

    if (!newPost) {
      return NextResponse.json({ error: 'Failed to create post: No data returned' }, { status: 500 });
    }

    const formattedPost = {
      id: newPost.id,
      content: newPost.content,
      createdAt: newPost.created_at,
      updatedAt: newPost.updated_at,
      parentPostId: newPost.parent_post_id,
      author: {
        id: newPost.author?.id ?? null,
        username: newPost.author?.username ?? 'Unknown User',
        avatarUrl: newPost.author?.avatar_url ?? null,
      },
    };

    return NextResponse.json(formattedPost, { status: 201 });
  } catch (err) {
    console.error(`Unexpected error creating post in topic ${topicId}:`, err);
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
