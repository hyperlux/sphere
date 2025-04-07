import { NextResponse, NextRequest } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/lib/db/database.types';

type RouteParams = {
  params: {
    topicId: string;
  };
};

const DEFAULT_PAGE_LIMIT = 20; // Number of posts per page

// GET /api/forum/topics/[topicId]/posts?page=1&limit=20
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { topicId } = params;
  // Use the non-authenticating client for public reads
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookies().get(name)?.value } } // Minimal cookie config for anon client
  );


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
        author:users ( id, username, avatar_url )
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
    const cookieStore = cookies();

    // Create authenticated client
    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try { cookieStore.set({ name, value, ...options }); } catch (e) { console.error(e); }
                },
                remove(name: string, options: CookieOptions) {
                    try { cookieStore.set({ name, value: '', ...options }); } catch (e) { console.error(e); }
                },
            },
        }
    );

    try {
        // 1. Get User Session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        // Fetch the public.users profile to get the internal user ID
        const { data: userProfile, error: userProfileError } = await supabase
            .from('users')
            .select('id')
            .eq('auth_user_id', userId)
            .single();

        if (userProfileError || !userProfile) {
            console.error('Error fetching user profile:', userProfileError);
            return NextResponse.json(
                { error: 'User profile not found', details: userProfileError?.message },
                { status: 404 }
            );
        }

        // 2. Validate Topic ID
        if (!topicId) {
            return NextResponse.json({ error: 'Topic ID is required' }, { status: 400 });
        }
        // Optional: Check if topic exists and is not locked before allowing post
        // const { data: topicData, error: topicCheckError } = await supabase.from('forum_topics').select('id, is_locked').eq('id', topicId).maybeSingle();
        // if (topicCheckError || !topicData) return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
        // if (topicData.is_locked) return NextResponse.json({ error: 'Topic is locked' }, { status: 403 });


        // 3. Parse Request Body
        let body;
        try {
            body = await request.json();
        } catch (e) {
            return NextResponse.json({ error: 'Invalid request body: Must be JSON' }, { status: 400 });
        }
        const { content, parentPostId } = body; // Expect content and optional parentPostId for replies

        // 4. Validate Input
        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json({ error: 'Post content is required' }, { status: 400 });
        }
        if (parentPostId && typeof parentPostId !== 'string') {
             return NextResponse.json({ error: 'Invalid parentPostId' }, { status: 400 });
        }

        // 5. Insert New Post
        const { data: newPost, error: postError } = await supabase
            .from('forum_posts')
            .insert({
                content: content.trim(),
                topic_id: topicId,
                author_id: userProfile.id,
                parent_post_id: parentPostId || null, // Handle optional parent post ID
            })
            .select(`
                id,
                content,
                created_at,
                updated_at,
                parent_post_id,
                author_id,
                author:users ( id, username, avatar_url )
            `) // Select data to return, including author info
            .single();

        if (postError) {
            console.error(`Error creating post in topic ${topicId}:`, postError);
             // Check for specific errors like foreign key violation if topicId is invalid
            if (postError.code === '23503') {
                return NextResponse.json({ error: 'Invalid Topic ID or Author ID', details: postError.message }, { status: 400 });
            }
            return NextResponse.json({ error: 'Failed to create post', details: postError.message }, { status: 500 });
        }

        if (!newPost) {
             return NextResponse.json({ error: 'Failed to create post: No data returned' }, { status: 500 });
        }

        // Format response similar to GET
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
            }
        };

        // 6. Return Success Response
        return NextResponse.json(formattedPost, { status: 201 }); // 201 Created

    } catch (err) {
        console.error(`Unexpected error creating post in topic ${topicId}:`, err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
    }
}
